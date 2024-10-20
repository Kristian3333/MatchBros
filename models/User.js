// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    date: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;