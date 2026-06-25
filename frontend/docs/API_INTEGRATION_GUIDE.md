# API Integration Setup Guide

## Overview
This guide covers the complete setup and usage of the API integration layer for StringVentory.

---

## ✅ Setup Checklist

### 1. Environment Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Update `VITE_API_BASE_URL` with your backend URL
- [ ] Configure other environment variables as needed

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000
VITE_AUTH_TOKEN_KEY=stringventory_access_token
VITE_AUTH_REFRESH_TOKEN_KEY=stringventory_refresh_token
VITE_AUTH_USER_KEY=stringventory_user
```

### 2. API Client Setup
The API client is already configured in `src/services/api.client.js`:
- ✅ Axios instance with base configuration
- ✅ Request/Response interceptors
- ✅ Token management (access & refresh)
- ✅ 401 error handling with automatic token refresh
- ✅ Error queue for failed requests during refresh

### 3. Service Layer
Pre-built service files for all major modules:
- ✅ `authService.js` - Authentication
- ✅ `userService.js` - User management
- ✅ `productService.js` - Products & Categories
- ✅ `customerService.js` - Customers
- ✅ `orderService.js` - Orders
- ✅ `analyticsService.js` - Analytics & Reports

### 4. Custom Hooks
Reusable React hooks in `src/hooks/useApi.js`:
- ✅ `useApi()` - Generic API call hook
- ✅ `useFetch()` - Fetch on mount hook
- ✅ `usePost()` - POST request hook
- ✅ `usePut()` - PUT request hook
- ✅ `useDelete()` - DELETE request hook
- ✅ `usePagination()` - Pagination hook

### 5. Error Handling
Utilities in `src/utils/errorHandler.js`:
- ✅ `parseApiError()` - Parse error responses
- ✅ `getErrorMessage()` - User-friendly messages
- ✅ `getFieldErrors()` - Validation errors
- ✅ `handleApiError()` - Error display handler

### 6. AuthContext Integration
Updated `src/contexts/AuthProvider.jsx`:
- ✅ API-based login/logout
- ✅ Token management
- ✅ User session handling
- ✅ Cross-tab logout detection

---

## 📁 File Structure

```
src/
├── services/
│   ├── api.client.js           # Axios instance + interceptors
│   ├── api.endpoints.js        # All endpoint paths
│   ├── authService.js          # Auth API calls
│   ├── userService.js          # User management API
│   ├── productService.js       # Product API
│   ├── customerService.js      # Customer API
│   ├── orderService.js         # Order API
│   └── analyticsService.js     # Analytics API
├── hooks/
│   └── useApi.js              # Custom API hooks
├── utils/
│   └── errorHandler.js        # Error handling utilities
├── contexts/
│   └── AuthProvider.jsx       # Updated with API integration
└── constants/
    └── (your existing constants)
```

---

## 🚀 Usage Examples

### Login Example
```jsx
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginForm() {
  const { login, loading, error } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      // User logged in successfully
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p className="text-red-600">{error}</p>}
      {/* form fields */}
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Fetching Products
```jsx
import { useFetch } from '../hooks/useApi';
import { API_ENDPOINTS } from '../services/api.endpoints';

export default function ProductsList() {
  const { data: response, loading, error, refetch } = useFetch(
    API_ENDPOINTS.PRODUCTS.LIST,
    { params: { page: 1, limit: 20 } }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {response?.data?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Creating a Product
```jsx
import { usePost } from '../hooks/useApi';
import { API_ENDPOINTS } from '../services/api.endpoints';
import { handleApiError } from '../utils/errorHandler';
import { showError, showSuccess } from '../utils/alerts';

export default function CreateProduct() {
  const { execute: createProduct, loading, error } = usePost(
    API_ENDPOINTS.PRODUCTS.CREATE
  );

  const handleSubmit = async (formData) => {
    try {
      const result = await createProduct(formData);
      showSuccess('Product created successfully');
      // Handle success
    } catch (err) {
      handleApiError(err, showError);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-600">{error}</div>}
      {/* form fields */}
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Using Pagination
```jsx
import { usePagination } from '../hooks/useApi';
import { productService } from '../services/productService';

export default function ProductsWithPagination() {
  const {
    data,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(productService.getProducts);

  return (
    <div>
      {data.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      
      <div className="pagination">
        <button onClick={prevPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={nextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
```

### Using Generic useApi Hook
```jsx
import { useApi } from '../hooks/useApi';
import { productService } from '../services/productService';

export default function ProductDetail({ productId }) {
  const { data: product, loading, error, execute } = useApi(
    () => productService.getProductById(productId),
    [productId]
  );

  const handleUpdate = async (updatedData) => {
    try {
      await execute(() => 
        productService.updateProduct(productId, updatedData)
      );
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {product && <div>{product.name}</div>}
    </div>
  );
}
```

---

## 🔑 Token Management

### Automatic Token Refresh
Tokens are automatically refreshed when they expire:
- Access token: Sent with every request in Authorization header
- Refresh token: Stored in localStorage, used for renewal
- Failed requests are queued and retried after token refresh

### Manual Token Access
```jsx
import { getAccessToken, getRefreshToken, clearTokens } from '../services/api.client';

// Get current access token
const token = getAccessToken();

// Get refresh token
const refreshToken = getRefreshToken();

// Clear all tokens (logout)
clearTokens();
```

### Token Configuration
Edit `.env.local`:
```
VITE_AUTH_TOKEN_KEY=stringventory_access_token
VITE_AUTH_REFRESH_TOKEN_KEY=stringventory_refresh_token
VITE_TOKEN_EXPIRY_BUFFER=300  # Seconds before actual expiry
```

---

## 🛠️ API Endpoints Reference

### Authentication
```javascript
import { API_ENDPOINTS } from '../services/api.endpoints';

API_ENDPOINTS.AUTH.LOGIN          // POST /auth/login
API_ENDPOINTS.AUTH.REGISTER       // POST /auth/register
API_ENDPOINTS.AUTH.LOGOUT         // POST /auth/logout
API_ENDPOINTS.AUTH.REFRESH_TOKEN  // POST /auth/refresh-token
API_ENDPOINTS.AUTH.FORGOT_PASSWORD // POST /auth/forgot-password
```

### CRUD Resources
```javascript
// Products
API_ENDPOINTS.PRODUCTS.LIST      // GET /products
API_ENDPOINTS.PRODUCTS.GET(id)   // GET /products/:id
API_ENDPOINTS.PRODUCTS.CREATE    // POST /products
API_ENDPOINTS.PRODUCTS.UPDATE(id) // PUT /products/:id
API_ENDPOINTS.PRODUCTS.DELETE(id) // DELETE /products/:id

// Customers
API_ENDPOINTS.CUSTOMERS.LIST     // GET /customers
API_ENDPOINTS.CUSTOMERS.GET(id)  // GET /customers/:id
API_ENDPOINTS.CUSTOMERS.CREATE   // POST /customers
API_ENDPOINTS.CUSTOMERS.UPDATE(id) // PUT /customers/:id
API_ENDPOINTS.CUSTOMERS.DELETE(id) // DELETE /customers/:id

// Orders
API_ENDPOINTS.ORDERS.LIST        // GET /orders
API_ENDPOINTS.ORDERS.GET(id)     // GET /orders/:id
API_ENDPOINTS.ORDERS.CREATE      // POST /orders
API_ENDPOINTS.ORDERS.UPDATE(id)  // PUT /orders/:id
API_ENDPOINTS.ORDERS.DELETE(id)  // DELETE /orders/:id
```

See [API_ENDPOINTS.md](API_ENDPOINTS.md) for complete endpoint list.

---

## ⚠️ Error Handling

### Standard Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": ["error message"]
  }
}
```

### Error Handling Utilities
```javascript
import {
  parseApiError,
  getErrorMessage,
  getFieldErrors,
  isValidationError,
  handleApiError
} from '../utils/errorHandler';

try {
  await productService.createProduct(data);
} catch (error) {
  // Parse error
  const parsed = parseApiError(error);
  console.log(parsed.message);
  console.log(parsed.details);

  // Get user-friendly message
  const message = getErrorMessage(error);
  showError(message);

  // Get field-level errors
  const fieldErrors = getFieldErrors(error);
  setFormErrors(fieldErrors);

  // Check error type
  if (isValidationError(error)) {
    // Handle validation error
  }
}
```

---

## 🔒 Security Considerations

### CORS Configuration
Ensure backend has CORS configured:
```javascript
// Backend (Express example)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Authorization Headers
Automatically added by api.client:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Secure Token Storage
- Tokens stored in localStorage (for SPA use)
- Consider using httpOnly cookies for additional security
- Tokens cleared on logout
- Automatic cleanup on 401 errors

### Rate Limiting
Configure in `.env.local`:
```
VITE_API_RATE_LIMIT=100
VITE_API_RATE_LIMIT_WINDOW=60000  # ms
```

---

## 🧪 Testing the Integration

### 1. Test Login
```javascript
// In browser console
const { login } = useContext(AuthContext);
await login('admin@example.com', 'password');
```

### 2. Test API Call
```javascript
import { productService } from '../services/productService';

const products = await productService.getProducts({ page: 1, limit: 20 });
console.log(products);
```

### 3. Test Token Refresh
```javascript
// Modify .env.local to use short token expiry
// API client should automatically refresh
import { getAccessToken } from '../services/api.client';

console.log('Current token:', getAccessToken());
// Wait for auto-refresh to occur
console.log('New token:', getAccessToken());
```

---

## 🚨 Troubleshooting

### Issue: "Cannot GET /api/v1/..."
**Solution:** Check that `VITE_API_BASE_URL` is correct and backend is running

### Issue: "401 Unauthorized"
**Solution:** Check that access token is being sent and is valid

### Issue: "CORS error"
**Solution:** Configure CORS on backend to allow frontend origin

### Issue: "Token refresh loop"
**Solution:** Check that refresh token endpoint is working and returning valid tokens

### Issue: "Network request fails"
**Solution:** Check network tab in DevTools, verify endpoint exists

---

## 📚 Additional Resources

- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Complete endpoint documentation
- [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md) - Quick lookup guide
- [Axios Documentation](https://axios-http.com/)
- [React Context](https://react.dev/learn/passing-data-deeply-with-context)

---

## ✨ Next Steps

1. ✅ Set up environment variables
2. ✅ Start backend server on configured port
3. ✅ Test authentication flow
4. ✅ Replace mock data with API calls in components
5. ✅ Implement error boundaries
6. ✅ Add loading states to UI
7. ✅ Set up monitoring/logging
8. ✅ Configure caching strategies
9. ✅ Add offline support (if needed)
10. ✅ Performance optimization

---

**Document Version:** 1.0
**Last Updated:** February 5, 2026
**Status:** Ready for Implementation
