const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
        return res.status(401).json({ error: 'Authorization header required' });

    const token = header.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    } catch {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
}

module.exports = requireAuth;
