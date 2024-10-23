const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/auth');

require('dotenv').config();

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/User');

// Protected Routes with proper error handling
app.get('/dashboard', authMiddleware, (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, 'name interests');
        res.render('users', { users, currentUser: req.user });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).render('error', { message: 'Error fetching users' });
    }
});

app.get('/activities', authMiddleware, async (req, res) => {
    try {
        res.render('activities', { user: req.user });
    } catch (error) {
        console.error('Error loading activities:', error);
        res.status(500).render('error', { message: 'Error loading activities' });
    }
});

// API Routes for form submissions
app.post('/api/users/interests', authMiddleware, async (req, res) => {
    try {
        console.log('Received interests update:', req.body);
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { 
                interests: req.body.interests 
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            success: true, 
            message: 'Interests updated successfully',
            user: updatedUser 
        });
    } catch (error) {
        console.error('Error updating interests:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update interests',
            error: error.message 
        });
    }
});

// Auth routes (your existing login/register routes here)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;