const express=require('express')
const router=express.Router()
const Ticket = require('../models/ticket');
const BankAccount = require('../models/BankAccount');
const Event = require('../models/event');
const User = require('../models/user');
const EventOrganizer=require('../models/organizer')

const calculateFee = (ticketPrice) => {
  if (ticketPrice < 200) {
    return ticketPrice * 0.05;
  } else if (ticketPrice < 750) {
    return ticketPrice * 0.075;
  } else if (ticketPrice < 1500) {
    return ticketPrice * 0.10;
  } else {
    return ticketPrice * 0.15;
  }
};

router.post('/bookTicket', async (req, res) => {
  const { userId, bankAccountId, eventId, ticketPrice, ticketQuantity, title } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const bankAccount = await BankAccount.findById(bankAccountId);
    if (!bankAccount) {
      return res.status(404).send({ message: 'Bank account not found' });
    }

    if (!user.bankAccount.equals(bankAccount._id)) {
      return res.status(400).send({ message: 'Bank account does not belong to user' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({ message: 'Event not found' });
    }

    if (event.availableTickets < ticketQuantity) {
      return res.status(400).send({ message: 'Not enough tickets available for this event' });
    }

    // Calculate total price and fees
    const totalTicketPrice = ticketPrice * ticketQuantity;
    const fee = calculateFee(ticketPrice) * ticketQuantity;
    const netAmount = totalTicketPrice - fee;

    // Check if user has sufficient balance
    if (bankAccount.balance < totalTicketPrice) {
      return res.status(400).send({ message: 'Insufficient balance' });
    }

    // Deduct total ticket price from user's bank account
    await bankAccount.deductAmountAndRecordTransaction(totalTicketPrice);

    // Record ticket purchases
    const tickets = [];
    for (let i = 0; i < ticketQuantity; i++) {
      const ticket = new Ticket({
        userId,
        eventId,
        price: ticketPrice,
        title: title
      });
      await ticket.save();
      tickets.push(ticket._id);
    }

    // Update event's available and sold tickets
    event.availableTickets -= ticketQuantity;
    event.soldTickets += ticketQuantity;
    event.orgRevenue += netAmount;
    event.websiteRevenue += fee;
    await event.save();

    // Update organizer's revenue
    let organizer = await EventOrganizer.findOne({ user_id: event.user_id });
    if (!organizer) {
      organizer = new EventOrganizer({ user_id: event.user_id });
    }
    organizer.revenue += netAmount;
    await organizer.save();

    // Update user's tickets
    user.tickets.push(...tickets);
    await user.save();

    res.status(200).send({ message: 'Tickets booked successfully', tickets });
  } catch (error) {
    console.error('Error booking tickets:', error.message);
    res.status(500).send({ message: error.message });
  }
});

/*
user.tickets.push(ticket._id);
  await user.save();

//

app.get('/userDashboard/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('tickets');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ 
      tickets: user.tickets.map(ticket => ({
        eventId: ticket.eventId,
        price: ticket.price,
        sales_channel: ticket.sales_channel
      }))
    });
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving user data', error: error.message });
  }
});

*/

module.exports=router