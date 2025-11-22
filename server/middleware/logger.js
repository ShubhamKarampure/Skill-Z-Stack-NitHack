// src/middleware/logger.js
import morgan from 'morgan';

// Custom token for user info
morgan.token('user', (req) => {
    return req.user ? req.user.email : 'anonymous';
});

// Development logger
export const devLogger = morgan('dev');

// Production logger
export const prodLogger = morgan(
    ':method :url :status :response-time ms - :user',
    {
        skip: (req) => req.url === '/api/v1/health'
    }
);

// Request logger middleware
export const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};
