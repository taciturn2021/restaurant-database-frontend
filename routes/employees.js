const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate('person_id')
            .lean();

        res.render('employees/index', {
            employees: employees.map(emp => ({
                id: emp._id,
                name: emp.person_id.name,
                position: emp.position,
                shift: emp.shift,
                phone: emp.person_id.phone,
                email: emp.person_id.email
            }))
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).send('Server error');
    }
});

router.post('/', async (req, res) => {
    try {
        // First create the person
        const person = await Person.create({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            hire_date: new Date()
        });

        // Then create the employee with reference to person
        await Employee.create({
            person_id: person._id,
            salary: req.body.salary,
            position: req.body.position,
            shift: req.body.shift
        });

        res.redirect('/employees');
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;