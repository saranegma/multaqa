const express = require('express');
const Feedback_Attendee = require('../models/Feedback_Attendee');
const router = express.Router();

////////////////POST/////////////////

router.post('/feedbackAttendees', async (req, res) => {
    try {
        const feedback_Attendee = new Feedback_Attendee(req.body);
        await feedback_Attendee.save();
        res.status(201).send(feedback_Attendee);
    } catch (e) {
        res.status(400).send(e);
    }
});

//////////////////GET//////////////////////////

router.get('/feedbackAttendees', async (req, res) => {
    try {
        const feedback_Attendees = await Feedback_Attendee.find({});
        res.status(200).send(feedback_Attendees);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////GET BY ID////////////////////////////

router.get('/feedbackAttendees/:id', async (req, res) => {
    try {
        const feedback_Attendee = await Feedback_Attendee.findById(req.params.id);
        if (!feedback_Attendee) {
            return res.status(404).send('Unable to find feedback attendee');
        }
        res.status(200).send(feedback_Attendee);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////PATCH//////////////////////////

router.patch('/feedbackAttendees/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const feedback_Attendee = await Feedback_Attendee.findById(req.params.id);
        if (!feedback_Attendee) {
            return res.status(404).send('No feedback attendee found');
        }

        updates.forEach((update) => (feedback_Attendee[update] = req.body[update]));
        await feedback_Attendee.save();
        res.status(200).send(feedback_Attendee);
    } catch (error) {
        res.status(400).send(error);
    }
});

////////////////////////////////DELETE///////////////////////

router.delete('/feedbackAttendees/:id', async (req, res) => {
    try {
        const feedback_Attendee = await Feedback_Attendee.findByIdAndDelete(req.params.id);
        if (!feedback_Attendee) {
            return res.status(404).send('Unable to find feedback attendee');
        }
        res.status(200).send(feedback_Attendee);
    } catch (e) {
        res.status(500).send(e);
    }
});

////////////////////DELETE ALL/////////

// Delete all feedback attendees
router.delete('/feedbackAttendees', async (req, res) => {
    try {
        const result = await Feedback_Attendee.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).send('No feedback attendees found to delete');
        }
        res.status(200).send({ message: `Deleted ${result.deletedCount} feedback attendees` });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
