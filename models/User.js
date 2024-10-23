const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check if model already exists
if (mongoose.models.User) {
    module.exports = mongoose.models.User;
} else {
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
        refreshToken: String,
        date: { 
            type: Date, 
            default: Date.now 
        }
    });

    UserSchema.pre('save', async function(next) {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    });

    module.exports = mongoose.model('User', UserSchema);
}