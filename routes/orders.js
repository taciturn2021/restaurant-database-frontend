const express = require('express');
const router = express.Router();
const Orders = require('../models/order');

router.get('/', async (req, res) => {
    try {
        const orders = await Orders.find()
            .populate('waiterId')
            .populate('customerId')
            .populate('tableId')
            .populate('items.itemId');
        res.render('orders/index', { orders });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const order = new Orders(req.body);
        await order.save();
        res.redirect('/orders');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;