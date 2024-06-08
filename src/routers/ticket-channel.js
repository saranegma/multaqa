const express = require('express');
const Tickets_Channel = require('../models/Tickets_Channel')
const router = express.Router();

////////////////POST/////////////////

router.post('/ticketsChannel', async (req, res) => {
    try {
        const tickets_channel = new Tickets_Channel(req.body);
        await tickets_channel.save();
        res.status(201).send(tickets_channel);
    } catch (e) {
        res.status(400).send(e);
    }
});

//////////////////GET//////////////////////////

router.get('/ticketsChannel', async (req, res) => {
    try {
        const tickets_channels = await Tickets_Channel.find({});
        res.status(200).send(tickets_channels);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////GET BY ID////////////////////////////

router.get('/ticketsChannel/:id',  async (req, res) => {
    try {
        const tickets_channel = await Tickets_Channel.findById(req.params.id);
        if (!tickets_channel) {
            return res.status(404).send('Unable to find tickets channel');
        }
        res.status(200).send(tickets_channel);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////PATCH//////////////////////////

router.patch('/ticketsChannel/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const tickets_channel = await Tickets_Channel.findById(req.params.id);
        if (!tickets_channel) {
            return res.status(404).send('No tickets channel found');
        }

        updates.forEach((update) => (tickets_channel[update] = req.body[update]));
        await tickets_channel.save();
        res.status(200).send(tickets_channel);
    } catch (error) {
        res.status(400).send(error);
    }
});

////////////////////////////////DELETE///////////////////////

router.delete('/ticketsChannel/:id', async (req, res) => {
    try {
        const tickets_channel = await Tickets_Channel.findByIdAndDelete(req.params.id);
        if (!tickets_channel) {
            return res.status(404).send('Unable to find tickets channel');
        }
        res.status(200).send(tickets_channel);
    } catch (e) {
        res.status(500).send(e);
    }
});

////////////////////DELETE ALL/////////

// Delete all tickets channels
router.delete('/ticketsChannel', async (req, res) => {
    try {
        const result = await Tickets_Channel.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).send('No tickets channels found to delete');
        }
        res.status(200).send({ message: `Deleted ${result.deletedCount} tickets channels` });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
