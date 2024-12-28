const mongoose = require('mongoose');

const recipeIngredientsSchema = new mongoose.Schema({
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu_Item' },
    ingredient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
    quantity: Number,
    unit: String
});

module.exports = mongoose.model('Recipe_Ingredients', recipeIngredientsSchema);