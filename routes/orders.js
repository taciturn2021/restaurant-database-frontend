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
const Customer = require('../models/customer');

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

// Show new order form
router.get('/new', async (req, res) => {
    try {
        // Fetch available tables
        const tables = await Restaurant_Table.find({ status: 'Available' }).lean();

        // Fetch waiters
        const waiters = await Waiter.find()
            .populate({
                path: 'employee_id',
                populate: { path: 'person_id' }
            })
            .lean();

        // Fetch menu items
        const menuItems = await Menu_Item.find().lean();

        // Fetch customers - Add this line
        const customers = await Customer.find().populate('person_id').lean();

        // Render the "new" form
        res.render('orders/new', {
            tables,
            waiters,
            menuItems,
            customers
        });
    } catch (error) {
        console.error('Error loading new order form:', error);
        res.status(500).send('Error loading new order form');
    }
});

// Get order by ID for editing
router.get('/:id/edit', async (req, res) => {
    try {
        const order = await Restaurant_Order.findById(req.params.id)
            .populate([/* ... existing populates ... */]);

        const tables = await Restaurant_Table.find().lean();
        const waiters = await Waiter.find().populate('employee_id').lean();
        const menuItems = await Menu_Item.find().lean();
        const customers = await Customer.find().populate('person_id').lean(); // Add this line

        res.render('orders/edit', {
            order,
            tables,
            waiters,
            menuItems,
            customers
        });
    } catch (error) {
        console.error('Error fetching order for edit:', error);
        res.redirect('/orders');
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const { waiter_id, table_id, customer_id, items, special_requests } = req.body;

        // Ensure there is at least one item
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'An order must contain at least one item.' });
        }

        // Create order items
        const orderItems = await Promise.all(
            items.map(async (item) => {
                const menuItem = await Menu_Item.findById(item.menu_item_id);
                const orderItem = new Order_Item({
                    menu_item: item.menu_item_id,
                    quantity: item.quantity,
                    price: menuItem.price * item.quantity,
                    special_instructions: item.special_instructions
                });
                await orderItem.save();
                return orderItem;
            })
        );

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

// Update existing order
router.post('/:id/update', async (req, res) => {
    try {
        const { waiter_id, table_id, items, special_requests, status } = req.body;
        const orderId = req.params.id;

        // Get existing order
        const existingOrder = await Restaurant_Order.findById(orderId);

        // Delete existing order items
        await Order_Item.deleteMany({ _id: { $in: existingOrder.order_items } });

        // Create new order items
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

        const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

        // Update order
        const updatedOrder = await Restaurant_Order.findByIdAndUpdate(
            orderId,
            {
                waiter_id,
                table_id,
                order_items: orderItems.map(item => item._id),
                total_amount: totalAmount,
                special_requests,
                status
            },
            { new: true }
        );

        // Handle table status changes
        if (existingOrder.table_id.toString() !== table_id) {
            // Free up old table if it's different
            await Restaurant_Table.findByIdAndUpdate(existingOrder.table_id, { status: 'Available' });
            // Update new table status
            await Restaurant_Table.findByIdAndUpdate(table_id, { status: 'Occupied' });
        }

        // If order is closed, free up the table
        if (status === 'Closed') {
            await Restaurant_Table.findByIdAndUpdate(table_id, { status: 'Available' });
        }

        res.redirect('/orders');
    } catch (error) {
        console.error('Error updating order:', error);
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

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Restaurant_Order.findById(req.params.id);

        // Delete associated order items
        await Order_Item.deleteMany({ _id: { $in: order.order_items } });

        // Free up the table
        await Restaurant_Table.findByIdAndUpdate(order.table_id, { status: 'Available' });

        // Delete the order
        await Restaurant_Order.findByIdAndUpdate(req.params.id);

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;