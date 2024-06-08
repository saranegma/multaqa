const express = require('express');
const Ticket = require('../models/ticket');
const router = express.Router();

////////////////POST/////////////////

router.post('/tickets', async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).send(ticket);
    } catch (e) {
        res.status(400).send(e);
    }
});

//////////////////GET//////////////////////////

router.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find({});
        res.status(200).send(tickets);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////GET BY ID////////////////////////////

router.get('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send('Unable to find ticket');
        }
        res.status(200).send(ticket);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////PATCH//////////////////////////

router.patch('/tickets/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send('No ticket found');
        }

        updates.forEach((update) => (ticket[update] = req.body[update]));
        await ticket.save();
        res.status(200).send(ticket);
    } catch (error) {
        res.status(400).send(error);
    }
});

////////////////////////////////DELETE///////////////////////

router.delete('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).send('Unable to find ticket');
        }
        res.status(200).send(ticket);
    } catch (e) {
        res.status(500).send(e);
    }
});

////////////////////DELETE ALL/////////

// Delete all tickets
router.delete('/tickets', async (req, res) => {
    try {
        const result = await Ticket.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).send('No tickets found to delete');
        }
        res.status(200).send({ message: `Deleted ${result.deletedCount} tickets` });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
