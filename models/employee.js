const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    person_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    salary: Number,
    position: String,
    shift: String
});

module.exports = mongoose.model('Employee', employeeSchema);