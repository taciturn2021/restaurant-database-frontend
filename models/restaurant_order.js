// models/restaurant_order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    waiter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Waiter',
        required: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    table_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant_Table',
        required: true
    },
    order_items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order_Item'
    }],
    order_time: {
        type: Date,
        default: Date.now
    },
    total_amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed', 'Closed'],
        default: 'Open'
    },
    payment_status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    special_requests: String
});

module.exports = mongoose.model('Restaurant_Order', orderSchema, 'Restaurant_Order');