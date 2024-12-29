const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant_Order' },
    rating: Number,
    comment: String,
    review_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema, 'Review');