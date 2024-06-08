const mongoose = require('mongoose')

const attendee_complaintSchema = new mongoose.Schema({
    attendee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventAttendee',
        required: true
    },
    complaint_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true
    }
})

const attendee_complaint = mongoose.model('attendee_complaint', attendee_complaintSchema)

module.exports = attendee_complaint