const express = require('express');
const EventAttendee = require('../models/eventAttendee');
const router = express.Router();

////////////////POST/////////////////

router.post('/eventAttendees',  async (req, res) => {
    try {
        const eventAttendee = new EventAttendee(req.body);
        await eventAttendee.save();
        res.status(201).send(eventAttendee);
    } catch (e) {
        res.status(400).send(e);
    }
});

//////////////////GET//////////////////////////

router.get('/eventAttendees',  async (req, res) => {
    try {
        const eventAttendees = await EventAttendee.find({});
        res.status(200).send(eventAttendees);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////GET BY ID////////////////////////////

router.get('/eventAttendees/:id',  async (req, res) => {
    try {
        const eventAttendee = await EventAttendee.findById(req.params.id);
        if (!eventAttendee) {
            return res.status(404).send('Unable to find event attendee');
        }
        res.status(200).send(eventAttendee);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////PATCH//////////////////////////

router.patch('/eventAttendees/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const eventAttendee = await EventAttendee.findById(req.params.id);
        if (!eventAttendee) {
            return res.status(404).send('No event attendee found');
        }

        updates.forEach((update) => (eventAttendee[update] = req.body[update]));
        await eventAttendee.save();
        res.status(200).send(eventAttendee);
    } catch (error) {
        res.status(400).send(error);
    }
});

////////////////////////////////DELETE///////////////////////

router.delete('/eventAttendees/:id', async (req, res) => {
    try {
        const eventAttendee = await EventAttendee.findByIdAndDelete(req.params.id);
        if (!eventAttendee) {
            return res.status(404).send('Unable to find event attendee');
        }
        res.status(200).send(eventAttendee);
    } catch (e) {
        res.status(500).send(e);
    }
});

////////////////////DELETE ALL/////////

// Delete all event attendees
router.delete('/eventAttendees', async (req, res) => {
    try {
        const result = await EventAttendee.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).send('No event attendees found to delete');
        }
        res.status(200).send({ message: `Deleted ${result.deletedCount} event attendees` });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
