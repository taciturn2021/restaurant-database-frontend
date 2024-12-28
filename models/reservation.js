// models/reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    table_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant_Table',
        required: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    party_size: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Cancelled', 'Completed'],
        default: 'Confirmed'
    },
    special_requests: {
        type: String
    }
});

// Add index for querying reservations by date and time
reservationSchema.index({ date: 1, time: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);