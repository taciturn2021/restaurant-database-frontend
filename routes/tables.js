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

// READ - Get single table
router.get('/:id', async (req, res) => {
    try {
        const table = await Restaurant_Table.findById(req.params.id).lean();
        if (!table) {
            return res.status(404).send('Table not found');
        }

        res.render('tables/show', { table });
    } catch (error) {
        console.error('Error fetching table:', error);
        res.status(500).send(error.message);
    }
});

// CREATE - Add new table
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
        res.status(500).send(error.message);
    }
});

// UPDATE - Update table
router.put('/:id', async (req, res) => {
    try {
        const table = await Restaurant_Table.findById(req.params.id);
        if (!table) {
            return res.status(404).send('Table not found');
        }

        table.number = req.body.number || table.number;
        table.capacity = req.body.capacity || table.capacity;
        table.location = req.body.location || table.location;
        table.status = req.body.status || table.status;

        await table.save();
        res.redirect('/tables');
    } catch (error) {
        console.error('Error updating table:', error);
        res.status(500).send(error.message);
    }
});

// DELETE - Remove table
router.delete('/:id', async (req, res) => {
    try {
        const table = await Restaurant_Table.findById(req.params.id);
        if (!table) {
            return res.status(404).send('Table not found');
        }

        await Restaurant_Table.findByIdAndDelete(req.params.id);
        res.redirect('/tables');
    } catch (error) {
        console.error('Error deleting table:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;