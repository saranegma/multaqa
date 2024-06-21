const express = require('express');
const Plan = require('../models/plans');
const router = express.Router();
const Organizer = require('../models/organizer');
const BankAccount = require('../models/BankAccount');

router.post('/plans/:organizerEmail', async (req, res) => {
  const { name, features, duration, type } = req.body;
  const organizerEmail = req.params.organizerEmail; 

  console.log(`Received request to create plan for email: ${organizerEmail}`); 
  try {
      
      const existingOrganizer = await Organizer.findOne({ email: organizerEmail }).populate('bankAccount');
      console.log(`Organizer found: ${existingOrganizer}`); 

      if (!existingOrganizer) {
          return res.status(404).send({ message: 'Organizer not found' });
      }

      
      if (existingOrganizer.chosenPlan) {
          return res.status(400).send({ message: 'Organizer already has a plan' });
      }

      
      let price;
      if (duration === 6) {
          price = 900; // For Standard
      } else if (duration === 12) {
          price = 1700; // For Premium
      } else if (duration === 0) {
          price = 0; // For Basic 
      } else {
          return res.status(400).send({ message: 'Invalid duration' });
      }

      const bankAccount = await BankAccount.findById(existingOrganizer.bankAccount);
      if (!bankAccount) {
          return res.status(404).send({ message: 'Bank account not found' });
      }
      
      if (bankAccount.amount < price) {
          return res.status(400).send({ message: 'Insufficient funds in bank account' });
      }

      // Create new plan and save
      const plan = new Plan({ name, features, duration, price, type });
      await plan.save();

      // Deduct amount from bank account and record transaction
      await bankAccount.deductAmountAndRecordTransaction(price);

      // Update organizer with chosen plan
      existingOrganizer.chosenPlan = plan._id;
      await existingOrganizer.save();

      // Send success response
      res.status(201).send({ message: 'Plan created and chosen successfully', plan, organizer: existingOrganizer });
  } catch (error) {
      // Handle errors
      res.status(500).send({ message: 'Error creating and choosing plan', error: error.message });
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
