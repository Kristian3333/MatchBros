// api/users.js
const express = require('express');
const dbConnect = require('../lib/dbConnect');
const User = require('../models/User');

const router = express.Router();

router.get('/users', async (req, res) => {
    await dbConnect();
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving users');
    }
});

router.post('/users', async (req, res) => {
    await dbConnect();
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving user');
    }
});

module.exports = router;