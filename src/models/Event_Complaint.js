
const mongoose = require('mongoose')

const Event_ComplaintSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  complaint_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  }
})

const Event_Complaint = mongoose.model('Event_Complaint', Event_ComplaintSchema)

module.exports = Event_Complaint