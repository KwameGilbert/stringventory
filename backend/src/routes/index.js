import { Router } from 'express';
import { env } from '../config/env.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';


// Import route modules
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import customerRoutes from './customerRoutes.js';
import orderRoutes from './orderRoutes.js';
import userRoutes from './userRoutes.js';
import healthRoutes from './healthRoutes.js';
import docsRoutes from './docsRoutes.js';

const router = Router();

/**
 * Health routes
 */
router.use('/health', healthRoutes);

/**
 * API v1 routes
 */
const v1Router = Router();

// Apply rate limiter to all API routes
v1Router.use(rateLimiter);

// API Documentation
v1Router.use('/docs', docsRoutes);

// Auth routes
v1Router.use('/auth', authRoutes);

// Admin routes
v1Router.use('/admin', adminRoutes);

// Product routes
v1Router.use('/products', productRoutes);

// Category routes
v1Router.use('/categories', categoryRoutes);

// Supplier routes
v1Router.use('/suppliers', supplierRoutes);

// Inventory routes
v1Router.use('/inventory', inventoryRoutes);

// Customer routes
v1Router.use('/customers', customerRoutes);

// Order routes
v1Router.use('/orders', orderRoutes);

// User management routes
v1Router.use('/users', userRoutes);

// Mount v1 routes
router.use(`/${env.API_VERSION}`, v1Router);

// // Legacy support - also mount at /api
// router.use('/api', v1Router);

export default router;
