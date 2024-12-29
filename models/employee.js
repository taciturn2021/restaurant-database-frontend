
const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({
    person_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    },
    employeeType: {
        type: String,
        enum: ['Waiter', 'Chef', 'Other'],
        required: true
    },
    salary: {
        type: Number,
        default: 0
    },
    position: {
        type: String,
        default: 'Staff'
    },
    shift: {
        type: String,
        default: 'Day'
    }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema, 'Employee');  // Explicitly specify 'Employee' collection