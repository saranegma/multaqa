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
    name: {
        type: String
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    number_of_tickets: {
        type: Number
    },
    sales_channel: {
        type: String,
        required: true,
        trim: true
    }
})

const Ticket = mongoose.model( 'Ticket' , ticketSchema  )


module.exports = Ticket