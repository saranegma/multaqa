const mongoose = require ('mongoose')
const { Schema } = mongoose


const ticketSchema = new mongoose.Schema ( {
    /*type: {
        type: String,
        enum: ['general', 'vip', 'premium'], //types
        required: true
    },*/
    price: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
    },
    number_of_tickets: {
        type: Number,
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true 
    },
})

const Ticket = mongoose.model( 'Ticket' , ticketSchema  )


module.exports = Ticket