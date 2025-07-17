const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket'); // assuming you have this model

// POST /api/tickets
router.post('/', async (req, res) => {
    console.log("POST /api/tickets hit!", req.body); // <-- ADD THIS
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// GET /api/tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
