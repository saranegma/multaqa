const mongoose = require('mongoose')

const eventTicketSchema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    ticket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    available: {
        type: Boolean
    },
    quantity: {
        type: Number
    }
})

const EventTicket = mongoose.model('EventTicket', eventTicketSchema);

module.exports = EventTicket;
