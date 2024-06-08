const express = require('express');
const UserPhone = require('../models/userPhone');
const router = express.Router();

////////////////POST/////////////////

router.post('/userPhones', async (req, res) => {
    try {
        const userPhone = new UserPhone(req.body);
        await userPhone.save();
        res.status(201).send(userPhone);
    } catch (e) {
        res.status(400).send(e);
    }
});

//////////////////GET//////////////////////////

router.get('/userPhones', async (req, res) => {
    try {
        const userPhones = await UserPhone.find({});
        res.status(200).send(userPhones);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////GET BY ID////////////////////////////

router.get('/userPhones/:id', async (req, res) => {
    try {
        const userPhone = await UserPhone.findById(req.params.id);
        if (!userPhone) {
            return res.status(404).send('Unable to find user phone');
        }
        res.status(200).send(userPhone);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////PATCH//////////////////////////

router.patch('/userPhones/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const userPhone = await UserPhone.findById(req.params.id);
        if (!userPhone) {
            return res.status(404).send('No user phone found');
        }

        updates.forEach((update) => (userPhone[update] = req.body[update]));
        await userPhone.save();
        res.status(200).send(userPhone);
    } catch (error) {
        res.status(400).send(error);
    }
});

////////////////////////////////DELETE///////////////////////

router.delete('/userPhones/:id', async (req, res) => {
    try {
        const userPhone = await UserPhone.findByIdAndDelete(req.params.id);
        if (!userPhone) {
            return res.status(404).send('Unable to find user phone');
        }
        res.status(200).send(userPhone);
    } catch (e) {
        res.status(500).send(e);
    }
});

////////////////////DELETE ALL/////////

// Delete all user phones
router.delete('/userPhones', async (req, res) => {
    try {
        const result = await UserPhone.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).send('No user phones found to delete');
        }
        res.status(200).send({ message: `Deleted ${result.deletedCount} user phones` });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
