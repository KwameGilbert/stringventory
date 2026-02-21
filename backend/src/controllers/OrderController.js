import { OrderModel } from '../models/OrderModel.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export class OrderController {
  /**
   * Get all orders
   */
  static getAllOrders = asyncHandler(async (req, res) => {
    const result = await OrderModel.findAllWithDetails({
      filters: { businessId: req.user.businessId, status: req.query.status },
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    });

    return ApiResponse.paginated(
      res,
      result.data,
      result.pagination,
      'Orders retrieved successfully'
    );
  });

  /**
   * Get order by ID
   */
  static getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await OrderModel.findByIdWithDetails(orderId);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.businessId !== req.user.businessId) {
      throw new ForbiddenError('Access denied');
    }

    return ApiResponse.success(res, order, 'Order retrieved successfully');
  });

  /**
   * Create order
   */
  static createOrder = asyncHandler(async (req, res) => {
    const order = await OrderModel.createWithItems(
      {
        ...req.body,
        businessId: req.user.businessId,
      },
      req.user.id
    );

    const formattedResponse = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      date: order.orderDate,
      total: parseFloat(order.totalAmount),
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    };

    return ApiResponse.created(res, formattedResponse, 'Order created successfully');
  });

  /**
   * Update order
   */
  static updateOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const updateData = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.businessId !== req.user.businessId) {
      throw new ForbiddenError('Access denied');
    }

    const updated = await OrderModel.update(orderId, updateData);

    const formattedResponse = {
      id: updated.id,
      orderNumber: updated.orderNumber,
      status: updated.status,
      paymentStatus: updated.paymentStatus,
      updatedAt: updated.updatedAt,
    };

    return ApiResponse.success(res, formattedResponse, 'Order updated successfully');
  });

  /**
   * Delete order
   */
  static deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.businessId !== req.user.businessId) {
      throw new ForbiddenError('Access denied');
    }

    await OrderModel.delete(orderId);

    return ApiResponse.success(res, null, 'Order deleted successfully');
  });

  /**
   * Create refund
   */
  static createRefund = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const refund = await OrderModel.createRefund(orderId, req.body, req.user.businessId);

    const formattedResponse = {
      id: refund.id,
      orderId: refund.orderId,
      amount: parseFloat(refund.amount),
      refundType: refund.refundType,
      reason: refund.reason,
      status: refund.status,
      processedAt: refund.processedAt,
    };

    return ApiResponse.created(res, formattedResponse, 'Refund created successfully');
  });
}

export default OrderController;
