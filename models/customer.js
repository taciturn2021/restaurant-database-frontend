const mongoose = require('mongoose');
const Person = require('./person');

const customerSchema = new mongoose.Schema({
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    memberSince: {
        type: Date,
        default: Date.now
    }
});

module.exports = Person.discriminator('Customer', customerSchema);
