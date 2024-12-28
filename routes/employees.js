// routes/employees.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const Person = require('../models/person');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {

        // First check if collections exist
        const collections = await mongoose.connection.db.listCollections().toArray();

        const employees = await Employee.find()
            .populate({
                path: 'person_id',
                model: 'Person'
            })
            .lean();


        if (!employees || employees.length === 0) {
            console.log('No employees found in database');
            return res.render('employees/index', {
                employees: [],
                error: 'No employees found in database'
            });
        }

        const mappedEmployees = employees.map(emp => ({
            id: emp._id.toString(),
            name: emp.person_id ? emp.person_id.name : 'N/A',
            position: emp.position || 'N/A',
            shift: emp.shift || 'N/A',
            phone: emp.person_id ? emp.person_id.phone : 'N/A',
            email: emp.person_id ? emp.person_id.email : 'N/A'
        }));

        console.log('Mapped employees data:', JSON.stringify(mappedEmployees, null, 2));
        res.render('employees/index', { employees: mappedEmployees });
    } catch (error) {
        console.error('Error fetching employees:', error);
        console.error('Error stack:', error.stack);
        res.render('employees/index', {
            employees: [],
            error: 'Error loading employees. Please try again.'
        });
    }
});

// Add employee route
router.post('/', async (req, res) => {
    try {
        // Create person first
        const person = new Person({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            hire_date: new Date()
        });
        await person.save();

        // Create employee with reference to person
        const employee = new Employee({
            person_id: person._id,
            salary: req.body.salary,
            position: req.body.position,
            shift: req.body.shift
        });
        await employee.save();

        res.redirect('/employees');
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;