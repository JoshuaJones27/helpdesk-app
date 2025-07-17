const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post(
    '/signup',
    [body('email').isEmail(), body('password').isLength({ min: 6 })],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const { email, password } = req.body;
        const user = new User({ email, password });
        user.save()
            .then(u => {
                const token = jwt.sign({ id: u._id, email: u.email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
                res.status(201).json({ token });
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }
);

router.post(
    '/login',
    [body('email').isEmail(), body('password').exists()],
    async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
);

module.exports = router;
