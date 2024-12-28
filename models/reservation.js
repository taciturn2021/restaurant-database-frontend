const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant_Table' },
    reservation_time: Date,
    party_size: Number,
    status: String
});

module.exports = mongoose.model('Reservation', reservationSchema);