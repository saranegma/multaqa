const express = require('express');
const Plan = require('../models/plans');
const router = express.Router();

////////////////POST/////////////////

router.post('/plans', async (req, res) => {
    try {
        const plan = new Plan(req.body);
        await plan.save();
        res.status(201).send(plan);
    } catch (e) {
        res.status(400).send(e);
    }
});

//////////////////GET//////////////////////////

router.get('/plans', async (req, res) => {
    try {
        const plans = await Plan.find({});
        res.status(200).send(plans);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////GET BY ID////////////////////////////

router.get('/plans/:id', async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
            return res.status(404).send('Unable to find plan');
        }
        res.status(200).send(plan);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////PATCH//////////////////////////

router.patch('/plans/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
            return res.status(404).send('No plan found');
        }

        updates.forEach((update) => (plan[update] = req.body[update]));
        await plan.save();
        res.status(200).send(plan);
    } catch (error) {
        res.status(400).send(error);
    }
});

////////////////////////////////DELETE///////////////////////

router.delete('/plans/:id', async (req, res) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).send('Unable to find plan');
        }
        res.status(200).send(plan);
    } catch (e) {
        res.status(500).send(e);
    }
});

////////////////////DELETE ALL/////////

// Delete all plans
router.delete('/plans', async (req, res) => {
    try {
        const result = await Plan.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).send('No plans found to delete');
        }
        res.status(200).send({ message: `Deleted ${result.deletedCount} plans` });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
