const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.render('employees/index', { employees });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;