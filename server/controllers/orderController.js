import {
  saveOrderToFirebase,
  getOrdersFromFirebase,
  getOrderByIdFromFirebase,
  updateOrderStatusInFirebase,
} from '../services/firebaseService.js';
import { generateInvoicePDF, generateShippingLabelPDF } from '../services/pdfService.js';

/**
 * Controller for Orders, Invoices, Shipping Labels, and CSV Exports
 */

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Order must contain items.' });
    }

    const savedOrder = await saveOrderToFirebase(orderData);
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order: ' + error.message });
  }
};

// GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await getOrdersFromFirebase();
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdFromFirebase(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
};

// PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const updated = await updateOrderStatusInFirebase(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

// GET /api/orders/export/csv
export const exportOrdersCSV = async (req, res) => {
  try {
    const orders = await getOrdersFromFirebase();

    // CSV Header row
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'Delivery Address',
      'City',
      'State',
      'Pincode',
      'Total Items',
      'Items Summary',
      'Subtotal (INR)',
      'Delivery Fee (INR)',
      'Total Amount (INR)',
      'Payment Method',
      'Status'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = orders.map((o) => {
      const itemsSummary = (o.items || [])
        .map((i) => `${i.name} (${i.selectedSize || 'M'}, ${i.selectedColor || 'Standard'}) x${i.quantity}`)
        .join('; ');

      const formattedDate = new Date(o.createdAt).toLocaleDateString('en-IN');

      return [
        escapeCsv(o.id),
        escapeCsv(formattedDate),
        escapeCsv(o.customer?.name),
        escapeCsv(o.customer?.phone),
        escapeCsv(o.customer?.email),
        escapeCsv(o.customer?.address),
        escapeCsv(o.customer?.city),
        escapeCsv(o.customer?.state),
        escapeCsv(o.customer?.pincode),
        escapeCsv(o.items?.length || 0),
        escapeCsv(itemsSummary),
        escapeCsv(o.subtotal || 0),
        escapeCsv(o.deliveryFee === 0 ? 'FREE' : o.deliveryFee),
        escapeCsv(o.total || 0),
        escapeCsv(o.paymentMethod),
        escapeCsv(o.status),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const filename = `Biya_Fashion_Orders_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error generating CSV export:', error);
    res.status(500).json({ error: 'Failed to export orders to CSV.' });
  }
};

// GET /api/orders/:id/invoice
export const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdFromFirebase(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Invoice_${order.id}.pdf"`);

    generateInvoicePDF(order, res);
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    res.status(500).json({ error: 'Failed to generate tax invoice PDF.' });
  }
};

// GET /api/orders/:id/shipping-label
export const downloadShippingLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdFromFirebase(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Shipping_Label_${order.id}.pdf"`);

    generateShippingLabelPDF(order, res);
  } catch (error) {
    console.error('Error generating shipping label PDF:', error);
    res.status(500).json({ error: 'Failed to generate shipping label PDF.' });
  }
};
