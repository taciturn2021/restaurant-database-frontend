const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    capacity: {
        type: Number,
        required: true
    },
    location: String,
    status: {
        type: String,
        default: 'Available',
        enum: ['Available', 'Occupied', 'Reserved', 'Maintenance']
    }
});

module.exports = mongoose.model('Table', tableSchema);