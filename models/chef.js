const mongoose = require('mongoose');
const Employee = require('./employee');

const chefSchema = new mongoose.Schema({
    specialization: String,
    certification: String
});

module.exports = Employee.discriminator('Chef', chefSchema);
