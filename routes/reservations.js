// routes/reservations.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const Restaurant_Table = require('../models/restaurant_table');
const Customer = require('../models/customer');

// Get all reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('table_id')
            .populate({
                path: 'customer_id',
                populate: {
                    path: 'person_id'
                }
            })
            .sort({ date: 1, time: 1 })
            .lean();

        const mappedReservations = reservations.map(reservation => ({
            id: reservation._id.toString(),
            tableNumber: reservation.table_id.number,
            customerName: reservation.customer_id.person_id.name,
            date: new Date(reservation.date).toLocaleDateString(),
            time: reservation.time,
            partySize: reservation.party_size,
            status: reservation.status,
            specialRequests: reservation.special_requests || 'None'
        }));

        res.render('reservations/index', { reservations: mappedReservations });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.render('reservations/index', {
            reservations: [],
            error: 'Error loading reservations'
        });
    }
});

// Show new reservation form
router.get('/new', async (req, res) => {
    try {
        // Get available tables and customers for the form
        const tables = await Restaurant_Table.find({ status: 'Available' }).lean();
        const customers = await Customer.find()
            .populate('person_id')
            .lean();

        const mappedCustomers = customers.map(customer => ({
            id: customer._id.toString(),
            name: customer.person_id.name
        }));

        res.render('reservations/new', {
            tables: tables,
            customers: mappedCustomers
        });
    } catch (error) {
        console.error('Error loading form data:', error);
        res.redirect('/reservations');
    }
});

// Create new reservation
router.post('/', async (req, res) => {
    try {
        // First check if party size is valid for the selected table
        const table = await Restaurant_Table.findById(req.body.table_id);
        if (!table) {
            throw new Error('Selected table not found');
        }

        // Check if party size exceeds table capacity
        if (parseInt(req.body.party_size) > table.capacity) {
            throw new Error(`Party size (${req.body.party_size}) exceeds table capacity (${table.capacity})`);
        }

        // Create the reservation
        const reservation = new Reservation({
            table_id: req.body.table_id,
            customer_id: req.body.customer_id,
            date: new Date(req.body.date),
            time: req.body.time,
            party_size: req.body.party_size,
            special_requests: req.body.special_requests
        });

        await reservation.save();

        // Update table status to Reserved
        await Restaurant_Table.findByIdAndUpdate(req.body.table_id, {
            status: 'Reserved'
        });

        res.redirect('/reservations');
    } catch (error) {
        console.error('Error creating reservation:', error);

        // Get tables and customers for form re-render
        const tables = await Restaurant_Table.find({ status: 'Available' }).lean();
        const customers = await Customer.find()
            .populate('person_id')
            .lean();

        const mappedCustomers = customers.map(customer => ({
            id: customer._id.toString(),
            name: customer.person_id.name
        }));

        res.render('reservations/new', {
            error: 'Error creating reservation: ' + error.message,
            formData: req.body,
            tables: tables,
            customers: mappedCustomers
        });
    }
});

// Delete reservation
router.post('/:id/delete', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.redirect('/reservations');
        }

        // Update table status back to Available
        await Restaurant_Table.findByIdAndUpdate(reservation.table_id, {
            status: 'Available'
        });

        await Reservation.findByIdAndDelete(req.params.id);
        res.redirect('/reservations');
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.redirect('/reservations');
    }
});

module.exports = router;