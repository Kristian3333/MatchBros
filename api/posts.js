// api/posts.js
const express = require('express');
const dbConnect = require('../lib/dbConnect');
const Post = require('../models/Post');

const router = express.Router();

router.get('/posts', async (req, res) => {
    await dbConnect();
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving posts');
    }
});

router.post('/posts', async (req, res) => {
    await dbConnect();
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).redirect('/');  // Redirect to the home page after post creation
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving post');
    }
});

module.exports = router;