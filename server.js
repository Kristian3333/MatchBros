const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB } = require('./db');
const { User, Event } = require('./db');
const { authMiddleware } = require('./auth');
const { findMatches } = require('./matching');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
connectDB();

// Routes
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/profile', authMiddleware, async (req, res) => {
    try {
        const { name, interests } = req.body;
        const user = await User.findByIdAndUpdate(req.userId, { name, interests }, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/matches', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const matches = await findMatches(user);
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/events', authMiddleware, async (req, res) => {
    try {
        const { name, date, description } = req.body;
        const event = new Event({ name, date, description, creator: req.userId, attendees: [req.userId] });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/events', authMiddleware, async (req, res) => {
    try {
        const events = await Event.find().populate('creator', 'name');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/events/:id/join', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.attendees.includes(req.userId)) {
            return res.status(400).json({ message: 'Already joined this event' });
        }
        event.attendees.push(req.userId);
        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));