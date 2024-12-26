const express = require('express');
const router = express.Router();
const Table = require('../models/table');

// Get all tables
router.get('/', async (req, res) => {
    try {
        const tables = await Table.find();
        res.render('tables/index', { tables });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;