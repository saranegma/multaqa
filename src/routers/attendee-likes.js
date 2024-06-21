const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Attendee = require('../models/attendee');
const Event = require('../models/event');

//const { ObjectId } = mongoose.Types;

router.post('/attendee/saveEvent', async (req, res) => {
  try {
    const userId = req.body.user_id;
    const event_id = req.body.event_id;

    if (!userId || !event_id) {
      throw new Error('Attendee ID and Event ID are required');
    }

    // Check if the event exists
    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find the attendee and update the savedEvents array
    const attendee = await Attendee.findOne({ user_id: userId });
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    if (!attendee.savedEvents.includes(event_id)) {
      attendee.savedEvents.push(event_id);
      await attendee.save();
    }

    res.status(200).json({ message: 'Event saved successfully', savedEvents: attendee.savedEvents });

  } catch (e) {
    console.error('Error saving event:', e);
    res.status(400).json({ error: e.message });
  }
});

///////////delete the saved event//////////
router.delete('/attendee/saveEvent', async (req, res) => {
    try {
      const userId = req.body.user_id;
      const event_id = req.body.event_id;
  
      if (!userId || !event_id) {
        throw new Error('Attendee ID and Event ID are required');
      }
  
      // Check if the event exists
      const event = await Event.findById(event_id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      // Find the attendee and update the savedEvents array
      const attendee = await Attendee.findOne({ user_id: userId });
      if (!attendee) {
        return res.status(404).json({ error: 'Attendee not found' });
      }
  
      const eventIndex = attendee.savedEvents.indexOf(event_id);
      if (eventIndex > -1) {
        attendee.savedEvents.splice(eventIndex, 1);
        await attendee.save();
      } else {
        return res.status(404).json({ error: 'Event not found in saved events' });
      }
  
      res.status(200).json({ message: 'Event removed successfully', savedEvents: attendee.savedEvents });
  
    } catch (e) {
      console.error('Error removing saved event:', e);
      res.status(400).json({ error: e.message });
    }
  });

  router.get('/attendee/saveEvent/:user_id', async (req, res) => {
    try {
      const userId = req.params.user_id;
      
      const attendee = await Attendee.findOne({ user_id: userId })
       .populate('savedEvents');
      if (!attendee) {
        return res.status(404).json({ error: 'Attendee not found' });
      }
      
      res.status(200).json({ savedEvents: attendee.savedEvents });
    } catch (e) {
      console.error('Error fetching saved events:', e);
      res.status(400).json({ error: e.message });
    }
  });

  router.get('/attendee/booked-tickets/:user_id', async (req, res) => {
    try {
      const userId = req.params.user_id;
      
      const attendee = await Attendee.findOne({ user_id: userId })
                                     .populate({
                                       path:
                                        'bookedTickets',
                                      populate: {
                                         path: 'eventId',
                                         select: 'title time date',
                                         model: 'Event',
                                         
                                       }
                                    }
                                    );
      if (!attendee) {
        return res.status(404).json({ error: 'Attendee not found' });
      }
      
      res.status(200).json({ bookedTickets: attendee.bookedTickets });
    } catch (e) {
      console.error('Error fetching booked tickets:', e);
      res.status(400).json({ error: e.message });
    }
  });







module.exports = router;