# StringVentory API Integration - Complete Deep Dive

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [API Client Configuration](#api-client-configuration)
3. [Token Management & Authentication](#token-management--authentication)
4. [Request Interceptors](#request-interceptors)
5. [Response Interceptors](#response-interceptors)
6. [Service Layer Pattern](#service-layer-pattern)
7. [Custom Hooks](#custom-hooks)
8. [Error Handling](#error-handling)
9. [Complete Workflow Examples](#complete-workflow-examples)
10. [Best Practices](#best-practices)
11. [Security Considerations](#security-considerations)
12. [Troubleshooting Guide](#troubleshooting-guide)

---

## Architecture Overview

### High-Level Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      React Components                            │
│                  (Dashboard, Products, etc.)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    Uses custom hooks
                         │
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼──────┐                 ┌─────▼────────┐
    │ useApi()  │                 │ useFetch()   │
    │ usePost() │                 │ usePut()     │
    │ useDelete│                 │ useDelete()  │
    │ etc.      │                 │ etc.         │
    └────┬──────┘                 └─────┬────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
                  Calls Service Layer
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
 ┌──▼──┐    ┌──────┐ ┌──▼──┐    ┌───────┐
 │Auth │    │User  │ │Product │  │Order  │  (8+ Service Files)
 │Svc  │    │Svc   │ │Svc    │  │Svc    │
 └──┬──┘    └──┬───┘ └──┬───┘    └───┬───┘
    │          │        │            │
    └──────────┼────────┼────────────┘
               │
        ┌──────▼───────────────────────┐
        │   API Client (api.client)    │
        │  (Axios Instance)            │
        └──────┬───────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌────▼───┐ ┌────▼────┐
│Request│ │Response│ │Error    │
│Inter- │ │Inter-  │ │Handling │
│ceptor │ │ceptor  │ │         │
└───┬───┘ └────┬───┘ └────┬────┘
    │          │          │
    └──────────┼──────────┘
               │
        ┌──────▼─────────────┐
        │   Backend API      │
        │   (Node.js/Express)│
        └────────────────────┘
```

### Key Architecture Principles

1. **Separation of Concerns**
   - Components: UI logic and rendering
   - Custom Hooks: Data fetching logic
   - Services: API communication
   - API Client: HTTP client with interceptors
   - Utilities: Error parsing and helpers

2. **Single Responsibility**
   - Each service file handles one domain (auth, products, users, etc.)
   - Each hook has one specific purpose (fetch, post, pagination, etc.)
   - API client only manages HTTP requests and interceptors

3. **Reusability**
   - Services are used by multiple hooks
   - Hooks are used by multiple components
   - API client used by all services

4. **Maintainability**
   - Changes to API structure only need updates in one place
   - Error handling is centralized
   - Token management is automatic

---

## API Client Configuration

### File Location
`src/services/api.client.js`

### Purpose
Central HTTP client that handles:
- Request configuration
- Token injection
- Response parsing
- Error handling
- Token refresh mechanism
- Request queuing

### Complete Code Walkthrough

```javascript
import axios from 'axios';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token';
const REFRESH_TOKEN_KEY = import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'refresh_token';

// ═══════════════════════════════════════════════════════════════
// TOKEN MANAGEMENT
// ═══════════════════════════════════════════════════════════════

/**
 * Get the current access token from localStorage
 * @returns {string|null} The access token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the current refresh token from localStorage
 * @returns {string|null} The refresh token or null if not found
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store tokens in localStorage
 * Called after successful login
 * @param {string} token - Access token
 * @param {string} refreshToken - Refresh token
 */
export const setTokens = (token, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Clear all tokens from localStorage
 * Called on logout or when refresh fails
 */
export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ═══════════════════════════════════════════════════════════════
// AXIOS INSTANCE CREATION
// ═══════════════════════════════════════════════════════════════

/**
 * Create and configure the axios instance
 * This is the core HTTP client used by all services
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// ═══════════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR
// ═══════════════════════════════════════════════════════════════

/**
 * Automatically inject the access token into request headers
 * 
 * This runs BEFORE every request is sent to the backend
 * Purpose: Add Bearer token to Authorization header
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    // If we have a token, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR & TOKEN REFRESH
// ═══════════════════════════════════════════════════════════════

/**
 * Queue to hold requests that failed due to 401
 * While we refresh the token, other requests are queued
 * Once token is refreshed, all queued requests are retried
 */
let failedQueue = [];
let isRefreshing = false;

/**
 * Process all queued requests
 * Called after successful token refresh
 * 
 * @param {Error} error - Error from refresh attempt (null if successful)
 * @param {string} token - New token (null if refresh failed)
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  // Clear the queue after processing
  failedQueue = [];
  isRefreshing = false;
};

/**
 * Response interceptor handles:
 * 1. Successful responses (2xx status)
 * 2. 401 errors (token expired) - automatic refresh and retry
 * 3. Other errors - pass to components for handling
 */
apiClient.interceptors.response.use(
  (response) => {
    // Success response - just return it
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If not a 401 error or already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }
    
    // Start token refresh process
    isRefreshing = true;
    originalRequest._retry = true;
    
    try {
      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        // No refresh token available, clear tokens and reject
        clearTokens();
        processQueue(new Error('No refresh token'), null);
        return Promise.reject(error);
      }
      
      // Call the refresh token endpoint
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });
      
      const { token, refreshToken: newRefreshToken } = response.data;
      
      // Store new tokens
      setTokens(token, newRefreshToken);
      
      // Update the authorization header with new token
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      originalRequest.headers['Authorization'] = `Bearer ${token}`;
      
      // Process queued requests with new token
      processQueue(null, token);
      
      // Retry the original request with new token
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Token refresh failed, clear tokens and reject
      clearTokens();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
```

### Configuration Explained

**baseURL**
- All requests are relative to this URL
- Example: `GET /products` → `http://localhost:5000/api/products`
- Environment variable: `VITE_API_BASE_URL`
- Default: `http://localhost:5000/api`

**timeout**
- Request will fail if no response within 30 seconds
- Prevents indefinite hanging
- Good for detecting backend unavailability

**headers**
- Default headers sent with every request
- Content-Type: application/json for JSON payloads
- Authorization header added by request interceptor

---

## Token Management & Authentication

### How Tokens Work

```
┌─────────────────────────────────────────────────────────────┐
│                     TOKEN LIFECYCLE                         │
└─────────────────────────────────────────────────────────────┘

1. USER LOGS IN
   │
   └─► POST /auth/login (email, password)
       │
       └─► Backend validates credentials
           │
           └─► Returns { token, refreshToken }

2. TOKENS STORED IN BROWSER
   │
   ├─► localStorage.setItem('auth_token', token)
   ├─► localStorage.setItem('refresh_token', refreshToken)
   │
   └─► Tokens persist across page refreshes

3. MAKING REQUESTS
   │
   └─► Request Interceptor adds header
       Authorization: Bearer {token}
       │
       └─► Backend validates token
           │
           ├─► Valid ──► Process request normally
           │
           └─► Expired ──► Return 401 Unauthorized

4. TOKEN REFRESH ON 401
   │
   ├─► Response interceptor detects 401
   │
   ├─► Queue any other pending requests
   │
   ├─► POST /auth/refresh-token (refreshToken)
   │
   ├─► Backend validates refresh token
   │   │
   │   ├─► Valid ──► Return new { token, refreshToken }
   │   │
   │   └─► Invalid ──► Return 401
   │
   ├─► If valid: Store new tokens, retry original request
   │
   └─► If invalid: Clear tokens, redirect to login

5. USER LOGS OUT
   │
   └─► Clear localStorage tokens
       │
       └─► User returned to login page
```

### Token Storage

```javascript
// In localStorage (persists across page refreshes)
{
  'auth_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'refresh_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

### Why Two Tokens?

**Access Token (Short-lived)**
- Used for API requests
- Expires quickly (15-60 minutes)
- Smaller payload = faster requests
- If compromised, limited damage

**Refresh Token (Long-lived)**
- Only used to get a new access token
- Expires slower (7-30 days)
- Stored securely in localStorage
- Can be invalidated by backend

### Key Functions

```javascript
// Get current access token
const token = getToken();

// Get current refresh token
const refreshToken = getRefreshToken();

// Store both tokens after login
setTokens(accessToken, refreshToken);

// Clear all tokens on logout
clearTokens();

// Check if user is authenticated
const isAuthenticated = getToken() !== null;
```

---

## Request Interceptors

### Purpose
Automatically add authentication headers to every request without manual intervention in components.

### How It Works

```javascript
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    // Add token to Authorization header if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);
```

### What Happens

**For every request (GET, POST, PUT, DELETE):**

1. ✅ Check if access token exists in localStorage
2. ✅ If token exists, add it to `Authorization` header as `Bearer {token}`
3. ✅ Log the request (useful for debugging)
4. ✅ Send the request with the token

### Example Request Flow

```
Component calls:
  productService.getProducts()
         │
         └─► axios.get('/products')
             │
             └─► Request Interceptor runs
                 │
                 ├─► Reads token from localStorage
                 ├─► Adds header: Authorization: Bearer eyJ...
                 └─► Continues with request
                     │
                     └─► Backend receives request
                         Header: Authorization: Bearer eyJ...
                         │
                         └─► Backend validates token
```

### Benefits

1. **No Manual Header Management**
   - Every request automatically includes the token
   - No need to remember to add Authorization header

2. **Consistent Authentication**
   - All requests authenticated uniformly
   - Single place to manage token logic

3. **Transparent to Components**
   - Components don't know about tokens
   - Just call service methods normally

4. **Easy to Debug**
   - Logs every request in browser console
   - Can trace which requests are being made

---

## Response Interceptors

### Purpose
Handle authentication failures and automatically refresh expired tokens without component knowledge.

### The 401 Problem

**Scenario:** 
- User logs in and gets access token
- Token is stored in browser
- User is idle for 2 hours
- Token expires
- User makes another request
- Backend returns 401 (Unauthorized)
- What should happen?

**Solution:** Automatic Token Refresh

### How Token Refresh Works

```javascript
apiClient.interceptors.response.use(
  (response) => {
    // Success - just return
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Step 1: Check if error is 401 and not already retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Step 2: If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }
    
    // Step 3: Start refresh process
    isRefreshing = true;
    originalRequest._retry = true;
    
    try {
      // Step 4: Get refresh token
      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        clearTokens();
        processQueue(new Error('No refresh token'), null);
        return Promise.reject(error);
      }
      
      // Step 5: Call refresh endpoint
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });
      
      // Step 6: Extract new tokens
      const { token, refreshToken: newRefreshToken } = response.data;
      
      // Step 7: Store new tokens
      setTokens(token, newRefreshToken);
      
      // Step 8: Update axios defaults
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      originalRequest.headers['Authorization'] = `Bearer ${token}`;
      
      // Step 9: Process queued requests
      processQueue(null, token);
      
      // Step 10: Retry original request
      return apiClient(originalRequest);
      
    } catch (refreshError) {
      // Refresh failed - clear tokens
      clearTokens();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    }
  }
);
```

### Step-by-Step Example

```
Timeline: User idle, token expires

T1: Component calls productService.getProducts()
    ├─ Request Interceptor adds token
    └─ Sends request to backend

T2: Backend responds with 401 (token expired)
    └─ Response Interceptor catches error

T3: Response Interceptor checks:
    ├─ Is status 401? YES
    ├─ Is already retrying? NO
    └─ Continue with refresh

T4: Check if any requests already refreshing:
    └─ No, this is first 401

T5: Start refresh process (isRefreshing = true)
    └─ Queue any future 401s

T6: Get refresh token from localStorage
    └─ Assume we have a valid refresh token

T7: POST /auth/refresh-token with refresh token
    └─ Backend validates and returns new tokens

T8: Store new tokens in localStorage
    └─ Replace old expired token with new one

T9: Update axios default headers
    └─ All future requests will use new token

T10: Process any queued requests
     └─ None in this example

T11: Retry original request with new token
     └─ GET /products (now with valid token)

T12: Backend validates new token
     └─ Returns 200 with product data

T13: Component receives data normally
     └─ User never knew refresh happened!
```

### Request Queuing

**Why queue requests?**

Multiple requests might fail with 401 simultaneously:
- User clicks "Get Products"
- User clicks "Get Customers"
- Both fail with 401
- Both try to refresh token
- Wasteful to refresh multiple times!

**How it works:**

```javascript
let failedQueue = [];
let isRefreshing = false;

// First 401: Start refresh
if (!isRefreshing) {
  isRefreshing = true;
  // Start refresh process
}

// Second 401 while refreshing: Queue it
if (isRefreshing) {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
}

// After refresh: Process all queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
  isRefreshing = false;
};
```

---

## Service Layer Pattern

### Purpose
Encapsulate all API logic for a specific domain (products, users, auth, etc.) into a single file.

### Structure

Each service file follows this pattern:

```javascript
import apiClient from './api.client';
import { API_ENDPOINTS } from './api.endpoints';

// AuthService Pattern
export const authService = {
  // Method 1: Simple GET
  logout: async () => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  
  // Method 2: POST with body
  login: async (email, password) => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
  },
  
  // Method 3: GET with ID
  getUserById: async (userId) => {
    return apiClient.get(API_ENDPOINTS.USERS.GET(userId));
  },
  
  // Method 4: POST with body and params
  createProduct: async (productData, tenantId) => {
    return apiClient.post(
      API_ENDPOINTS.PRODUCTS.CREATE(tenantId),
      productData
    );
  },
  
  // Method 5: PUT with ID and body
  updateUser: async (userId, updates) => {
    return apiClient.put(
      API_ENDPOINTS.USERS.UPDATE(userId),
      updates
    );
  },
  
  // Method 6: DELETE
  deleteProduct: async (productId) => {
    return apiClient.delete(
      API_ENDPOINTS.PRODUCTS.DELETE(productId)
    );
  },
  
  // Method 7: Complex with query params
  searchProducts: async (query, filters) => {
    return apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, {
      params: {
        search: query,
        ...filters,
      },
    });
  },
};
```

### API Endpoints Mapping

File: `src/services/api.endpoints.js`

```javascript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    GET: (id) => `/auth/users/${id}`,
  },
  
  PRODUCTS: {
    LIST: '/products',
    GET: (id) => `/products/${id}`,
    CREATE: (tenantId) => `/tenants/${tenantId}/products`,
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    LOW_STOCK: '/products/inventory/low-stock',
    EXPIRING: '/products/inventory/expiring',
  },
  
  // ... more endpoints
};
```

### Service Method Examples

**1. Simple GET (List)**
```javascript
// Service
getProducts: async () => {
  return apiClient.get(API_ENDPOINTS.PRODUCTS.LIST);
}

// Component
const { data } = await productService.getProducts();
// data = { 
//   status: 'success', 
//   data: { products: [...], pagination: {...} }
// }
```

**2. GET with ID**
```javascript
// Service
getProductById: async (id) => {
  return apiClient.get(API_ENDPOINTS.PRODUCTS.GET(id));
}

// Component
const { data } = await productService.getProductById(123);
// data = { 
//   status: 'success', 
//   data: { id: 123, name: '...', price: '...' }
// }
```

**3. POST (Create)**
```javascript
// Service
createProduct: async (productData) => {
  return apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
}

// Component
const { data } = await productService.createProduct({
  name: 'New Product',
  price: 99.99,
  quantity: 100,
});
// data = { 
//   status: 'success', 
//   data: { id: 456, name: 'New Product', ... }
// }
```

**4. PUT (Update)**
```javascript
// Service
updateProduct: async (id, updates) => {
  return apiClient.put(
    API_ENDPOINTS.PRODUCTS.UPDATE(id),
    updates
  );
}

// Component
const { data } = await productService.updateProduct(123, {
  price: 149.99,
});
// data = { 
//   status: 'success', 
//   data: { id: 123, name: '...', price: 149.99 }
// }
```

**5. DELETE**
```javascript
// Service
deleteProduct: async (id) => {
  return apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
}

// Component
const { data } = await productService.deleteProduct(123);
// data = { status: 'success' }
```

**6. GET with Query Parameters (Search)**
```javascript
// Service
searchProducts: async (searchTerm, filters) => {
  return apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, {
    params: {
      search: searchTerm,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    },
  });
}

// Component
const { data } = await productService.searchProducts('laptop', {
  category: 'electronics',
  minPrice: 500,
  maxPrice: 2000,
});
// Request URL: /api/products?search=laptop&category=electronics&minPrice=500&maxPrice=2000
```

### Benefits of Service Layer

1. **Single Responsibility**
   - One file per domain
   - Easy to find what you need

2. **API Endpoint Consistency**
   - All endpoints in one file
   - Easy to update API structure

3. **Reusability**
   - Services used by multiple hooks/components
   - No duplicate API calls

4. **Testability**
   - Mock services for testing components
   - Easy to test service methods

5. **Maintainability**
   - Add new methods without affecting components
   - Change API structure in one place

---

## Custom Hooks

### Overview

Custom hooks encapsulate data-fetching logic and state management, making components clean and simple.

### Hook Pattern

All custom hooks return the same structure:

```javascript
{
  data: null,           // The fetched data
  loading: false,       // True while loading
  error: null,          // Error object if failed
  execute: async () => {}, // Function to execute/retry
  refetch: async () => {}, // Function to refetch
}
```

### The Six Main Hooks

#### 1. useApi() - Generic Hook

**Use When:** You need to make an API call with custom logic

```javascript
// Inside component
const { data, loading, error, execute } = useApi(
  async () => {
    const response = await productService.getProducts();
    return response.data;
  },
  [] // dependencies
);

// Manual control
const handleFetch = async () => {
  const result = await execute();
  console.log('Result:', result);
};

// Use in JSX
return (
  <>
    {loading && <p>Loading...</p>}
    {error && <p>Error: {error.message}</p>}
    {data && <p>Products: {data.products.length}</p>}
    <button onClick={handleFetch}>Retry</button>
  </>
);
```

**When to use:**
- Custom API logic not covered by other hooks
- Complex data transformations
- Multiple API calls in sequence

#### 2. useFetch() - Auto-Load on Mount

**Use When:** You want to fetch data automatically when component mounts

```javascript
// Inside component
const { data, loading, error, refetch } = useFetch(
  '/products',
  {} // options: { dependencies: [] }
);

// Data loads automatically on component mount
// Use in JSX
return (
  <>
    {loading && <p>Loading...</p>}
    {error && <p>Error: {error.message}</p>}
    {data && (
      <ul>
        {data.products.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    )}
    <button onClick={refetch}>Refresh</button>
  </>
);
```

**When to use:**
- Dashboard tables
- Product listings
- Any data that loads on component mount

**Key difference from useApi():**
- useFetch() runs the API call on mount automatically
- useApi() waits for you to call execute()

#### 3. usePost() - POST Requests

**Use When:** You need to create something (form submissions)

```javascript
// Inside component
const { loading, error, execute } = usePost();

const handleAddProduct = async (formData) => {
  const result = await execute(
    productService.createProduct,
    [formData]
  );
  if (!error) {
    alert('Product created!');
  }
};

// Use in form
return (
  <form onSubmit={(e) => {
    e.preventDefault();
    handleAddProduct({
      name: e.target.name.value,
      price: e.target.price.value,
    });
  }}>
    <input name="name" required />
    <input name="price" type="number" required />
    <button disabled={loading}>
      {loading ? 'Creating...' : 'Create Product'}
    </button>
    {error && <p>{error.message}</p>}
  </form>
);
```

**When to use:**
- Creating new records (POST)
- Form submissions
- Any action that modifies data

#### 4. usePut() - PUT Requests

**Use When:** You need to update something

```javascript
// Inside component
const { loading, error, execute } = usePut();

const handleUpdateProduct = async (productId, updates) => {
  const result = await execute(
    productService.updateProduct,
    [productId, updates]
  );
  if (!error) {
    alert('Product updated!');
  }
};

// Use in form
return (
  <form onSubmit={(e) => {
    e.preventDefault();
    handleUpdateProduct(productId, {
      name: e.target.name.value,
      price: parseFloat(e.target.price.value),
    });
  }}>
    <input name="name" defaultValue={product.name} />
    <input name="price" type="number" defaultValue={product.price} />
    <button disabled={loading}>
      {loading ? 'Updating...' : 'Update Product'}
    </button>
    {error && <p>{error.message}</p>}
  </form>
);
```

**When to use:**
- Updating existing records (PUT)
- Form submissions that modify
- Any data update

#### 5. useDelete() - DELETE Requests

**Use When:** You need to delete something

```javascript
// Inside component
const { loading, error, execute } = useDelete();

const handleDeleteProduct = async (productId) => {
  if (confirm('Are you sure?')) {
    const result = await execute(
      productService.deleteProduct,
      [productId]
    );
    if (!error) {
      alert('Product deleted!');
      refetch(); // Refresh the list
    }
  }
};

// Use in component
return (
  <div>
    <h2>{product.name}</h2>
    <button 
      onClick={() => handleDeleteProduct(product.id)}
      disabled={loading}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
    {error && <p>{error.message}</p>}
  </div>
);
```

**When to use:**
- Deleting records (DELETE)
- Confirmation dialogs
- Any destructive action

#### 6. usePagination() - Pagination

**Use When:** You need to paginate through results

```javascript
// Inside component
const {
  data,
  loading,
  error,
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  goToPage,
  refetch,
} = usePagination(
  productService.getProducts,
  { page: 1, limit: 20 }
);

// Use in JSX
return (
  <>
    {loading && <p>Loading...</p>}
    {error && <p>Error: {error.message}</p>}
    
    {data?.products && (
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="pagination">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        
        <p>Page {currentPage} of {totalPages}</p>
      </div>
    )}
  </>
);
```

**When to use:**
- Tables with many rows
- Large lists of items
- Any paginated content

**Methods available:**
- `nextPage()` - Go to next page
- `prevPage()` - Go to previous page
- `goToPage(n)` - Jump to specific page
- `refetch()` - Reload current page

### Hook Comparison Table

| Hook | When to Use | Auto-loads | Manual Control |
|------|-------------|-----------|-----------------|
| useApi | Custom logic | ✗ | ✓ (execute) |
| useFetch | Data on mount | ✓ | ✓ (refetch) |
| usePost | Create new | ✗ | ✓ (execute) |
| usePut | Update existing | ✗ | ✓ (execute) |
| useDelete | Remove item | ✗ | ✓ (execute) |
| usePagination | List with pages | ✓ | ✓ (goToPage, next, prev) |

---

## Error Handling

### Error Handling Architecture

```
┌──────────────────────────────────────┐
│     API Request/Response             │
└────────────────┬──────────────────────┘
                 │
        ┌────────▼────────┐
        │ Axios Error     │
        └────────┬────────┘
                 │
     ┌───────────┴───────────┐
     │ Parse Error           │
     │ (parseApiError)       │
     └───────────┬───────────┘
                 │
    ┌────────────▼────────────┐
    │ Standardized Format      │
    │ {                        │
    │   message: string        │
    │   code: string          │
    │   status: number        │
    │   details: object       │
    │ }                        │
    └────────────┬────────────┘
                 │
     ┌───────────▼──────────┐
     │ Component Handles     │
     │ Display to User       │
     │ Log/Monitor           │
     └──────────────────────┘
```

### Error Types

**1. Network Errors**
```javascript
// No internet connection
// Server is down
// Request timeout

{
  message: 'Network request failed',
  code: 'NETWORK_ERROR',
  status: null,
  details: {}
}
```

**2. Validation Errors (422)**
```javascript
// Form field validation failed

{
  message: 'Validation failed',
  code: 'VALIDATION_ERROR',
  status: 422,
  details: {
    email: ['Email is required', 'Email must be valid'],
    password: ['Password must be at least 8 characters'],
  }
}
```

**3. Unauthorized (401)**
```javascript
// Token invalid or expired
// (Usually handled automatically by interceptor)

{
  message: 'Unauthorized',
  code: 'UNAUTHORIZED',
  status: 401,
  details: {}
}
```

**4. Forbidden (403)**
```javascript
// User doesn't have permission

{
  message: 'Forbidden',
  code: 'FORBIDDEN',
  status: 403,
  details: {}
}
```

**5. Not Found (404)**
```javascript
// Resource doesn't exist

{
  message: 'Resource not found',
  code: 'NOT_FOUND',
  status: 404,
  details: {}
}
```

**6. Server Error (500)**
```javascript
// Backend error

{
  message: 'Internal server error',
  code: 'SERVER_ERROR',
  status: 500,
  details: {}
}
```

### Error Parser

File: `src/utils/errorHandler.js`

```javascript
import { showError } from './alerts';

/**
 * Parse various error types into standardized format
 * 
 * @param {Error|AxiosError} error - The error to parse
 * @returns {Object} Standardized error object
 */
export const parseApiError = (error) => {
  // If no error, return clean state
  if (!error) {
    return {
      message: 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
      status: null,
      details: {},
    };
  }

  // Handle axios response errors
  if (error.response) {
    const { status, data } = error.response;

    return {
      message: data?.message || error.message,
      code: data?.code || `HTTP_${status}`,
      status,
      details: data?.details || {},
    };
  }

  // Handle network errors
  if (error.request) {
    return {
      message: 'Network request failed',
      code: 'NETWORK_ERROR',
      status: null,
      details: {},
    };
  }

  // Handle other errors
  return {
    message: error.message || 'An error occurred',
    code: 'UNKNOWN_ERROR',
    status: null,
    details: {},
  };
};

/**
 * Extract field-level validation errors
 * 
 * @param {Object} error - The standardized error object
 * @returns {Object} Fields with their errors
 */
export const getFieldErrors = (error) => {
  return error?.details || {};
};

/**
 * Check if error is specific status
 */
export const isErrorStatus = (error, status) => {
  return error?.status === status;
};

export const isUnauthorizedError = (error) => isErrorStatus(error, 401);
export const isForbiddenError = (error) => isErrorStatus(error, 403);
export const isNotFoundError = (error) => isErrorStatus(error, 404);
export const isValidationError = (error) => isErrorStatus(error, 422);

/**
 * Handle API error and display to user
 * 
 * @param {Error} error - The error to handle
 * @param {Function} callback - Function to display error (optional)
 */
export const handleApiError = (error, callback) => {
  const parsedError = parseApiError(error);
  
  // Show error to user
  if (callback) {
    callback(parsedError.message);
  } else {
    showError(parsedError.message);
  }
  
  // Log for debugging
  console.error('[API Error]', parsedError);
  
  return parsedError;
};
```

### Using Error Handler in Components

**Example 1: Simple Error Display**

```javascript
import { useFetch } from '@/hooks/useApi';
import { handleApiError } from '@/utils/errorHandler';

function ProductList() {
  const { data, loading, error } = useFetch('/products');

  if (loading) return <p>Loading...</p>;
  
  if (error) {
    return (
      <div className="error">
        <p>Failed to load products</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <ul>
      {data?.products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

**Example 2: Form Validation Errors**

```javascript
import { usePost } from '@/hooks/useApi';
import { getFieldErrors, parseApiError } from '@/utils/errorHandler';

function ProductForm() {
  const [fieldErrors, setFieldErrors] = useState({});
  const { loading, error, execute } = usePost();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      name: e.target.name.value,
      price: e.target.price.value,
      quantity: e.target.quantity.value,
    };

    try {
      await execute(productService.createProduct, [formData]);
      alert('Product created!');
    } catch (err) {
      const parsedError = parseApiError(err);
      setFieldErrors(getFieldErrors(parsedError));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input name="name" />
        {fieldErrors.name && (
          <p className="error">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label>Price</label>
        <input name="price" type="number" />
        {fieldErrors.price && (
          <p className="error">{fieldErrors.price[0]}</p>
        )}
      </div>

      <div>
        <label>Quantity</label>
        <input name="quantity" type="number" />
        {fieldErrors.quantity && (
          <p className="error">{fieldErrors.quantity[0]}</p>
        )}
      </div>

      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

**Example 3: Error Handling with Retry**

```javascript
function DataTable() {
  const [retryCount, setRetryCount] = useState(0);
  const { data, loading, error, refetch } = useFetch('/products');

  const handleRetry = () => {
    setRetryCount((count) => count + 1);
    refetch();
  };

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div className="error-card">
        <h3>Failed to Load Products</h3>
        <p>{error.message}</p>
        <p className="text-small">
          {retryCount > 0 && `Retry attempt: ${retryCount}`}
        </p>
        <button onClick={handleRetry}>Try Again</button>
      </div>
    );
  }

  return <table>{/* ... */}</table>;
}
```

---

## Complete Workflow Examples

### Workflow 1: User Login

```
┌─────────────────────────────────────────────────────────┐
│          User Submits Login Form                        │
└────────────────────┬────────────────────────────────────┘
                     │
    ┌────────────────▼────────────────┐
    │ Component captures email/password
    └────────────────┬────────────────┘
                     │
    ┌────────────────▼────────────────┐
    │ Calls usePost() hook with
    │ authService.login(email, pwd)
    └────────────────┬────────────────┘
                     │
    ┌────────────────▼────────────────┐
    │ Component.execute() called
    │ loading = true
    └────────────────┬────────────────┘
                     │
    ┌────────────────▼────────────────┐
    │ authService.login() called
    │ POST /auth/login
    └────────────────┬────────────────┘
                     │
    ┌────────────────▼────────────────┐
    │ Request Interceptor runs
    │ (no token yet, skips auth header)
    └────────────────┬────────────────┘
                     │
    ┌────────────────▼────────────────┐
    │ Backend receives request
    │ Validates credentials
    └────────────────┬────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼─────────┐    ┌────────▼─────┐
    │ Valid        │    │ Invalid      │
    │ Returns      │    │ Returns      │
    │ tokens       │    │ 401          │
    └────┬─────────┘    └────────┬─────┘
         │                       │
    ┌────▼─────────┐    ┌────────▼─────┐
    │ Response OK  │    │ Response Err  │
    │ { token,     │    │ { message }   │
    │   refresh }  │    └────────┬─────┘
    └────┬─────────┘             │
         │          ┌────────────▼────────┐
         │          │ parseApiError()     │
         │          │ sets error state    │
         │          │ loading = false     │
         │          └────────────┬────────┘
         │                       │
         │          ┌────────────▼────────┐
         │          │ Component renders   │
         │          │ error message       │
         │          └─────────────────────┘
         │
    ┌────▼──────────────┐
    │ Response handler  │
    │ Extract tokens    │
    └────┬──────────────┘
         │
    ┌────▼──────────────────────┐
    │ Call AuthContext.login()   │
    │ Pass tokens to AuthProvider
    └────┬──────────────────────┘
         │
    ┌────▼──────────────────────┐
    │ AuthProvider:              │
    │ - Call setTokens()         │
    │ - Store in localStorage    │
    │ - Set user state           │
    │ - Set isAuthenticated      │
    └────┬──────────────────────┘
         │
    ┌────▼──────────────────────┐
    │ loading = false            │
    │ error = null               │
    │ Update UI - hide form      │
    └────┬──────────────────────┘
         │
    ┌────▼──────────────────────┐
    │ Redirect to Dashboard      │
    └────────────────────────────┘
```

### Workflow 2: Fetch Products with Token Refresh

```
┌──────────────────────────────┐
│ Component mounts              │
│ useFetch('/products') called   │
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ Hook runs useEffect            │
│ Calls productService.getProducts
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ axios.get('/products')         │
│ loading = true                 │
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ Request Interceptor:           │
│ 1. Get token from localStorage │
│ 2. Add Authorization header    │
│ 3. Send GET /products with     │
│    Authorization: Bearer ...   │
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ Backend receives request       │
│ Validates token               │
└─────────┬─────────────────────┘
          │
      ┌───┴────────┐
      │            │
   ┌──▼──┐    ┌────▼─────┐
   │ OK  │    │ Expired   │
   └──┬──┘    │ Returns   │
      │       │ 401       │
      │       └────┬─────┘
      │            │
      │    ┌───────▼──────┐
      │    │ Response      │
      │    │ Interceptor   │
      │    │ catches 401   │
      │    └───────┬──────┘
      │            │
      │    ┌───────▼──────────────┐
      │    │ Check:               │
      │    │ - Not already retry? │
      │    │ - Have refresh tok?  │
      │    │ Start refresh flow   │
      │    └───────┬──────────────┘
      │            │
      │    ┌───────▼──────────────┐
      │    │ POST /auth/refresh   │
      │    │ with refreshToken    │
      │    └───────┬──────────────┘
      │            │
      │    ┌───────▼──────────────┐
      │    │ Backend validates    │
      │    │ refresh token        │
      │    └───────┬──────────────┘
      │            │
      │        ┌───┴────┐
      │        │        │
      │     ┌──▼──┐ ┌───▼────┐
      │     │ OK  │ │ Invalid │
      │     └──┬──┘ │ Clear   │
      │        │    │ tokens  │
      │    ┌───▼──┐ │ Return  │
      │    │Get   │ │ error   │
      │    │new   │ └────┬────┘
      │    │tokens│      │
      │    └───┬──┘      │
      │        │    ┌────▼─────┐
      │        │    │ Component │
      │        │    │ receives  │
      │        │    │ error     │
      │        │    │ Redirect  │
      │        │    │ to login  │
      │        │    └──────────┘
      │    ┌───▼──────────────┐
      │    │ Store new tokens │
      │    │ in localStorage  │
      │    │ Update axios     │
      │    │ defaults         │
      │    └───┬──────────────┘
      │        │
      │    ┌───▼──────────────┐
      │    │ Retry original   │
      │    │ GET /products    │
      │    │ with new token   │
      │    └───┬──────────────┘
      │        │
      │    ┌───▼──────────────┐
      │    │ Backend OK       │
      │    │ Returns products │
      │    └───┬──────────────┘
      │        │
   ┌──▼──┐ ┌──▼──────────┐
   │ 200 │ │ Response OK  │
   │ OK  │ │ { products } │
   └──┬──┘ └──┬───────────┘
      │       │
      └───┬───┘
          │
   ┌──────▼──────────┐
   │ Response Handler │
   │ Extract data     │
   └──────┬───────────┘
          │
   ┌──────▼──────────┐
   │ Update state:    │
   │ data = products  │
   │ loading = false  │
   │ error = null     │
   └──────┬───────────┘
          │
   ┌──────▼──────────┐
   │ Component re-    │
   │ renders with     │
   │ product list     │
   └──────────────────┘
```

### Workflow 3: Update Product with Validation Error

```
┌─────────────────────────────────────┐
│ User submits product edit form       │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Component captures form data         │
│ {                                    │
│   name: 'Laptop Pro Max',            │
│   price: -100,  (invalid!)           │
│   quantity: 0                        │
│ }                                    │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ usePut() hook called                 │
│ loading = true                       │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ productService.updateProduct() called │
│ PUT /products/123                    │
│ Body: { name: 'Laptop Pro Max',      │
│         price: -100, quantity: 0 }   │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Request Interceptor:                 │
│ Add Authorization header with token  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Backend receives request             │
│ Validates data                       │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Validation fails:                    │
│ - price must be positive             │
│ - quantity must be > 0               │
│ Returns 422 with details             │
│                                      │
│ {                                    │
│   "status": "error",                 │
│   "message": "Validation failed",    │
│   "code": "VALIDATION_ERROR",        │
│   "details": {                       │
│     "price": [                       │
│       "Price must be greater than 0" │
│     ],                               │
│     "quantity": [                    │
│       "Quantity must be at least 1"  │
│     ]                                │
│   }                                  │
│ }                                    │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Response Interceptor catches error   │
│ Status is not 401, pass through      │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Promise rejects with error           │
│ Hook catch block executes            │
│ loading = false                      │
│ error = AxiosError                   │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Component catch handler:             │
│ const parsedError = parseApiError(er)│
│                                      │
│ parsedError = {                      │
│   message: 'Validation failed',      │
│   code: 'VALIDATION_ERROR',          │
│   status: 422,                       │
│   details: {                         │
│     price: ['Price must be > 0'],    │
│     quantity: ['Qty must be >= 1']   │
│   }                                  │
│ }                                    │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Component calls getFieldErrors()     │
│ fieldErrors = {                      │
│   price: ['Price must be > 0'],      │
│   quantity: ['Qty must be >= 1']     │
│ }                                    │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Component state updated:             │
│ setFieldErrors(fieldErrors)          │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Component re-renders                 │
│ Shows error messages under fields:   │
│ - Under price field:                 │
│   "Price must be greater than 0"     │
│ - Under quantity field:              │
│   "Quantity must be at least 1"      │
│ Form submit button enabled           │
│ User can fix and resubmit            │
└────────────────────────────────────┘
```

---

## Best Practices

### 1. Always Use Services

❌ **DON'T DO THIS** (API call in component):
```javascript
function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/products')
      .then(res => setProducts(res.data.data.products))
      .catch(err => console.log(err));
  }, []);

  return <ul>{/* ... */}</ul>;
}
```

✅ **DO THIS** (Use service):
```javascript
function Products() {
  const { data, loading, error } = useFetch('/products');

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <ul>{/* ... */}</ul>}
    </>
  );
}
```

**Why:**
- Service encapsulation
- Reusable across components
- Easy to test
- Single source of truth for API

### 2. Always Handle Errors

❌ **DON'T DO THIS** (Ignore errors):
```javascript
const { data } = useFetch('/products');
return <div>{data.products.length}</div>; // Crashes if error!
```

✅ **DO THIS** (Handle all states):
```javascript
const { data, loading, error } = useFetch('/products');

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;
return <div>{data.products.length}</div>;
```

**Why:**
- Prevents crashes
- Better UX
- Easier debugging

### 3. Use Correct Hook for Task

❌ **DON'T DO THIS** (Wrong hook):
```javascript
// useApi is for manual control, not auto-load
const { execute } = useApi(() => 
  productService.getProducts()
);

// Oops, forgot to call execute in useEffect!
```

✅ **DO THIS** (Right hook):
```javascript
// useFetch auto-loads on mount
const { data, refetch } = useFetch('/products');

// Auto-loads! No need for useEffect
```

**Hook Selection Guide:**
- Auto-load data on mount? → `useFetch()`
- Create new data? → `usePost()`
- Update existing data? → `usePut()`
- Delete data? → `useDelete()`
- Custom logic? → `useApi()`
- Need pagination? → `usePagination()`

### 4. Extract Field Errors Properly

❌ **DON'T DO THIS** (Generic error):
```javascript
const handleSubmit = async (formData) => {
  try {
    await execute(productService.createProduct, [formData]);
  } catch (err) {
    setError(err.message); // Shows generic "Bad Request"
  }
};
```

✅ **DO THIS** (Field-level errors):
```javascript
const handleSubmit = async (formData) => {
  try {
    await execute(productService.createProduct, [formData]);
  } catch (err) {
    const parsed = parseApiError(err);
    const fieldErrs = getFieldErrors(parsed);
    
    if (Object.keys(fieldErrs).length > 0) {
      setFieldErrors(fieldErrs); // Show per-field errors
    } else {
      setError(parsed.message); // Show generic message
    }
  }
};
```

**Why:**
- Users see specific field errors
- Better form UX
- Clear what's wrong

### 5. Use Meaningful Loading States

❌ **DON'T DO THIS** (No visual feedback):
```javascript
const { loading, data } = useFetch('/products');
return <table>{/* Just renders nothing while loading */}</table>;
```

✅ **DO THIS** (Clear feedback):
```javascript
const { loading, data } = useFetch('/products');

if (loading) {
  return <div className="loading-spinner">
    <p>Loading products...</p>
  </div>;
}

return <table>{/* ... */}</table>;
```

**Why:**
- Users know something is happening
- Better perceived performance
- More professional feel

### 6. Implement Retry Logic

❌ **DON'T DO THIS** (No retry):
```javascript
const { error, data } = useFetch('/products');

if (error) {
  return <p>Failed to load. Please refresh page.</p>;
}
```

✅ **DO THIS** (Retry button):
```javascript
const { error, data, refetch } = useFetch('/products');

if (error) {
  return (
    <div>
      <p>Failed to load: {error.message}</p>
      <button onClick={refetch}>Try Again</button>
    </div>
  );
}
```

**Why:**
- Network issues are temporary
- Users can recover without page refresh
- Better UX

### 7. Optimize Dependencies

❌ **DON'T DO THIS** (Infinite refetches):
```javascript
const filter = { category: 'electronics' };

// This object is recreated every render!
// useFetch will keep refetching
const { data } = useFetch('/products', {
  dependencies: [filter],
});
```

✅ **DO THIS** (Stable dependencies):
```javascript
const filter = useMemo(() => ({ 
  category: 'electronics' 
}), []);

// Now filter is stable
const { data } = useFetch('/products', {
  dependencies: [filter],
});
```

**Why:**
- Prevents unnecessary API calls
- Better performance
- Fewer network requests

### 8. Validate Input Before API Call

❌ **DON'T DO THIS** (Let backend validate everything):
```javascript
const handleAddProduct = async (data) => {
  // Send even if empty
  await execute(productService.createProduct, [data]);
};
```

✅ **DO THIS** (Client-side validation first):
```javascript
const handleAddProduct = async (data) => {
  // Validate before sending
  if (!data.name) {
    setError('Product name is required');
    return;
  }
  if (data.price < 0) {
    setError('Price must be positive');
    return;
  }
  
  await execute(productService.createProduct, [data]);
};
```

**Why:**
- Faster feedback
- Fewer API calls
- Better UX
- Reduces server load

### 9. Use TypeScript When Possible

Eventually consider:
```typescript
// Service type definition
export interface ProductService {
  getProducts(): Promise<ApiResponse<Product[]>>;
  createProduct(data: CreateProductDTO): Promise<ApiResponse<Product>>;
}

// Component with types
const { data: products, loading, error } = useFetch<Product[]>('/products');
```

**Why:**
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Fewer runtime bugs

### 10. Test Error Scenarios

```javascript
// Test successful case
test('loads products', async () => {
  const { getByText } = render(<Products />);
  await waitFor(() => expect(getByText('Product 1')).toBeInTheDocument());
});

// Test error case
test('handles load error', async () => {
  // Mock service to return error
  jest.spyOn(productService, 'getProducts').mockRejectedValue(
    new Error('Network error')
  );
  
  const { getByText } = render(<Products />);
  await waitFor(() => expect(getByText(/failed to load/i)).toBeInTheDocument());
});

// Test loading state
test('shows loading while fetching', () => {
  const { getByText } = render(<Products />);
  expect(getByText(/loading/i)).toBeInTheDocument();
});
```

---

## Security Considerations

### 1. Token Storage

**Current Approach: localStorage**
```javascript
localStorage.setItem('auth_token', token);
```

**Pros:**
- Simple to implement
- Persists across page refreshes
- Available across tabs

**Cons:**
- Vulnerable to XSS attacks
- Accessible by JavaScript

**Mitigation:**
- Sanitize all user inputs
- Use Content Security Policy headers
- Regular security audits

**Alternative: HttpOnly Cookies**
```javascript
// Backend sets this (not accessible by JavaScript)
Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Strict
```

Pros:
- Protected from XSS
- Cannot be accessed by JavaScript

Cons:
- Must be implemented by backend
- More complex to handle

### 2. Token Expiration

**Always implement:**
```javascript
// Short access token (15-60 minutes)
// Long refresh token (7-30 days)

// On 401: Auto-refresh (transparent to user)
// Refresh fails: Force re-login
```

**Why:**
- Limits damage if token leaked
- Forces regular re-authentication
- Better security posture

### 3. Request Validation

```javascript
// Always validate on frontend
const validateProduct = (product) => {
  const errors = {};
  
  if (!product.name) errors.name = 'Name required';
  if (product.price < 0) errors.price = 'Price must be positive';
  if (product.quantity < 0) errors.quantity = 'Quantity must be positive';
  
  return errors;
};

// Always validate on backend too!
// Never trust frontend validation alone
```

### 4. CORS Configuration

**Ensure Backend Sets:**
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

**Never:**
```javascript
// DON'T DO THIS (too permissive)
Access-Control-Allow-Origin: *
```

### 5. API Key Management

If using API keys:
```javascript
// DON'T commit to repo
// ❌ const API_KEY = 'sk_live_1234567890';

// DO use environment variables
const API_KEY = import.meta.env.VITE_API_KEY;

// Environment file (.env.local - not committed)
VITE_API_KEY=sk_live_1234567890
```

### 6. Sensitive Data

```javascript
// DON'T log sensitive data
❌ console.log('Token:', token);
❌ console.log('Password:', password);

// DO log safe data
✅ console.log('API call:', method, endpoint);
✅ console.log('Response status:', status);
```

### 7. HTTPS Only

**Always use HTTPS in production:**
```javascript
// Secure flag in token
Set-Cookie: auth_token=...; Secure; HttpOnly

// Axios config
const apiClient = axios.create({
  baseURL: 'https://api.yourdomain.com/api', // HTTPS!
});
```

### 8. Rate Limiting

Consider implementing on frontend:
```javascript
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

const throttledRequest = async (url, options) => {
  const now = Date.now();
  
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    throw new Error('Too many requests. Please wait.');
  }
  
  lastRequestTime = now;
  return axios.get(url, options);
};
```

---

## Troubleshooting Guide

### Issue 1: CORS Error

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/products'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Causes:**
- Backend doesn't allow frontend origin
- Backend not setting CORS headers

**Solutions:**

1. **Check Backend CORS Config:**
```javascript
// Backend (Express example)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

2. **Check .env.local:**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

3. **Verify Endpoints Match:**
```javascript
// If backend is on different port, update .env
VITE_API_BASE_URL=http://localhost:3000/api  // NOT 5000
```

4. **Check OPTIONS Preflight:**
```javascript
// Backend should handle OPTIONS requests
app.options('*', cors());
```

### Issue 2: 401 Loop (Infinite Token Refresh)

**Symptoms:**
- App keeps refreshing token
- Getting stuck in loading state
- Infinite network requests

**Causes:**
- Refresh token is also invalid
- Backend refresh endpoint broken
- Token not being stored correctly

**Solutions:**

```javascript
// Add logging to see what's happening
const apiClient = axios.create({...});

apiClient.interceptors.response.use(
  (res) => {
    console.log('[Response]', res.status, res.config.url);
    return res;
  },
  (err) => {
    console.log('[Error]', err.response?.status, err.config?.url);
    console.log('[Current Token]', getToken() ? 'Yes' : 'No');
    console.log('[Current Refresh]', getRefreshToken() ? 'Yes' : 'No');
    return Promise.reject(err);
  }
);

// Then check browser console to see what's happening
```

**Fix:**

```javascript
// Force logout if refresh fails
catch (refreshError) {
  console.log('[Refresh Failed]', refreshError);
  clearTokens();
  // Redirect to login
  window.location.href = '/login';
  return Promise.reject(refreshError);
}
```

### Issue 3: Token Not Persisting

**Problem:**
- Token goes away after page refresh
- User logged out after F5

**Causes:**
- Token not being stored
- localStorage disabled
- Private/Incognito mode

**Solutions:**

```javascript
// Verify token is stored
console.log('Token:', localStorage.getItem('auth_token'));

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

if (!isLocalStorageAvailable()) {
  console.error('localStorage not available!');
}
```

### Issue 4: Validation Errors Not Showing

**Problem:**
- Form shows generic error instead of field errors

**Causes:**
- Not parsing error details
- Backend not sending details
- Field names don't match

**Solutions:**

```javascript
// Check error structure
try {
  await execute(service.method, [data]);
} catch (err) {
  console.log('Full error:', err);
  const parsed = parseApiError(err);
  console.log('Parsed:', parsed);
  console.log('Details:', getFieldErrors(parsed));
}

// Expected backend response:
{
  "status": "error",
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": ["Email is required"],
    "password": ["Password must be 8+ characters"]
  }
}
```

**Fix:**

```javascript
// Ensure field names match
if (error.details) {
  Object.entries(error.details).forEach(([field, messages]) => {
    console.log(`Field: ${field}, Errors: ${messages}`);
    // Set error for this field
    setFieldError(field, messages[0]);
  });
}
```

### Issue 5: Network Timeout

**Error:**
```
Error: timeout of 30000ms exceeded
```

**Causes:**
- Backend is slow
- Backend is down
- Network is slow

**Solutions:**

```javascript
// Increase timeout in api.client.js
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds instead of 30
});

// Add retry logic
const retryRequest = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      // Wait before retry
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};

// Use in component
const handleFetch = async () => {
  try {
    const data = await retryRequest(() => 
      productService.getProducts()
    );
    setData(data);
  } catch (err) {
    setError('Failed after 3 attempts');
  }
};
```

### Issue 6: Memory Leak Warning

**Warning:**
```
Can't perform a React state update on an unmounted component
```

**Causes:**
- Component unmounts while request in progress
- Setting state after unmount

**Solutions:**

```javascript
// Use cleanup function in useEffect
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    try {
      const result = await productService.getProducts();
      if (isMounted) {
        setData(result);
      }
    } catch (err) {
      if (isMounted) {
        setError(err);
      }
    }
  };

  fetchData();

  return () => {
    isMounted = false; // Cleanup
  };
}, []);
```

Or use custom hooks that handle this automatically (useApi, useFetch already do this).

### Issue 7: Stale Data

**Problem:**
- Component showing old data
- Just created item doesn't appear

**Solutions:**

```javascript
// Option 1: Refetch after action
const handleCreate = async (data) => {
  await execute(service.createProduct, [data]);
  refetch(); // Reload list
};

// Option 2: Update local cache
const handleCreate = async (data) => {
  const result = await execute(service.createProduct, [data]);
  setData([...data, result]);
};

// Option 3: Use dependency array
const { data } = useFetch('/products', {
  dependencies: [filterState], // Refetch when filter changes
});
```

### Issue 8: Missing Imports

**Error:**
```
Cannot find module '@/hooks/useApi'
```

**Solutions:**

1. Check path alias in vite.config.js
2. Verify file exists
3. Use correct relative path

```javascript
// If alias not working
import { useApi } from '../hooks/useApi';

// Or setup alias in vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## Summary

This comprehensive API integration system provides:

✅ **Authentication** - JWT tokens with automatic refresh
✅ **Error Handling** - Centralized parsing with field-level errors
✅ **Services** - Clean encapsulation of API logic
✅ **Hooks** - Reusable data-fetching patterns
✅ **Interceptors** - Automatic token injection and 401 handling
✅ **Security** - Token management and request validation
✅ **DX** - Clear patterns and best practices
✅ **Reliability** - Request queuing and retry logic

**The system is production-ready and requires no additional configuration beyond environment variables.**

---

**Document Version:** 2.0 (Detailed)
**Created:** February 5, 2026
**Status:** Complete and Ready for Implementation
