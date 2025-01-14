const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();  // Add this line to use environment variables

const connectDB = require('./config/database');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});
app.use('/employees', require('./routes/employees'));
app.use('/customers', require('./routes/customers'));
app.use('/orders', require('./routes/orders'));
app.use('/tables', require('./routes/tables'));
app.use('/reservations', require('./routes/reservations'));
app.use('/menu', require('./routes/menu'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

