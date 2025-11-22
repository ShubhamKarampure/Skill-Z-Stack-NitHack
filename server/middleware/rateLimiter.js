// src/middleware/rateLimiter.js
const requestCounts = new Map();

export const rateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        maxRequests = 100,
        message = 'Too many requests, please try again later'
    } = options;

    return (req, res, next) => {
        const identifier = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        if (!requestCounts.has(identifier)) {
            requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
            return next();
        }

        const userData = requestCounts.get(identifier);

        if (now > userData.resetTime) {
            requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
            return next();
        }

        if (userData.count >= maxRequests) {
            return res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil((userData.resetTime - now) / 1000)
            });
        }

        userData.count++;
        next();
    };
};

// Cleanup old entries every hour
setInterval(() => {
    const now = Date.now();
    for (const [identifier, data] of requestCounts.entries()) {
        if (now > data.resetTime) {
            requestCounts.delete(identifier);
        }
    }
}, 60 * 60 * 1000);
