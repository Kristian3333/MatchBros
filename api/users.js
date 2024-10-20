// api/users.js
const express = require('express');
const dbConnect = require('../lib/dbConnect');
const User = require('../models/User');

const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        await dbConnect();
        const users = await User.find().sort({ date: -1 });
        console.log(`Retrieved ${users.length} users from database`);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
});

router.post('/users', async (req, res) => {
    try {
        await dbConnect();
        console.log('Received user data:', req.body);
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        console.log('Saved user:', savedUser);
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error saving user', error: error.message });
    }
});

module.exports = router;