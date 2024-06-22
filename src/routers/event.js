const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose'); // Ensure mongoose is imported
const Event = require('../models/event'); // Assuming this is your Mongoose Event model

// Create Event

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { ObjectId } = mongoose.Types;

router.post('/event', upload.single('image'), async (req, res) => {
    try {
      const user_id = req.body.user_id;
      if (!user_id) {
        throw new Error('user_id is required');
      }
      
      const eventData = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        time: req.body.time,
        date: req.body.date,
        location: req.body.location,
        onlineUrl: req.body.onlineUrl,
        user_id: new ObjectId(user_id),
        category_id: req.body.category_id ? new ObjectId(req.body.category_id) : undefined,
        availableTickets: req.body.availableTickets,
        soldTickets: req.body.soldTickets
      };
  
      if (req.file) {
        eventData.image = req.file.buffer.toString('base64');
        // Alternatively, store it in a cloud service and save the URL
      }
    
      const event = new Event(eventData);
      await event.save();
    
      // Send back the event with _id in the response
      res.status(201).json({ event: { ...event.toObject(), _id: event._id } });
    
    } catch (e) {
      console.error('Error creating event:', e);
      res.status(400).json({ error: e.message });
    }
  });
      
// Get Events

router.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});

// Get Event By ID

router.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }
        res.status(200).send(event);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET Events By UserId

router.get('/events/creator/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch events based on user_id and select specific fields
        const events = await Event.find({ user_id: userId }).select('title description image date');

        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found for the user' });
        }
    
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ message: 'Failed to fetch event details' });
    }
});
// Search Event By Name

router.get('/event/search', async (req, res) => {
    try {
        const searchQuery = req.query.title; 
        if (!searchQuery) {
            return res.status(400).send({ message: 'Search query parameter "title" is required' });
        }
      
        const events = await Event.find({ title: { $regex: new RegExp(searchQuery, 'i') } });

        if (!events || events.length === 0) {
            return res.status(404).send({ message: 'No events found with the specified title' });
        }

        res.status(200).send(events);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Update Event

router.patch('/event/:id', async (req, res) => {
    try {
      const eventId = req.params.id;
      const updatedData = req.body;
  
      const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, { new: true });
  
      if (!updatedEvent) {
        return res.status(404).send({ message: 'Event not found' });
      }
  
      res.send(updatedEvent);
    } catch (error) {
      res.status(500).send({ message: 'Error updating event', error });
    }
  });

// Delete Event By ID

router.delete('/event/delete/:eventNumber', async (req, res) => {
    try {
        const eventNumber = req.params.eventNumber;

        // Find the event by eventNumber and remove it
        const deletedEvent = await Event.findOneAndDelete({ eventNumber: eventNumber });

        if (!deletedEvent) {
            return res.status(404).send({ error: 'Event not found' });
        }

        res.status(200).send("the event has been deleted successfully");
    } catch (e) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Delete All Events

router.delete('/event/all', async (req, res) => {
    try {
        // Delete all events
        const result = await Event.deleteMany({});

        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'No events found' });
        }

        res.status(200).send({ message: 'All events deleted successfully' });
    } catch (e) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

module.exports = router 
