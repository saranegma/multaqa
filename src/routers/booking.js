const express=require('express')
const router=express.Router()
const Ticket = require('../models/ticket');
const BankAccount = require('../models/BankAccount');
const Event = require('../models/event');
const User = require('../models/user');
const EventOrganizer=require('../models/organizer')



router.post('/bookTicket', async (req, res) => {
    const { userId, bankAccountId, eventId, ticketPrice } = req.body;
  
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
  
     if (event.availableTickets <= 0) {
       return res.status(400).send({ message: 'Tickets not available for this event' });
      } 
      //const percentage=[0.5,]
      if(ticketPrice<200){
        var fee = ticketPrice * 0.05;
        var netAmount = ticketPrice - fee;
      }  if(ticketPrice>=200 && ticketPrice<750){

const fee = ticketPrice * 0.075;
        var netAmount = ticketPrice - fee;
      }
      else if(ticketPrice>=750 && ticketPrice<1500){
        var fee = ticketPrice * 0.1;
        var netAmount = ticketPrice - fee;
      }
      else {
        var fee = ticketPrice * 0.15;
        var netAmount = ticketPrice - fee;
      }

     // const fee = ticketPrice * 0.025;
    //const netAmount = ticketPrice - fee;
  
      await bankAccount.deductAmountAndRecordTransaction(ticketPrice);
  
      const ticket = new Ticket({
        userId,
        eventId,
        price: ticketPrice,
        sales_channel:'card'
      });
  
      await ticket.save();

      
  
      event.availableTickets -= 1;
      event.soldTickets += 1;
      event.orgRevenue += netAmount;
      event.websiteRevenue += fee;
      await event.save();
///organizer"s revenue///////
      let organizer = await EventOrganizer.findOne({ user_id: event.user_id });
    if (!organizer) {
      organizer = new EventOrganizer({ user_id: event.user_id });
    }
    organizer.revenue += netAmount;
    await organizer.save();
////////admin's revenue//////
/*
const ticket = new Ticket({
      userId,
      eventId,
      price: ticketPrice,
      sales_channel: 'Online'
    });

*/
  
      res.status(200).send({ message: 'Ticket booked successfully', ticket });
    } catch (error) {
      res.status(500).send({ message: 'Error booking ticket', error: error.message });
    }
  });


/*
user.tickets.push(ticket._id);
    await user.save();

/////////////
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