import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// -------------------------------------------------------------
// POST /api/orders (Public / Guest creates table order)
// -------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const {
      tableNo,
      customerName,
      customerPhone,
      items,
      customItemNotes,
      totalAmount,
      orderType,
      specialInstructions,
    } = req.body;

    if (!tableNo || !customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Table number, customer name, and contact phone are required.',
      });
    }

    if ((!items || items.length === 0) && !customItemNotes?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one dish or custom order request.',
      });
    }

    // Calculate total if not provided
    const calculatedTotal =
      totalAmount ??
      (items || []).reduce((acc, curr) => acc + (curr.price || 0) * (curr.qty || 1), 0);

    const order = new Order({
      tableNo,
      customerName,
      customerPhone,
      items: items || [],
      customItemNotes: customItemNotes || '',
      totalAmount: calculatedTotal,
      orderType: orderType || 'Dine-in (Table Service)',
      status: 'pending',
      specialInstructions: specialInstructions || '',
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: `Table #${tableNo} order logged successfully!`,
      order: savedOrder,
    });
  } catch (err) {
    console.error('Error creating table order:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to place table order.',
    });
  }
});

// -------------------------------------------------------------
// GET /api/orders (Admin / Kitchen desk gets all orders)
// -------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const { status, tableNo } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (tableNo && tableNo !== 'all') {
      filter.tableNo = tableNo;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error('Error fetching table orders:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve table orders.',
    });
  }
});

// -------------------------------------------------------------
// PATCH /api/orders/:id/status (Admin updates order status)
// -------------------------------------------------------------
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'served', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order ticket not found.',
      });
    }

    res.json({
      success: true,
      message: `Order #${order.orderId} updated to ${status}`,
      order,
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
    });
  }
});

// -------------------------------------------------------------
// DELETE /api/orders/:id (Admin deletes order ticket)
// -------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order ticket not found.',
      });
    }

    res.json({
      success: true,
      message: `Order #${order.orderId} deleted successfully.`,
    });
  } catch (err) {
    console.error('Error deleting order ticket:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order ticket.',
    });
  }
});

export default router;
