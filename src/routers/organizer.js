const express = require('express');
const Organizer = require('../models/organizer');
const router = express.Router();
const Attendee = require('../models/attendee');
const mongoose = require('mongoose');

router.post('/follow', async (req, res) => {
  try {
    const { attendee_id, organizer_id } = req.body;

    if (!attendee_id || !organizer_id) {
      return res.status(400).json({ error: 'attendee_id and organizer_id are required' });
    }

    const attendee = await Attendee.findOne({ user_id: attendee_id });
    const organizer = await Organizer.findOne({ user_id: organizer_id });

    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    // Ensure attendee.following is initialized as an array
    attendee.following = attendee.following || [];

    if (!attendee.following.includes(organizer_id)) {
      organizer.followers.push(attendee_id);
      attendee.following.push(organizer_id);
    }

    await attendee.save();
    await organizer.save();

    res.status(200).json({ message: 'Successfully followed the organizer' });
  } catch (error) {
    console.error('Error following organizer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/unfollow', async (req, res) => {
  try {
    const { attendee_id, organizer_id } = req.body;

    if (!attendee_id || !organizer_id) {
      return res.status(400).json({ error: 'attendee_id and organizer_id are required' });
    }

    const attendee = await Attendee.findOne({ user_id: attendee_id });
    const organizer = await Organizer.findOne({ user_id: organizer_id });

    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    // Ensure attendee.following is initialized as an array
    attendee.following = attendee.following || [];

    const organizerIndex = attendee.following.indexOf(organizer_id);
    if (organizerIndex !== -1) {
      attendee.following.splice(organizerIndex, 1);
    }

    // Remove attendee_id from organizer's followers array
    const attendeeIndex = organizer.followers.indexOf(attendee_id);
    if (attendeeIndex !== -1) {
      organizer.followers.splice(attendeeIndex, 1);
    }

    await attendee.save();
    await organizer.save();

    res.status(200).json({ message: 'Successfully unfollowed the organizer' });
  } catch (error) {
    console.error('Error unfollowing organizer:', error);
    res.status(500).json({ error: 'Internal server error' });
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

router.get('/organizer/:id', async (req, res) => {
    try {
        const organizer = await Organizer.findOne({user_id: req.params.id});
        if (!organizer) {
            return res.status(404).send('Unable to find organizer');
        }
        res.status(200).send(organizer);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////get the followers count/////////

router.get('/followers/:organizer_id', async (req, res) => {
    try {
      const organizer_id = req.params.organizer_id;
  
      if (!organizer_id) {
        return res.status(400).json({ error: 'organizer_id is required' });
      }
  
      const organizer = await Organizer.findOne({user_id:organizer_id});
  
      if (!organizer) {
        return res.status(404).json({ error: 'Organizer not found' });
      }
  
      const followersCount = organizer.followers.length;
  
      res.status(200).json({ followersCount });
    } catch (error) {
      console.error('Error fetching followers count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

//////////////PATCH//////////////////////////

router.patch('/organizer/:id', async (req, res) => {
  try {
      const updates = Object.keys(req.body);
      const organizer = await Organizer.findOne({ user_id: req.params.id });
      
      if (!organizer) {
          console.log(`Organizer with ID ${req.params.id} not found`);
          return res.status(404).send('No organizer found');
      }

      console.log(`Updating organizer with ID ${req.params.id}`);
      updates.forEach((update) => {
          organizer[update] = req.body[update];
      });

      await organizer.save();
      res.status(200).send(organizer);
  } catch (error) {
      console.error(`Error updating organizer: ${error}`);
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





module.exports = router;
