const mongoose = require('mongoose')

const Feedback_AttendeeSchema = new mongoose.Schema({
  attendee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'eventAttendee',
    required: true
  },
  feedback_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
    required: true
  }
})

const Feedback_Attendee = mongoose.model('Feedback_Attendee', Feedback_AttendeeSchema)

module.exports = Feedback_Attendee