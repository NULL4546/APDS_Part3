import LoginAttempt from '../models/LoginAttempt.js';

const loginAttemptLogger = async (req, res, next) => {

    const originalJson = res.json.bind(res);

    res.json = async function(data) {
        try {
            const username = req.body.username;
            const ipAddress = req.ip || req.connection.remoteAddress;
            
            const successfulLogin = data.token ? true : false; 
            await LoginAttempt.create({ username, ipAddress, successfulLogin });

        } catch (err) {
            console.error('Error logging login attempt:', err);
        }

        return originalJson(data);
    };

    next();
};

export default loginAttemptLogger;
