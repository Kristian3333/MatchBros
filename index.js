const express = require('express');
const path = require('path');
const dbConnect = require('./lib/dbConnect');
const User = require('./models/User');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./api/users'));  // Mount the API routes

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/users', async (req, res) => {
    await dbConnect();
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (error) {
        res.status(500).send('Failed to retrieve users');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;