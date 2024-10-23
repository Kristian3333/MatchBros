const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

// Load environment variables
require('dotenv').config();

// Check for required environment variables
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

console.log('Environment variables loaded:', {
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set'
});

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import User model
const User = require('./models/User');

// Public Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        console.log('Registration attempt:', { email, name });

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is missing');
            return res.status(500).json({ 
                message: 'Server configuration error'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            email,
            password,
            name,
            interests: {
                fitness: 5,
                goingOut: 5,
                timFerriss: 5,
                chess: 5,
                entrepreneurship: 5,
                gaming: 5,
                andrewHuberman: 5
            }
        });

        await user.save();
        console.log('User saved successfully:', user._id);

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, userId: user._id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Error registering user', 
            error: error.message 
        });
    }
});

// Protected Routes
app.get('/dashboard', authMiddleware, (req, res) => {
    res.render('index');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;