import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  exportOrdersCSV,
  downloadInvoice,
  downloadShippingLabel,
} from '../controllers/orderController.js';

const router = express.Router();

// Order CRUD & List
router.post('/', createOrder);
router.get('/', getAllOrders);

// Bulk CSV Export
router.get('/export/csv', exportOrdersCSV);

// Single Order
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

// Document Downloads
router.get('/:id/invoice', downloadInvoice);
router.get('/:id/shipping-label', downloadShippingLabel);

export default router;
