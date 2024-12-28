const mongoose = require('mongoose');

const restaurantTableSchema = new mongoose.Schema({
    capacity: Number,
    location: String,
    status: { type: String, default: 'Available' }
});

module.exports = mongoose.model('Restaurant_Table', restaurantTableSchema);
