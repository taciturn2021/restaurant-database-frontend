const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    person_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    loyalty_points: { type: Number, default: 0 },
    member_since: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);