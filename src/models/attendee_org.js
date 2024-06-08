const mongoose = require('mongoose')

const attendee_organizerSchema = new mongoose.Schema({
    attendee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventAttendee',
        required: true
    },
    eventOrganizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organizer',
      required: true
    }
})

const attendee_organizer = mongoose.model('attendee_organizer', attendee_organizerSchema)

module.exports = attendee_organizer