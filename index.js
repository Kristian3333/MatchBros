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

app.get('/activities', async (req, res) => {
    try {
        await dbConnect();
        const users = await User.find().sort({ date: -1 });
        console.log('Retrieved', users.length, 'users from database');
        
        if (users.length === 0) {
            return res.render('activities', { activities: [] });
        }

        const activities = generateActivityGroups(users);
        console.log('Generated activities:', activities.length);
        
        res.render('activities', { activities });
    } catch (error) {
        console.error('Failed to generate activity groups:', error);
        res.status(500).render('error', { message: 'Failed to generate activity groups', error });
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;