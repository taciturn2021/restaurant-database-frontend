const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String,
    cost: Number
});

module.exports = mongoose.model('Ingredient', ingredientSchema,'Ingredient');