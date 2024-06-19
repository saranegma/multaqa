const express = require('express');
const Ticket = require('../models/ticket');
const Event = require('../models/event');
const router = express.Router();

// Create Ticket

router.post('/tickets', async (req, res) => {
  try {
    const { eventId, number_of_tickets, ...ticketData } = req.body;

    // Check if eventId and number_of_tickets are provided
    if (!eventId) {
      return res.status(400).json({ error: 'eventId is required' });
    }
    if (!number_of_tickets || isNaN(number_of_tickets) || number_of_tickets <= 0) {
      return res.status(400).json({ error: 'Number of tickets must be a valid positive integer' });
    }

    // Create a new Ticket instance with provided data
    const ticket = new Ticket({
      ...ticketData,
      eventId: eventId,
      number_of_tickets: number_of_tickets  // Assigning number_of_tickets from request body
    });

    // Save the ticket to the database
    await ticket.save();

    // Update available tickets in the corresponding event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Increment availableTickets by the number of tickets sold
    event.availableTickets = (event.availableTickets || 0) + parseInt(number_of_tickets);
    await event.save();

    // Respond with the created ticket data
    res.status(201).json(ticket);

  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(400).json({ error: error.message || 'Failed to create ticket' });
  }
});

// Get Tickets

router.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).send(tickets);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get Ticket By Event ID

router.get('/tickets/:eventId/titles', async (req, res) => {
  try {
    const tickets = await Ticket.findOne({ eventId: req.params.eventId });
    res.status(200).send(tickets);
  } catch (e) {
    console.error('Error fetching tickets:', e);
    res.status(500).send('Error fetching tickets. Please try again later.');
  }
});

// Update Ticket By ID

router.patch('/tickets/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).send('No ticket found');
    }

    updates.forEach((update) => (ticket[update] = req.body[update]));
    await ticket.save();
    res.status(200).send(ticket);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete Ticket By ID

router.delete('/tickets/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
        return res.status(404).send('Unable to find ticket');
    }
    res.status(200).send(ticket);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Delete All Ticket

router.delete('/tickets', async (req, res) => {
  try {
    const result = await Ticket.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).send('No tickets found to delete');
    }
    res.status(200).send({ message: `Deleted ${result.deletedCount} tickets` });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
