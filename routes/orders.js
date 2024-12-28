const express = require('express');
const router = express.Router();
const RestaurantOrder = require('../models/restaurant_order');
const OrderItems = require('../models/order_items');

router.get('/', async (req, res) => {
    try {
        const orders = await RestaurantOrder.find()
            .populate({
                path: 'waiter_id',
                populate: {
                    path: 'employee_id',
                    populate: {
                        path: 'person_id'
                    }
                }
            })
            .populate({
                path: 'customer_id',
                populate: {
                    path: 'person_id'
                }
            })
            .populate('table_id');

        // Get order items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const items = await OrderItems.find({ order_id: order._id })
                .populate('item_id');
            return {
                id: order._id,
                waiter: order.waiter_id?.employee_id?.person_id?.name || 'Unknown',
                customer: order.customer_id?.person_id?.name || 'Unknown',
                table: order.table_id?.location || 'Unknown',
                order_time: order.order_time,
                total_amount: order.total_amount,
                status: order.status,
                special_requests: order.special_requests,
                items: items
            };
        }));

        res.render('orders/index', { orders: ordersWithItems });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        // Create the main order
        const order = await RestaurantOrder.create({
            waiter_id: req.body.waiter_id,
            customer_id: req.body.customer_id,
            table_id: req.body.table_id,
            order_time: new Date(),
            total_amount: req.body.total_amount,
            status: 'Pending',
            special_requests: req.body.special_requests
        });

        // Create order items
        if (req.body.items && Array.isArray(req.body.items)) {
            await Promise.all(req.body.items.map(item =>
                OrderItems.create({
                    order_id: order._id,
                    item_id: item.item_id,
                    quantity: item.quantity,
                    notes: item.notes
                })
            ));
        }

        res.redirect('/orders');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;