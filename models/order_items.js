const mongoose = require('mongoose');

const orderItemsSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant_Order' },
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu_Item' },
    quantity: Number,
    notes: String
});

module.exports = mongoose.model('Order_Items', orderItemsSchema);