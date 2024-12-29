// models/menu_item.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    is_available: { type: Number, default: 1 },
    ingredients: [{
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
        quantity: Number
    }]
});

module.exports = mongoose.model('Menu_Item', menuItemSchema,'Menu_Item');