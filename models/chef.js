const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    specialization: String,
    certification: String
});

module.exports = mongoose.model('Chef', chefSchema, 'Chef');