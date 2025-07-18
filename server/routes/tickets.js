const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');
const router = express.Router();
const requireAuth = require('../middleware/auth');

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management API
 */

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: Ticket created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Validation error
 */
router.post(
    '/',
    requireAuth,
    [
        body('title').notEmpty().withMessage('Title is required').trim().escape(),
        body('description').optional().isString().trim().escape(),
        body('status')
            .optional()
            .isIn(['open', 'in progress', 'closed'])
            .trim()
            .escape(),
        body('createdBy').optional().isString().trim().escape(),
        body('assignedTo').optional().isString().trim().escape()
    ],
    handleValidationErrors,
    async (req, res) => {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).json(ticket);
    }
);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       500:
 *         description: Server error
 */
router.get('/', requireAuth, async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found
 */
router.get(
    '/:id',
    requireAuth,
    [param('id').isMongoId().withMessage('Invalid ticket ID')],
    handleValidationErrors,
    async (req, res) => {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        res.json(ticket);
    }
);

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Update a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Ticket updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Ticket not found
 */
router.put(
    '/:id',
    requireAuth,
    [
        param('id').isMongoId().withMessage('Invalid ticket ID'),
        body('title').optional().notEmpty().trim().escape(),
        body('description').optional().isString().trim().escape(),
        body('status')
            .optional()
            .isIn(['open', 'in progress', 'closed'])
            .trim()
            .escape(),
        body('createdBy').optional().isString().trim().escape(),
        body('assignedTo').optional().isString().trim().escape()
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

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 */
router.delete(
    '/:id',
    requireAuth,
    [param('id').isMongoId().withMessage('Invalid ticket ID')],
    handleValidationErrors,
    async (req, res) => {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        res.json({ message: 'Ticket deleted successfully' });
    }
);

/**
 * @swagger
 * /tickets/{id}:
 *   patch:
 *     summary: Partially update a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Ticket updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Ticket not found
 */
router.patch(
    '/:id',
    requireAuth,
    [
        param('id').isMongoId().withMessage('Invalid ticket ID'),
        body('title').optional().notEmpty().trim().escape(),
        body('description').optional().isString().trim().escape(),
        body('status')
            .optional()
            .isIn(['open', 'in progress', 'closed'])
            .trim()
            .escape(),
        body('createdBy').optional().isString().trim().escape(),
        body('assignedTo').optional().isString().trim().escape()
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
