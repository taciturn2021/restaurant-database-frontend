// models/menu_item.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    is_available: { type: Number, default: 1 },
    ingredients: [{
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
        quantity: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Menu_Item', menuItemSchema,'Menu_Item');