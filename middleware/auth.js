// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        console.log('Received token:', token); // Debug log

        if (!token) {
            console.log('No token provided'); // Debug log
            return res.status(401).json({ message: 'Authentication required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            console.log('Token verified, userId:', decoded.userId); // Debug log
            next();
        } catch (error) {
            console.error('Token verification failed:', error); // Debug log
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error); // Debug log
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authMiddleware;