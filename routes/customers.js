const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Person = require('../models/person');

router.get('/', async (req, res) => {
    try {
        console.log('Attempting to fetch customers...');
        const customers = await Customer.find()
            .populate('person_id')
            .lean();

        console.log('Raw customers data:', customers);

        if (!customers || customers.length === 0) {
            return res.render('customers/index', {
                customers: [],
                error: 'No customers found in database'
            });
        }

        const mappedCustomers = customers.map(cust => ({
            id: cust._id.toString(),
            name: cust.person_id ? cust.person_id.name : 'N/A',
            phone: cust.person_id ? cust.person_id.phone : 'N/A',
            email: cust.person_id ? cust.person_id.email : 'N/A',
            loyalty_points: cust.loyalty_points || 0,
            member_since: cust.member_since ? new Date(cust.member_since).toLocaleDateString() : 'N/A',
            preferences: cust.preferences || 'None'
        }));

        console.log('Mapped customers data:', mappedCustomers);
        res.render('customers/index', { customers: mappedCustomers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.render('customers/index', {
            customers: [],
            error: 'Error loading customers. Please try again.'
        });
    }
});


// READ - Get single customer
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .populate('person_id')
            .lean();

        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        res.render('customers/show', { customer });
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).send(error.message);
    }
});

// GET route for edit page
router.get('/:id/edit', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .populate('person_id')
            .lean();

        if (!customer) {
            return res.status(404).render('error', { message: 'Customer not found' });
        }

        res.render('customers/edit', {
            customer: {
                id: customer._id.toString(),
                name: customer.person_id ? customer.person_id.name : '',
                phone: customer.person_id ? customer.person_id.phone : '',
                email: customer.person_id ? customer.person_id.email : '',
                address: customer.person_id ? customer.person_id.address : '',
                loyalty_points: customer.loyalty_points || 0,
                preferences: customer.preferences || ''
            }
        });
    } catch (error) {
        console.error('Error fetching customer for edit:', error);
        res.status(500).render('error', { message: 'Error loading customer data' });
    }
});

// CREATE
router.post('/', async (req, res) => {
    try {
        // Create person first
        const person = new Person({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address
        });
        await person.save();

        // Create customer with reference to person
        const customer = new Customer({
            person_id: person._id,
            loyalty_points: req.body.loyalty_points || 0,
            member_since: new Date(),
            preferences: req.body.preferences || 'None'
        });
        await customer.save();

        res.redirect('/customers');
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).send(error.message);
    }
});

// UPDATE - Update customer
router.post('/:id/update', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        // Update person information
        await Person.findByIdAndUpdate(customer.person_id, {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address
        });

        // Update customer information
        customer.loyalty_points = req.body.loyalty_points || customer.loyalty_points;
        customer.preferences = req.body.preferences || customer.preferences;
        await customer.save();

        res.redirect('/customers');
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).send(error.message);
    }
});

// DELETE - Remove customer
router.post('/:id/delete', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        // Delete associated person
        await Person.findByIdAndDelete(customer.person_id);
        // Delete customer
        await Customer.findByIdAndDelete(req.params.id);

        res.redirect('/customers');
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;