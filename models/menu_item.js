const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    is_available: { type: Number, default: 1 }
});

module.exports = mongoose.model('Menu_Item', menuItemSchema);