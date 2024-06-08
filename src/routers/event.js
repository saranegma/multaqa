const express = require ('express')
const Event = require('../models/event')
const router = express.Router()

//////////create event////////////////

router.post('/event', async (req, res) => {
    try {
        const eventData = {
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            time: req.body.time,
            date: req.body.date,
            location: req.body.location,
            category_id: req.body.category_id // Include if provided
        };

        const event = new Event(eventData);
        await event.save();
        res.status(200).send(event);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

//////////////////GET//////////////////////////

router.get('/event', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).send(events);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

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