const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: Number,
    unit: String,
    cost: Number
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
