const mongoose = require('mongoose');

const waiterSchema = new mongoose.Schema({
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    section_number: Number,
    total_tips: Number
});

module.exports = mongoose.model('Waiter', waiterSchema);