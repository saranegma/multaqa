const express = require('express');
const Organizer = require('../models/organizer');
const router = express.Router();

////////////////POST/////////////////

router.post('/organizers', async (req, res) => {
    try {
        const organizer = new Organizer(req.body);
        await organizer.save();
        res.status(201).send(organizer);
    } catch (e) {
        res.status(400).send(e);
    }
});

//////////////////GET//////////////////////////

router.get('/organizers', async (req, res) => {
    try {
        const organizers = await Organizer.find({});
        res.status(200).send(organizers);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////GET BY ID////////////////////////////

router.get('/organizers/:id', async (req, res) => {
    try {
        const organizer = await Organizer.findById(req.params.id);
        if (!organizer) {
            return res.status(404).send('Unable to find organizer');
        }
        res.status(200).send(organizer);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////PATCH//////////////////////////

router.patch('/organizers/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const organizer = await Organizer.findById(req.params.id);
        if (!organizer) {
            return res.status(404).send('No organizer found');
        }

        updates.forEach((update) => (organizer[update] = req.body[update]));
        await organizer.save();
        res.status(200).send(organizer);
    } catch (error) {
        res.status(400).send(error);
    }
});

////////////////////////////////DELETE///////////////////////

router.delete('/organizers/:id', async (req, res) => {
    try {
        const organizer = await Organizer.findByIdAndDelete(req.params.id);
        if (!organizer) {
            return res.status(404).send('Unable to find organizer');
        }
        res.status(200).send(organizer);
    } catch (e) {
        res.status(500).send(e);
    }
});

////////////////////DELETE ALL/////////

// Delete all organizers
router.delete('/organizers', async (req, res) => {
    try {
        const result = await Organizer.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).send('No organizers found to delete');
        }
        res.status(200).send({ message: `Deleted ${result.deletedCount} organizers` });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
