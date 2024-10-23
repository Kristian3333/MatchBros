const rateLimit = require('express-rate-limit');
const config = require('../config/auth.config');

const authLimiter = rateLimit({
    ...config.rateLimitOptions,
    message: 'Too many requests from this IP, please try again later.'
});

module.exports = authLimiter;