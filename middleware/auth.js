const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.redirect('/login');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.clearCookie('accessToken');
            return res.redirect('/login');
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.redirect('/login');
    }
};

module.exports = authMiddleware;