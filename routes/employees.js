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

// Show form to create new employee
router.get('/new', (req, res) => {
    res.render('employees/new');
});

router.post('/', async (req, res) => {
    try {
        // First create the person
        const person = new Person({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address
        });
        await person.save();

        // Then create the employee with the person_id reference
        const employee = new Employee({
            person_id: person._id,  // This is the required field that was missing
            position: req.body.position,
            shift: req.body.shift,
            salary: req.body.salary
        });
        await employee.save();

        res.redirect('/employees');
    } catch (error) {
        console.error('Error creating employee:', error);
        res.render('employees/new', {
            error: 'Error creating employee: ' + error.message,
            employee: req.body
        });
    }
});

// Get edit form
router.get('/:id/edit', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('person_id')
            .lean();

        if (!employee) {
            return res.redirect('/employees');
        }

        // Format the data for the edit form
        const formData = {
            id: employee._id.toString(),
            name: employee.person_id.name,
            phone: employee.person_id.phone,
            email: employee.person_id.email,
            address: employee.person_id.address,
            position: employee.position,
            shift: employee.shift,
            salary: employee.salary
        };

        res.render('employees/edit', { employee: formData });
    } catch (error) {
        console.error('Error fetching employee for edit:', error);
        res.redirect('/employees');
    }
});

// Update employee
router.post('/:id/update', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.redirect('/employees');
        }

        // Update person information
        await Person.findByIdAndUpdate(employee.person_id, {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address
        });

        // Update employee information
        await Employee.findByIdAndUpdate(req.params.id, {
            position: req.body.position,
            shift: req.body.shift,
            salary: req.body.salary
        });

        res.redirect('/employees');
    } catch (error) {
        console.error('Error updating employee:', error);
        // Pass back the form data and error message
        res.render('employees/edit', {
            employee: {
                id: req.params.id,
                ...req.body
            },
            error: 'Error updating employee. Please try again.'
        });
    }
});

// Delete employee
router.post('/:id/delete', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            // Delete associated person
            await Person.findByIdAndDelete(employee.person_id);
            // Delete employee
            await Employee.findByIdAndDelete(req.params.id);
        }
        res.redirect('/employees');
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.redirect('/employees');
    }
});

module.exports = router;