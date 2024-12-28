const mongoose = require('mongoose');

const restaurantOrderSchema = new mongoose.Schema({
    waiter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Waiter' },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant_Table' },
    order_time: { type: Date, default: Date.now },
    total_amount: Number,
    status: String,
    special_requests: String
});

module.exports = mongoose.model('Restaurant_Order', restaurantOrderSchema);