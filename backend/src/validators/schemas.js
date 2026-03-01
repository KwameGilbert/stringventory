import { z } from 'zod';

/**
 * Common validation schemas
 */
export const commonSchemas = {
  uuid: z.string().uuid(),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  pagination: z.object({
    page: z
      .string()
      .optional()
      .transform((v) => parseInt(v) || 1),
    limit: z
      .string()
      .optional()
      .transform((v) => parseInt(v) || 20),
  }),
};

/**
 * Auth validation schemas
 */
export const authSchemas = {
  register: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    phone: z.string().min(1, 'Phone number is required').max(50),
    businessName: z.string().min(1, 'Business name is required').max(200),
    businessType: z.string().min(1, 'Business type is required').max(100),
    role: z.enum(['CEO', 'Manager', 'Sales', 'admin', 'user']).optional().default('CEO'),
  }),

  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),

  refreshToken: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),

  forgotPassword: z.object({
    email: z.string().email('Invalid email address'),
  }),

  resetPassword: z
    .object({
      token: z.string().min(1, 'Reset token is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
      confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),

  verifyEmail: z.object({
    token: z.string().min(1, 'Verification token is required'),
  }),

  updateProfile: z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional().nullable(),
    avatar: z.string().url().optional().nullable(),
  }),
};

/**
 * Admin specific validation schemas
 */
export const adminSchemas = {
  createUser: z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().max(20).optional().nullable(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    businessId: z.string().uuid().optional().nullable(),
    roleId: z.string().uuid('Invalid role ID format').optional().nullable(),
    role: z.string().optional(), // Support role name lookup
    status: z.enum(['active', 'inactive', 'suspended']).optional().default('active'),
    twoFactorEnabled: z.boolean().optional().default(false),
  }),

  updateUser: z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional().nullable(),
    password: z.string().min(8).optional(),
    businessId: z.string().uuid().optional().nullable(),
    roleId: z.string().uuid('Invalid role ID format').optional().nullable(),
    role: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    twoFactorEnabled: z.boolean().optional(),
  }),

  params: z.object({
    userId: z.string().uuid('Invalid user ID'),
  }),
};

/**
 * User validation schemas
 */
export const userSchemas = {
  create: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    roleId: z.string().uuid().optional().nullable(),
    role: z.string().optional().default('user'),
    status: z.enum(['active', 'inactive', 'suspended']).optional().default('active'),
  }),

  update: z.object({
    email: z.string().email().optional(),
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional().nullable(),
    avatar: z.string().url().optional().nullable(),
    roleId: z.string().uuid().optional().nullable(),
    role: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  }),

  updateRole: z
    .object({
      roleId: z.string().uuid().optional().nullable(),
      role: z.string().optional(),
    })
    .refine((data) => data.roleId || data.role, {
      message: 'Either roleId or role name must be provided',
    }),

  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),

  listQuery: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    role: z.enum(['user', 'admin', 'super_admin']).optional(),
  }),
};

/**
 * Product validation schemas
 */
export const productSchemas = {
  create: z.object({
    name: z.string().min(1, 'Product name is required').max(200),
    productCode: z.string().min(1, 'Product code is required').max(100),
    sku: z.string().max(100).optional().nullable(),
    barcode: z.string().max(100).optional().nullable(),
    categoryId: z.string().uuid('Invalid category ID'),
    unitOfMeasurementId: z.string().uuid('Invalid unit of measurement ID'),
    supplierId: z.string().uuid('Invalid supplier ID'),
    costPrice: z.number().min(0, 'Cost price must be non-negative'),
    retailPrice: z.number().min(0, 'Retail price must be non-negative'),
    description: z.string().optional().nullable(),
    image: z.string().url().optional().nullable(),
    reorderThreshold: z.number().int().min(0).optional().default(0),
    status: z.enum(['active', 'inactive']).optional().default('active'),
  }),

  update: z.object({
    name: z.string().min(1).max(200).optional(),
    productCode: z.string().min(1).max(100).optional(),
    sku: z.string().max(100).optional().nullable(),
    barcode: z.string().max(100).optional().nullable(),
    categoryId: z.string().uuid().optional(),
    unitOfMeasurementId: z.string().uuid().optional(),
    supplierId: z.string().uuid().optional(),
    costPrice: z.number().min(0).optional(),
    retailPrice: z.number().min(0).optional(),
    description: z.string().optional().nullable(),
    image: z.string().url().optional().nullable(),
    reorderThreshold: z.number().int().min(0).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),

  params: z.object({
    productId: z.string().uuid('Invalid product ID'),
  }),
};

/**
 * Category validation schemas
 */
export const categorySchemas = {
  create: z.object({
    name: z.string().min(1, 'Category name is required').max(100),
    description: z.string().optional().nullable(),
    image: z.string().url().optional().nullable(),
    isActive: z.boolean().optional().default(true),
  }),

  update: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional().nullable(),
    image: z.string().url().optional().nullable(),
    isActive: z.boolean().optional(),
  }),

  params: z.object({
    categoryId: z.string().uuid('Invalid category ID'),
  }),
};

/**
 * Supplier validation schemas
 */
export const supplierSchemas = {
  create: z.object({
    name: z.string().min(1, 'Supplier name is required').max(200),
    email: z.string().email().optional().nullable(),
    phone: z.string().max(50).optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().max(100).optional().nullable(),
    state: z.string().max(100).optional().nullable(),
    postalCode: z.string().max(20).optional().nullable(),
    country: z.string().max(100).optional().nullable(),
    contactPerson: z.string().max(200).optional().nullable(),
    contactTitle: z.string().max(100).optional().nullable(),
    taxId: z.string().max(100).optional().nullable(),
    paymentTerms: z.string().max(100).optional().nullable(),
    leadTime: z.number().int().min(0).optional().nullable(),
    minOrderQuantity: z.number().int().min(0).optional().nullable(),
    notes: z.string().optional().nullable(),
  }),

  update: z.object({
    name: z.string().min(1).max(200).optional(),
    email: z.string().email().optional().nullable(),
    phone: z.string().max(50).optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().max(100).optional().nullable(),
    state: z.string().max(100).optional().nullable(),
    postalCode: z.string().max(20).optional().nullable(),
    country: z.string().max(100).optional().nullable(),
    contactPerson: z.string().max(200).optional().nullable(),
    contactTitle: z.string().max(100).optional().nullable(),
    taxId: z.string().max(100).optional().nullable(),
    paymentTerms: z.string().max(100).optional().nullable(),
    leadTime: z.number().int().min(0).optional().nullable(),
    minOrderQuantity: z.number().int().min(0).optional().nullable(),
    notes: z.string().optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  }),

  params: z.object({
    supplierId: z.string().uuid('Invalid supplier ID'),
  }),
};

/**
 * Inventory validation schemas
 */
export const inventorySchemas = {
  add: z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
    batchNumber: z.string().max(100).optional().nullable(),
    expiryDate: z.string().optional().nullable(), // Simplified
    warehouseLocation: z.string().max(100).optional().nullable(),
    reference: z.string().max(100).optional().nullable(),
    notes: z.string().optional().nullable(),
  }),

  adjust: z.object({
    productId: z.string().uuid('Invalid product ID'),
    adjustmentType: z.enum(['increase', 'decrease']),
    quantity: z.number().int().positive('Quantity must be positive'),
    reason: z.string().min(1, 'Reason is required').max(255),
    reference: z.string().max(100).optional().nullable(),
    notes: z.string().optional().nullable(),
  }),

  transfer: z.object({
    productId: z.string().uuid('Invalid product ID'),
    fromWarehouse: z.string().min(1, 'Origin warehouse is required'),
    toWarehouse: z.string().min(1, 'Destination warehouse is required'),
    quantity: z.number().int().positive('Quantity must be positive'),
    reference: z.string().max(100).optional().nullable(),
    notes: z.string().optional().nullable(),
  }),

  productParams: z.object({
    productId: z.string().uuid('Invalid product ID'),
  }),
};

/**
 * Customer validation schemas
 */
export const customerSchemas = {
  create: z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email().optional().nullable(),
    phone: z.string().max(50).optional().nullable(),
    businessName: z.string().max(200).optional().nullable(),
    customerType: z.enum(['retail', 'wholesale']).optional().default('retail'),
    address: z.string().optional().nullable(),
    city: z.string().max(100).optional().nullable(),
    state: z.string().max(100).optional().nullable(),
    postalCode: z.string().max(20).optional().nullable(),
    country: z.string().max(100).optional().nullable(),
    taxId: z.string().max(100).optional().nullable(),
    creditLimit: z.number().min(0).optional().default(0),
    notes: z.string().optional().nullable(),
  }),

  update: z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    phone: z.string().max(50).optional().nullable(),
    businessName: z.string().max(200).optional().nullable(),
    creditLimit: z.number().min(0).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),

  params: z.object({
    customerId: z.string().uuid('Invalid customer ID'),
  }),
};

/**
 * Order validation schemas
 */
export const orderSchemas = {
  create: z.object({
    customerId: z.string().uuid('Invalid customer ID'),
    dueDate: z.string().optional().nullable(),
    items: z
      .array(
        z.object({
          productId: z.string().uuid('Invalid product ID'),
          quantity: z.number().int().positive('Quantity must be positive'),
          unitPrice: z.number().min(0, 'Unit price must be non-negative'),
          discount: z.number().min(0).optional().default(0),
        })
      )
      .min(1, 'At least one item is required'),
    tax: z.number().min(0).optional().default(0),
    shippingCost: z.number().min(0).optional().default(0),
    shippingAddress: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),

  update: z.object({
    status: z
      .enum(['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'])
      .optional(),
    paymentStatus: z.enum(['unpaid', 'paid', 'partially_paid']).optional(),
    dueDate: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),

  refund: z.object({
    refundType: z.enum(['full', 'partial']),
    amount: z.number().positive('Amount must be positive'),
    reason: z.string().min(1, 'Reason is required'),
    items: z
      .array(
        z.object({
          orderItemId: z.string().uuid('Invalid order item ID'),
          quantity: z.number().int().positive('Quantity must be positive'),
        })
      )
      .optional(),
    notes: z.string().optional().nullable(),
  }),

  params: z.object({
    orderId: z.string().uuid('Invalid order ID'),
  }),
};

export default {
  commonSchemas,
  authSchemas,
  userSchemas,
  adminSchemas,
  productSchemas,
  categorySchemas,
  supplierSchemas,
  inventorySchemas,
  customerSchemas,
  orderSchemas,
};
