const mongoose = require('mongoose')

const Event_FeedbackSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  feedback_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
    required: true
  }
})

const Event_Feedback = mongoose.model('Event_Feedback', Event_FeedbackSchema)

module.exports = Event_Feedback