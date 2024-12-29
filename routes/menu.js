// routes/menu.js
const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient');
const MenuItem = require('../models/menu_item');

// -------------------- MENU --------------------
router.get('/', (req, res) => {
    res.render('menu/index');
});
// -------------------- INGREDIENTS --------------------

// View all ingredients
router.get('/ingredients', async (req, res) => {
    try {
        const ingredients = await Ingredient.find().lean();
        res.render('menu/ingredients/index', { ingredients });
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).send('Failed to load ingredients');
    }
});

// New ingredient form
router.get('/ingredients/new', (req, res) => {
    res.render('menu/ingredients/new');
});

// Create ingredient
router.post('/ingredients', async (req, res) => {
    try {
        const { name, quantity, unit, cost } = req.body;
        const ingredient = new Ingredient({ name, quantity, unit, cost });
        await ingredient.save();
        res.redirect('/menu/ingredients');
    } catch (error) {
        console.error('Error creating ingredient:', error);
        res.status(500).send('Failed to create ingredient');
    }
});

// Edit ingredient form
router.get('/ingredients/:id/edit', async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id).lean();
        if (!ingredient) return res.status(404).send('Ingredient not found');
        res.render('menu/ingredients/edit', { ingredient });
    } catch (error) {
        console.error('Error loading edit form:', error);
        res.status(500).send('Failed to load edit form');
    }
});

// Update ingredient
router.post('/ingredients/:id', async (req, res) => {
    try {
        const { name, quantity, unit, cost } = req.body;
        await Ingredient.findByIdAndUpdate(req.params.id, { name, quantity, unit, cost });
        res.redirect('/menu/ingredients');
    } catch (error) {
        console.error('Error updating ingredient:', error);
        res.status(500).send('Failed to update ingredient');
    }
});

// Delete ingredient
router.post('/ingredients/:id/delete', async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.id);
        res.redirect('/menu/ingredients');
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        res.status(500).send('Failed to delete ingredient');
    }
});

// -------------------- MENU ITEMS --------------------

// View all menu items
router.get('/items', async (req, res) => {
    try {
        const menuItems = await MenuItem.find()
            .populate('ingredients.ingredient')
            .lean();
        res.render('menu/items/index', { menuItems });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).send('Failed to load menu items');
    }
});

// New menu item form
router.get('/items/new', async (req, res) => {
    try {
        const ingredients = await Ingredient.find().lean();
        res.render('menu/items/new', { ingredients });
    } catch (error) {
        console.error('Error loading new menu item form:', error);
        res.status(500).send('Failed to load new menu item form');
    }
});

// Create menu item
router.post('/items', async (req, res) => {
    try {
        const { name, description, price, category, is_available, selectedIngredients } = req.body;

        // Build an array of ingredients from the selectedIngredients
        // Example: selectedIngredients could be an array of {ingredientID, quantity} from the form
        const ingredientsArray = selectedIngredients.map(el => ({
            ingredient: el.ingredientID,
            quantity: el.quantity
        }));

        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            is_available: is_available || 1,
            ingredients: ingredientsArray
        });
        await menuItem.save();

        res.redirect('/menu/items');
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).send('Failed to create menu item');
    }
});

// Edit menu item form
router.get('/items/:id/edit', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id).lean();
        const ingredients = await Ingredient.find().lean();

        if (!menuItem) return res.status(404).send('Menu item not found');

        res.render('menu/items/edit', {
            menuItem,
            ingredients
        });
    } catch (error) {
        console.error('Error loading edit menu item form:', error);
        res.status(500).send('Failed to load edit menu item form');
    }
});

// Update menu item
router.post('/items/:id', async (req, res) => {
    try {
        const { name, description, price, category, is_available, selectedIngredients } = req.body;

        const ingredientsArray = selectedIngredients.map(el => ({
            ingredient: el.ingredientID,
            quantity: el.quantity
        }));

        await MenuItem.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                category,
                is_available: is_available || 1,
                ingredients: ingredientsArray
            }
        );

        res.redirect('/menu/items');
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).send('Failed to update menu item');
    }
});

// Delete menu item
router.post('/items/:id/delete', async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.redirect('/menu/items');
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).send('Failed to delete menu item');
    }
});

module.exports = router;