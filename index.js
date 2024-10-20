const express = require('express');
const path = require('path');
const dbConnect = require('./lib/dbConnect');
const Post = require('./models/Post');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./api/posts'));  // Mount the API routes

app.get('/', async (req, res) => {
    await dbConnect();
    try {
        const posts = await Post.find();
        res.render('index', { posts });
    } catch (error) {
        res.status(500).send('Failed to retrieve posts');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;