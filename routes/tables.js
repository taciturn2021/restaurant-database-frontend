// routes/tables.js
const express = require('express');
const router = express.Router();
const Restaurant_Table = require('../models/restaurant_table');

router.get('/', async (req, res) => {
    try {
        console.log('Attempting to fetch tables...');
        const tables = await Restaurant_Table.find().lean();

        console.log('Raw tables data:', tables);

        if (!tables || tables.length === 0) {
            return res.render('tables/index', {
                tables: [],
                error: 'No tables found in database'
            });
        }

        const mappedTables = tables.map(table => ({
            id: table._id.toString(),
            number: table.number || 'N/A',
            capacity: table.capacity || 0,
            location: table.location || 'N/A',
            status: table.status || 'Available'
        }));

        console.log('Mapped tables data:', mappedTables);
        res.render('tables/index', { tables: mappedTables });
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.render('tables/index', {
            tables: [],
            error: 'Error loading tables. Please try again.'
        });
    }
});

module.exports = router;