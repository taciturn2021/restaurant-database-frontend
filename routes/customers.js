const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

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


// Create new customer
router.post('/', async (req, res) => {
    try {
        // First create the person
        const person = await Person.create({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address
        });

        // Then create the customer
        await Customer.create({
            person_id: person._id,
            loyalty_points: req.body.loyalty_points || 0,
            member_since: new Date()
        });

        res.redirect('/customers');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;