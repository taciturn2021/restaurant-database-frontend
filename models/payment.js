const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant_Order' },
    amount: Number,
    payment_method: String,
    payment_time: Date,
    status: String
});

module.exports = mongoose.model('Payment', paymentSchema);