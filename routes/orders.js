// routes/orders.js
const express = require('express');
const router = express.Router();
const Restaurant_Order = require('../models/restaurant_order');
const Order_Item = require('../models/order_item');
const Restaurant_Table = require('../models/restaurant_table');
const Menu_Item = require('../models/menu_item');
const Waiter = require('../models/waiter');
const Review = require('../models/review');
const Payment = require('../models/payment');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Restaurant_Order.find()
            .populate([
                {
                    path: 'customer_id',
                    populate: { path: 'person_id' }
                },
                {
                    path: 'waiter_id',
                    populate: { path: 'employee_id' }
                },
                {
                    path: 'table_id'
                },
                {
                    path: 'order_items',
                    populate: { path: 'menu_item' }
                }
            ])
            .sort({ order_time: -1 })
            .lean();

        const tables = await Restaurant_Table.find().lean();
        const waiters = await Waiter.find().populate('employee_id').lean();
        const menuItems = await Menu_Item.find().lean();

        res.render('orders/index', {
            orders,
            tables,
            waiters,
            menuItems
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.render('orders/index', {
            error: 'Error loading orders'
        });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const { waiter_id, table_id, customer_id, items, special_requests } = req.body;

        // Create order items
        const orderItems = await Promise.all(items.map(async (item) => {
            const menuItem = await Menu_Item.findById(item.menu_item_id);
            const orderItem = new Order_Item({
                menu_item: item.menu_item_id,
                quantity: item.quantity,
                price: menuItem.price * item.quantity,
                special_instructions: item.special_instructions
            });
            await orderItem.save();
            return orderItem;
        }));

        // Calculate total amount
        const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

        // Create order
        const order = new Restaurant_Order({
            waiter_id,
            table_id,
            customer_id,
            order_items: orderItems.map(item => item._id),
            total_amount: totalAmount,
            special_requests,
            status: 'Open'
        });

        await order.save();

        // Update table status
        await Restaurant_Table.findByIdAndUpdate(table_id, { status: 'Occupied' });

        res.redirect('/orders');
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update order status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Restaurant_Order.findById(req.params.id);

        order.status = status;

        if (status === 'Closed') {
            // Free up the table
            await Restaurant_Table.findByIdAndUpdate(order.table_id, { status: 'Available' });
        }

        await order.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;