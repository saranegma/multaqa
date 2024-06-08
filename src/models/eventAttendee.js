const mongoose = require('mongoose')

const eventAttendeeSchema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
});

const eventAttendee = mongoose.model('eventAttendee', eventAttendeeSchema)

module.exports = eventAttendee
