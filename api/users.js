const express = require('express');
const router = express.Router();
const User = require('../models/User');
const dbConnect = require('../lib/dbConnect');
const { findBestMatches, generateActivityGroups } = require('../utils');

// Get all users
router.get('/users', async (req, res) => {
    try {
        await dbConnect();
        const users = await User.find().sort({ date: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
});

// Create a new user
router.post('/users', async (req, res) => {
    try {
        await dbConnect();
        const newUser = new User({
            name: req.body.name,
            interests: {
                fitness: req.body.interests.fitness,
                goingOut: req.body.interests.goingOut,
                timFerriss: req.body.interests.timFerriss,
                chess: req.body.interests.chess,
                entrepreneurship: req.body.interests.entrepreneurship,
                gaming: req.body.interests.gaming,
                andrewHuberman: req.body.interests.andrewHuberman
            }
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error saving user', error: error.message });
    }
});

// Get matches for a user
router.get('/users/:id/matches', async (req, res) => {
    try {
        await dbConnect();
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const allUsers = await User.find();
        const matches = findBestMatches(user, allUsers);
        res.json(matches);
    } catch (error) {
        console.error('Error finding matches:', error);
        res.status(500).json({ message: 'Error finding matches', error: error.message });
    }
});

// Get activity groups
router.get('/activities', async (req, res) => {
    try {
        await dbConnect();
        const users = await User.find();
        const activities = generateActivityGroups(users);
        res.json(activities);
    } catch (error) {
        console.error('Error generating activity groups:', error);
        res.status(500).json({ message: 'Error generating activity groups', error: error.message });
    }
});

module.exports = router;