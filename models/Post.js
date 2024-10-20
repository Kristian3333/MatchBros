const mongoose = require('mongoose');

const PreferenceSchema = new mongoose.Schema({
    activity: { type: String, required: true }, // Name of the activity (e.g., "fitness", "beer", etc.)
    rating: { type: Number, required: true, min: 0, max: 10 } // Rating from 0 to 10
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's name
    preferences: [PreferenceSchema], // Array of preferences (each containing an activity and rating)
    date: { type: Date, default: Date.now } // Date when the user submitted their preferences
});

module.exports = mongoose.model('User', UserSchema);

module.exports = Post;

 