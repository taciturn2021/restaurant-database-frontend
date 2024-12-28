const express = require('express');
const router = express.Router();
const RestaurantTable = require('../models/restaurant_table');

// Get all tables
router.get('/', async (req, res) => {
    try {
        const tables = await RestaurantTable.find().lean();

        // Map the data to match the template's expectations
        const mappedTables = tables.map(table => ({
            id: table._id,
            capacity: table.capacity || 'N/A',
            location: table.location || 'N/A',
            status: table.status || 'Available'
        }));

        res.render('tables/index', { tables: mappedTables });
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).send(error.message);
    }
});

// Create new table
router.post('/', async (req, res) => {
    try {
        await RestaurantTable.create({
            capacity: req.body.capacity,
            location: req.body.location,
            status: 'Available'
        });
        res.redirect('/tables');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;