const express = require('express');
const Photos_Event = require('../models/Photos_Event');
const router = express.Router();

////////////////POST/////////////////

router.post('/photosEvent', async (req, res) => {
    try {
        const photos_event = new Photos_Event(req.body);
        await photos_event.save();
        res.status(201).send(photos_event);
    } catch (e) {
        res.status(400).send(e);
    }
});

//////////////////GET//////////////////////////

router.get('/photosEvent', async (req, res) => {
    try {
        const photos_events = await Photos_Event.find({});
        res.status(200).send(photos_events);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////GET BY ID////////////////////////////

router.get('/photosEvent/:id', async (req, res) => {
    try {
        const photos_event = await Photos_Event.findById(req.params.id);
        if (!photos_event) {
            return res.status(404).send('Unable to find photos event');
        }
        res.status(200).send(photos_event);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////PATCH//////////////////////////

router.patch('/photosEvent/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const photos_event = await Photos_Event.findById(req.params.id);
        if (!photos_event) {
            return res.status(404).send('No photos event found');
        }

        updates.forEach((update) => (photos_event[update] = req.body[update]));
        await photos_event.save();
        res.status(200).send(photos_event);
    } catch (error) {
        res.status(400).send(error);
    }
});

////////////////////////////////DELETE///////////////////////

router.delete('/photosEvent/:id', async (req, res) => {
    try {
        const photos_event = await Photos_Event.findByIdAndDelete(req.params.id);
        if (!photos_event) {
            return res.status(404).send('Unable to find photos event');
        }
        res.status(200).send(photos_event);
    } catch (e) {
        res.status(500).send(e);
    }
});

////////////////////DELETE ALL/////////

// Delete all photos events
router.delete('/photosEvent', async (req, res) => {
    try {
        const result = await Photos_Event.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).send('No photos events found to delete');
        }
        res.status(200).send({ message: `Deleted ${result.deletedCount} photos events` });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
