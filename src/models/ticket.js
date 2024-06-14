const mongoose = require ('mongoose')
const { Schema } = mongoose

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  priceType: {
    type: String,
    default: 'Free'
  },
  price: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  numberOfTickets: {
    type: Number,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event',
  },
}, {
  timestamps: true,
});

const Ticket = mongoose.model( 'Ticket' , ticketSchema  )


module.exports = Ticket