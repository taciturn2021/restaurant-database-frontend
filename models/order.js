const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    waiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Waiter'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table'
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
        },
        quantity: {
            type: Number,
            default: 1
        },
        notes: String
    }],
    orderTime: {
        type: Date,
        default: Date.now
    },
    totalAmount: Number,
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    specialRequests: String
});

module.exports = mongoose.model('Order', orderSchema);