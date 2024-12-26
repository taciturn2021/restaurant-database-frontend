const mongoose = require('mongoose');
const Employee = require('./employee');

const waiterSchema = new mongoose.Schema({
    sectionNumber: Number,
    totalTips: Number
});

module.exports = Employee.discriminator('Waiter', waiterSchema);