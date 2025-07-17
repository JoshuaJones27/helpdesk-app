const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');
const router = express.Router();
const requireAuth = require('../middleware/auth')

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

// Create a new ticket
router.post(
    '/', requireAuth,
    [
        body('title')
            .notEmpty().withMessage('Title is required')
            .trim().escape(),
        body('description')
            .optional()
            .isString()
            .trim().escape(),
        body('status')
            .optional()
            .isIn(['open', 'in progress', 'closed'])
            .trim().escape(),
        body('createdBy')
            .optional()
            .isString()
            .trim().escape(),
        body('assignedTo')
            .optional()
            .isString()
            .trim().escape()
    ],
    handleValidationErrors,
    async (req, res) => {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).json(ticket);
    }
);

// GET all tickets
router.get('/', requireAuth, async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single ticket by ID
router.get(
    '/:id', requireAuth,
    [
        param('id')
            .isMongoId().withMessage('Invalid ticket ID')
    ],
    handleValidationErrors,
    async (req, res) => {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        res.json(ticket);
    }
);

// Update a ticket
router.put(
    '/:id', requireAuth,
    [
        param('id')
            .isMongoId().withMessage('Invalid ticket ID'),
        body('title')
            .optional()
            .notEmpty()
            .trim().escape(),
        body('description')
            .optional()
            .isString()
            .trim().escape(),
        body('status')
            .optional()
            .isIn(['open', 'in progress', 'closed'])
            .trim().escape(),
        body('createdBy')
            .optional()
            .isString()
            .trim().escape(),
        body('assignedTo')
            .optional()
            .isString()
            .trim().escape()
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const ticket = await Ticket.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
            res.json(ticket);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// Delete a ticket
router.delete(
    '/:id', requireAuth,
    [
        param('id')
            .isMongoId().withMessage('Invalid ticket ID')
    ],
    handleValidationErrors,
    async (req, res) => {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        res.json({ message: 'Ticket deleted successfully' });
    }
);

// PATCH /api/tickets/:id — Partial update
router.patch(
    '/:id', requireAuth,
    [
        param('id')
            .isMongoId().withMessage('Invalid ticket ID'),
        body('title')
            .optional()
            .notEmpty()
            .trim().escape(),
        body('description')
            .optional()
            .isString()
            .trim().escape(),
        body('status')
            .optional()
            .isIn(['open', 'in progress', 'closed'])
            .trim().escape(),
        body('createdBy')
            .optional()
            .isString()
            .trim().escape(),
        body('assignedTo')
            .optional()
            .isString()
            .trim().escape()
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const ticket = await Ticket.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true, runValidators: true }
            );
            if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
            res.json(ticket);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

module.exports = router;
