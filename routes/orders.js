// routes/orders.js
const express = require('express');
const router = express.Router();
const Restaurant_Order = require('../models/restaurant_order');

router.get('/', async (req, res) => {
    try {
        console.log('Attempting to fetch orders...');
        const orders = await Restaurant_Order.find()
            .populate([
                {
                    path: 'customer_id',
                    populate: {
                        path: 'person_id'
                    }
                },
                {
                    path: 'waiter_id',
                    populate: {
                        path: 'person_id'
                    }
                },
                {
                    path: 'table_id'
                }
            ])
            .lean();

        console.log('Raw orders data:', orders);

        if (!orders || orders.length === 0) {
            return res.render('orders/index', {
                orders: [],
                error: 'No orders found in database'
            });
        }

        const mappedOrders = orders.map(order => ({
            id: order._id.toString(),
            customer_name: order.customer_id?.person_id?.name || 'N/A',
            waiter_name: order.waiter_id?.person_id?.name || 'N/A',
            table_number: order.table_id?.number || 'N/A',
            order_time: order.order_time ? new Date(order.order_time).toLocaleString() : 'N/A',
            total_amount: order.total_amount?.toFixed(2) || '0.00',
            status: order.status || 'Pending',
            special_requests: order.special_requests || 'None'
        }));

        console.log('Mapped orders data:', mappedOrders);
        res.render('orders/index', { orders: mappedOrders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.render('orders/index', {
            orders: [],
            error: 'Error loading orders. Please try again.'
        });
    }
});

module.exports = router;