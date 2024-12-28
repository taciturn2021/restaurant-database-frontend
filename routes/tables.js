// routes/tables.js
const express = require('express');
const router = express.Router();
const Restaurant_Table = require('../models/restaurant_table');

// GET all tables (index)
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

// GET new table form (must come before /:id routes)
router.get('/new', (req, res) => {
    res.render('tables/new');
});

// POST create new table
router.post('/', async (req, res) => {
    try {
        const table = new Restaurant_Table({
            number: req.body.number,
            capacity: req.body.capacity,
            location: req.body.location,
            status: req.body.status || 'Available'
        });

        await table.save();
        res.redirect('/tables');
    } catch (error) {
        console.error('Error creating table:', error);
        // Check for duplicate key error
        if (error.code === 11000) {
            res.render('tables/new', {
                error: 'Table number already exists. Please choose a different number.',
                table: req.body
            });
        } else {
            res.render('tables/new', {
                error: 'Error creating table: ' + error.message,
                table: req.body
            });
        }
    }
});


// GET single table
router.get('/:id', async (req, res) => {
    try {
        const table = await Restaurant_Table.findById(req.params.id).lean();
        if (!table) {
            return res.status(404).render('error', { message: 'Table not found' });
        }

        res.render('tables/show', { table });
    } catch (error) {
        console.error('Error fetching table:', error);
        res.status(500).render('error', { message: 'Error loading table data' });
    }
});

// GET edit form
router.get('/:id/edit', async (req, res) => {
    try {
        const table = await Restaurant_Table.findById(req.params.id).lean();
        if (!table) {
            return res.redirect('/tables');
        }

        const formData = {
            id: table._id.toString(),
            number: table.number,
            capacity: table.capacity,
            location: table.location,
            status: table.status
        };

        res.render('tables/edit', { table: formData });
    } catch (error) {
        console.error('Error fetching table for edit:', error);
        res.redirect('/tables');
    }
});

// POST update table
router.post('/:id/update', async (req, res) => {
    try {
        const table = await Restaurant_Table.findById(req.params.id);
        if (!table) {
            return res.redirect('/tables');
        }

        table.number = req.body.number;
        table.capacity = req.body.capacity;
        table.location = req.body.location;
        table.status = req.body.status || 'Available';

        await table.save();
        res.redirect('/tables');
    } catch (error) {
        console.error('Error updating table:', error);
        // Check for duplicate key error
        if (error.code === 11000) {
            res.render('tables/edit', {
                error: 'Table number already exists. Please choose a different number.',
                table: { ...req.body, id: req.params.id }
            });
        } else {
            res.render('tables/edit', {
                error: 'Error updating table: ' + error.message,
                table: { ...req.body, id: req.params.id }
            });
        }
    }
});

// POST delete table
router.post('/:id/delete', async (req, res) => {
    try {
        await Restaurant_Table.findByIdAndDelete(req.params.id);
        res.redirect('/tables');
    } catch (error) {
        console.error('Error deleting table:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;