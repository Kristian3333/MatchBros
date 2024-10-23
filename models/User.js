const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
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

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;