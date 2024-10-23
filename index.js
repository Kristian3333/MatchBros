const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');
require('dotenv').config();

const app = express();

console.log('JWT_SECRET:', process.env.JWT_SECRET);
// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema - Move this before using the User model
const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    name: String,
    interests: {
        fitness: { type: Number, min: 0, max: 10 },
        goingOut: { type: Number, min: 0, max: 10 },
        timFerriss: { type: Number, min: 0, max: 10 },
        chess: { type: Number, min: 0, max: 10 },
        entrepreneurship: { type: Number, min: 0, max: 10 },
        gaming: { type: Number, min: 0, max: 10 },
        andrewHuberman: { type: Number, min: 0, max: 10 }
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', UserSchema);

// Public Routes - These should be before any middleware
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        console.log('Registration attempt:', { email, name }); // Debug log

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
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
        console.log('User saved successfully:', user._id); // Debug log

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, userId: user._id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, userId: user._id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Protected Routes - These should be after the auth middleware
app.get('/dashboard', authMiddleware, (req, res) => {
    res.render('index');
});

app.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, 'name interests');
        res.render('users', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/activities', authMiddleware, async (req, res) => {
    res.render('activities');
});

// Protected API Routes
app.post('/api/users', authMiddleware, async (req, res) => {
    try {
        const { name, interests } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, interests },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

app.get('/api/activities/groups/:size', authMiddleware, async (req, res) => {
    try {
        const groupSize = parseInt(req.params.size);
        const currentUser = await User.findById(req.userId);
        const users = await User.find({ _id: { $ne: req.userId } });

        // Your existing group formation logic here
        const activities = []; // Replace with your actual logic

        res.json(activities);
    } catch (error) {
        console.error('Error forming groups:', error);
        res.status(500).json({ message: 'Error forming groups' });
    }
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;