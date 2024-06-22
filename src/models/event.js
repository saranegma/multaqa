const mongoose = require('mongoose');
const help=require("mongoose-sequence")(mongoose)
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    onlineUrl: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false,
        
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: true
    },
    eventNumber: {
        type: Number,
        unique: true
    },    
    availableTickets: {
        type: Number,
        required: true,
        default: 0
    },
    soldTickets: {
        type: Number,
        required: true,
        default: 0
    },
    orgRevenue: {
        type: Number, required: true, default: 0
    },
    websiteRevenue:{
        type: Number, required: true, default: 0
    },
    complaint_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'complaint',
        required:false
    }
},
{
    timestamps:true
});

eventSchema.plugin(help, { inc_field: 'eventNumber' });
const Event = mongoose.model( 'Event' , eventSchema  )

module.exports = Event;
