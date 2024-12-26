const mongoose = require('mongoose');
const Person = require('./person');

const employeeSchema = new mongoose.Schema({
    salary: Number,
    position: String,
    shift: String
});

module.exports = Person.discriminator('Employee', employeeSchema);