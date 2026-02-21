import { CustomerModel } from '../models/CustomerModel.js';
import { db } from '../config/database.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';

export class CustomerController {
  /**
   * Get all customers
   */
  static getAllCustomers = asyncHandler(async (req, res) => {
    const result = await CustomerModel.findAllWithStats({
      filters: { businessId: req.user.businessId, status: req.query.status },
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    });

    return ApiResponse.paginated(
      res,
      result.data,
      result.pagination,
      'Customers retrieved successfully'
    );
  });

  /**
   * Get customer by ID
   */
  static getCustomerById = asyncHandler(async (req, res) => {
    const { customerId } = req.params;

    const customer = await CustomerModel.findByIdWithStats(customerId);

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    if (customer.businessId !== req.user.businessId) {
      throw new ForbiddenError('Access denied');
    }

    return ApiResponse.success(res, customer, 'Customer retrieved successfully');
  });

  /**
   * Create customer
   */
  static createCustomer = asyncHandler(async (req, res) => {
    const customerData = {
      ...req.body,
      businessId: req.user.businessId,
      isActive: true,
    };

    if (customerData.email) {
      const existing = await CustomerModel.findFirst({
        email: customerData.email,
        businessId: req.user.businessId,
      });
      if (existing) throw new ConflictError('Customer with this email already exists');
    }

    const customer = await CustomerModel.create(customerData);

    const formattedResponse = {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      businessName: customer.businessName,
      status: customer.isActive ? 'active' : 'inactive',
      createdAt: customer.createdAt,
    };

    return ApiResponse.created(res, formattedResponse, 'Customer created successfully');
  });

  /**
   * Update customer
   */
  static updateCustomer = asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const { status, ...otherData } = req.body;

    const customerData = { ...otherData };
    if (status !== undefined) customerData.isActive = status === 'active';

    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    if (customer.businessId !== req.user.businessId) {
      throw new ForbiddenError('Access denied');
    }

    const updated = await CustomerModel.update(customerId, customerData);

    const formattedResponse = {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      businessName: updated.businessName,
      creditLimit: parseFloat(updated.creditLimit),
      updatedAt: updated.updatedAt,
    };

    return ApiResponse.success(res, formattedResponse, 'Customer updated successfully');
  });

  /**
   * Delete customer
   */
  static deleteCustomer = asyncHandler(async (req, res) => {
    const { customerId } = req.params;

    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    if (customer.businessId !== req.user.businessId) {
      throw new ForbiddenError('Access denied');
    }

    // Check for orders
    const ordersCount = await db('orders').where({ customerId }).count('* as count');
    if (parseInt(ordersCount[0].count) > 0) {
      throw new ConflictError('Cannot delete customer with associated orders');
    }

    await CustomerModel.delete(customerId);

    return ApiResponse.success(res, null, 'Customer deleted successfully');
  });

  /**
   * Get customer orders
   */
  static getCustomerOrders = asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const orders = await db('orders as o')
      .where({ customerId, businessId: req.user.businessId })
      .select('o.id', 'o.orderNumber', 'o.orderDate as date', 'o.totalAmount as total', 'o.status')
      .limit(limit)
      .offset(offset)
      .orderBy('o.createdAt', 'desc');

    const [{ count }] = await db('orders').where({ customerId }).count('* as count');

    const formattedOrders = orders.map((o) => ({
      ...o,
      total: parseFloat(o.total),
      itemCount: 0, // In a real app we'd join or subquery, but keeping it simple for now
    }));

    return ApiResponse.paginated(
      res,
      formattedOrders,
      {
        page,
        limit,
        total: parseInt(count),
        totalPages: Math.ceil(parseInt(count) / limit),
      },
      'Customer orders retrieved successfully'
    );
  });
}

export default CustomerController;
