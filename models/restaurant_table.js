// models/restaurant_table.js
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Available'
    }
});


module.exports = mongoose.model('Restaurant_Table', tableSchema, 'Restaurant_Table');