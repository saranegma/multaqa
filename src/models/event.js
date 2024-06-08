const mongoose = require("mongoose")

const help = require("mongoose-sequence")(mongoose)
delete mongoose.connection.models['Event'];

const eventsSchema= new mongoose.Schema({
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
        required: true
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
        required: true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:false
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    eventNumber: {
        type: Number,
        unique: true
    }
});
eventsSchema.plugin(help, { inc_field: 'eventNumber' });
const Event = mongoose.model('Event', eventsSchema);

module.exports = Event;
