const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose'); // Ensure mongoose is imported
const Event = require('../models/event'); // Assuming this is your Mongoose Event model

//////////create event////////////////

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
            time: req.body.time,
            date: req.body.date,
            location: req.body.location,
            user_id: new ObjectId(user_id), // Create a new ObjectId instance
            category_id: req.body.category_id ? new ObjectId(req.body.category_id) : undefined // Create a new ObjectId instance if provided
        };

        if (req.file) {
            eventData.image = req.file.buffer.toString('base64');
            // Alternatively, store it in a cloud service and save the URL
        }

        const event = new Event(eventData);
        await event.save();
        res.status(200).send(event);
    } catch (e) {
        console.error('Error creating event:', e);
        res.status(400).send({ error: e.message });
    }
});

module.exports = router;

//////////////////GET//////////////////////////

router.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});

module.exports = router;

//////////////////////GET (search) BY ID////////////////////////////

/*router.get('/event/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }
        res.status(200).send(event);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});*/

////////////////search by  Event's Name////////

//// ya shereine mynfash ykoon v search be id and name both lazem whada bs 
router.get('/event/search/title', async (req, res) => {
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

////////update an event/////

router.put('/event/update/:eventNumber', async (req, res) => {
    try {
        const eventNumber = req.params.eventNumber;
        const updateData = req.body;

        const updatedEvent = await Event.findOneAndUpdate(
            { eventNumber: eventNumber }, // Find the event by eventNumber
            { $set: updateData }, // Set the fields to be updated
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedEvent) {
            return res.status(404).send({ error: 'Event not found' });
        }

        res.status(200).send(updatedEvent);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

////////////////////////////////DELETE an event (just one)///////////////////////

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

/////////// Delete All Events (kolohom)//////////////////////

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

        /* photos: {
        type: [String],  // photo URLs/paths
        required: false,
        validate: {
        validator: function(array) {
            return array.length > 0 
        }, 
        message: 'At least one photo is required'
        }
    },*/