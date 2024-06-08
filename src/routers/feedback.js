const express = require('express');
const Feedback = require('../models/feedback');
const router = express.Router();

////////////////POST/////////////////

router.post('/feedback', async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();
        res.status(201).send(feedback);
    } catch (e) {
        res.status(400).send(e);
    }
});

//////////////////GET//////////////////////////

router.get('/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({});
        res.status(200).send(feedbacks);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////GET BY ID////////////////////////////

router.get('/feedback/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).send('Unable to find feedback');
        }
        res.status(200).send(feedback);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////PATCH//////////////////////////

router.patch('/feedback/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).send('No feedback found');
        }

        updates.forEach((update) => (feedback[update] = req.body[update]));
        await feedback.save();
        res.status(200).send(feedback);
    } catch (error) {
        res.status(400).send(error);
    }
});

////////////////////////////////DELETE///////////////////////

router.delete('/feedback/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).send('Unable to find feedback');
        }
        res.status(200).send(feedback);
    } catch (e) {
        res.status(500).send(e);
    }
});

////////////////////DELETE ALL/////////

// Delete all feedbacks
router.delete('/feedback', async (req, res) => {
    try {
        const result = await Feedback.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).send('No feedbacks found to delete');
        }
        res.status(200).send({ message: `Deleted ${result.deletedCount} feedbacks` });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
