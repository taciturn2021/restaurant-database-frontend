const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    email: String,
    address: String,
    hire_date: Date
});

module.exports = mongoose.model('Person', personSchema);