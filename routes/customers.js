const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.render('customers/index', { customers });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;