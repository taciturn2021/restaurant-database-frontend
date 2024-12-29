// models/order_item.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menu_item: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu_Item' },
    quantity: Number,
    price: Number,
    special_instructions: String
});

module.exports = mongoose.model('Order_Item', orderItemSchema);