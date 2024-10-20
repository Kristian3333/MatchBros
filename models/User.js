const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    interests: {
        fitness: Number,
        beer: Number,
        goingOut: Number,
        // Add more interests as needed
    },
    date: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;