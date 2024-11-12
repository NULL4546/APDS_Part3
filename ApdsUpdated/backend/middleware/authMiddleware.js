const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    console.log('Request Headers:', req.headers);

    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader);

    // Check if the Authorization header exists
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header, access denied!' });
    }

    // Split the header to extract the token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Authorization header format must be Bearer [Token]' });
    }

    const token = parts[1];
    console.log('Token:', token);

    // Check if a token was provided
    if (!token) {
        return res.status(401).json({ message: 'No token provided, access denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded:', decoded);
        req.user = decoded;  // Attach the decoded payload to the request
        next();  // Move to the next middleware or route handler
    } catch (err) {
        console.error('Token Verification Failed:', err);
        // Handle specific JWT errors
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid Token, access denied' });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token Expired, access denied' });
        }
        // Handle generic server errors
        res.status(500).json({ message: 'Server error during authentication', error: err });
    }
};

module.exports = authMiddleware;
