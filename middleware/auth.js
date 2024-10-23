const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // Check for access token in cookies
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken && !refreshToken) {
            return res.redirect('/login');
        }

        try {
            // Verify access token
            if (accessToken) {
                const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
                req.user = await User.findById(decoded.userId).select('-password');
                return next();
            }
        } catch (error) {
            // Access token expired, try refresh token
            if (!refreshToken) {
                return res.redirect('/login');
            }
        }

        // Try to refresh the token
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user || refreshToken !== user.refreshToken) {
                throw new Error('Invalid refresh token');
            }

            // Generate new tokens
            const newAccessToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '15m' }
            );

            // Set new access token cookie
            res.cookie('accessToken', newAccessToken, {
                ...require('../config/auth.config').cookieOptions,
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            req.user = user;
            next();
        } catch (error) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.redirect('/login');
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.redirect('/login');
    }
};

module.exports = authMiddleware;