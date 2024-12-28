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
        default: 'Pending'
    },
    special_requests: String
});

module.exports = mongoose.model('Restaurant_Order', orderSchema, 'Restaurant_Order');