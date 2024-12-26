const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    category: String,
    isAvailable: {
        type: Boolean,
        default: true
    },
    ingredients: [{
        ingredientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        quantity: Number,
        unit: String
    }]
});

module.exports = mongoose.model('MenuItem', menuItemSchema);