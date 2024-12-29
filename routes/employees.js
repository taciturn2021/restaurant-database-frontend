// routes/employees.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const Waiter = require('../models/waiter');
const Chef = require('../models/chef');
const Person = require('../models/person');
const mongoose = require('mongoose');

// GET all employees with their type-specific information
router.get('/', async (req, res) => {
    try {
        // Fetch all employees with their person details
        const employees = await Employee.find()
            .populate({
                path: 'person_id',
                model: 'Person'
            })
            .lean();

        if (!employees || employees.length === 0) {
            return res.render('employees/index', {
                employees: [],
                error: 'No employees found in database'
            });
        }

        // Fetch type-specific details for each employee
        const mappedEmployees = await Promise.all(employees.map(async (emp) => {
            let typeSpecificDetails = {};

            if (emp.employeeType === 'Waiter') {
                const waiter = await Waiter.findOne({ employee_id: emp._id }).lean();
                if (waiter) {
                    typeSpecificDetails = {
                        section_number: waiter.section_number,
                        total_tips: waiter.total_tips
                    };
                }
            } else if (emp.employeeType === 'Chef') {
                const chef = await Chef.findOne({ employee_id: emp._id }).lean();
                if (chef) {
                    typeSpecificDetails = {
                        specialization: chef.specialization,
                        certification: chef.certification
                    };
                }
            }

            return {
                id: emp._id.toString(),
                name: emp.person_id ? emp.person_id.name : 'N/A',
                position: emp.position || 'N/A',
                shift: emp.shift || 'N/A',
                phone: emp.person_id ? emp.person_id.phone : 'N/A',
                email: emp.person_id ? emp.person_id.email : 'N/A',
                employeeType: emp.employeeType || 'Other',
                ...typeSpecificDetails
            };
        }));

        res.render('employees/index', { employees: mappedEmployees });
    } catch (error) {
        console.error('Error fetching employees:', error);
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

// Create new employee
router.post('/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create person
        const person = new Person({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address
        });
        await person.save({ session });

        // Create employee
        const employee = new Employee({
            person_id: person._id,
            employeeType: req.body.employeeType,
            position: req.body.position,
            shift: req.body.shift,
            salary: req.body.salary
        });
        await employee.save({ session });

        // Create type-specific record
        switch (req.body.employeeType) {
            case 'Waiter':
                const waiter = new Waiter({
                    employee_id: employee._id,
                    section_number: req.body.section_number,
                    total_tips: 0
                });
                await waiter.save({ session });
                break;

            case 'Chef':
                const chef = new Chef({
                    employee_id: employee._id,
                    specialization: req.body.specialization,
                    certification: req.body.certification
                });
                await chef.save({ session });
                break;
        }

        await session.commitTransaction();
        res.redirect('/employees');
    } catch (error) {
        await session.abortTransaction();
        console.error('Error creating employee:', error);
        res.render('employees/new', {
            error: 'Error creating employee: ' + error.message,
            employee: req.body
        });
    } finally {
        session.endSession();
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

        let typeSpecificDetails = {};

        // Fetch type-specific details based on employee type
        if (employee.employeeType === 'Waiter') {
            const waiter = await Waiter.findOne({ employee_id: employee._id }).lean();
            if (waiter) {
                typeSpecificDetails = {
                    section_number: waiter.section_number,
                    total_tips: waiter.total_tips
                };
            }
        } else if (employee.employeeType === 'Chef') {
            const chef = await Chef.findOne({ employee_id: employee._id }).lean();
            if (chef) {
                typeSpecificDetails = {
                    specialization: chef.specialization,
                    certification: chef.certification
                };
            }
        }

        // Combine all data for the template
        const formData = {
            id: employee._id.toString(),
            name: employee.person_id.name,
            phone: employee.person_id.phone,
            email: employee.person_id.email,
            address: employee.person_id.address,
            position: employee.position,
            shift: employee.shift,
            salary: employee.salary,
            employeeType: employee.employeeType,
            ...typeSpecificDetails
        };

        res.render('employees/edit', { employee: formData });
    } catch (error) {
        console.error('Error fetching employee for edit:', error);
        res.redirect('/employees');
    }
});

// Update employee route
router.post('/:id/update', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

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
        }, { session });

        // Update base employee information
        await Employee.findByIdAndUpdate(req.params.id, {
            position: req.body.position,
            shift: req.body.shift,
            salary: req.body.salary,
            employeeType: req.body.employeeType
        }, { session });

        // Handle type-specific updates
        if (req.body.employeeType === 'Waiter') {
            // Remove any existing Chef record if exists
            await Chef.findOneAndDelete({ employee_id: employee._id }, { session });

            // Update or create Waiter record
            await Waiter.findOneAndUpdate(
                { employee_id: employee._id },
                {
                    section_number: req.body.section_number,
                    total_tips: req.body.total_tips || 0
                },
                { upsert: true, session }
            );
        } else if (req.body.employeeType === 'Chef') {
            // Remove any existing Waiter record if exists
            await Waiter.findOneAndDelete({ employee_id: employee._id }, { session });

            // Update or create Chef record
            await Chef.findOneAndUpdate(
                { employee_id: employee._id },
                {
                    specialization: req.body.specialization,
                    certification: req.body.certification
                },
                { upsert: true, session }
            );
        } else {
            // If type is 'Other', remove both Waiter and Chef records if they exist
            await Waiter.findOneAndDelete({ employee_id: employee._id }, { session });
            await Chef.findOneAndDelete({ employee_id: employee._id }, { session });
        }

        await session.commitTransaction();
        res.redirect('/employees');
    } catch (error) {
        await session.abortTransaction();
        console.error('Error updating employee:', error);
        res.render('employees/edit', {
            employee: {
                id: req.params.id,
                ...req.body
            },
            error: 'Error updating employee. Please try again.'
        });
    } finally {
        session.endSession();
    }
});

// Delete employee
router.post('/:id/delete', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            // Delete type-specific records
            if (employee.employeeType === 'Waiter') {
                await Waiter.findOneAndDelete({ employee_id: employee._id }, { session });
            } else if (employee.employeeType === 'Chef') {
                await Chef.findOneAndDelete({ employee_id: employee._id }, { session });
            }

            // Delete associated person
            await Person.findByIdAndDelete(employee.person_id, { session });
            // Delete employee
            await Employee.findByIdAndDelete(req.params.id, { session });
        }

        await session.commitTransaction();
        res.redirect('/employees');
    } catch (error) {
        await session.abortTransaction();
        console.error('Error deleting employee:', error);
        res.redirect('/employees');
    } finally {
        session.endSession();
    }
});

module.exports = router;