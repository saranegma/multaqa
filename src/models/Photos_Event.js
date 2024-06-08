
const validator = require ('validator')
const mongoose = require('mongoose')

const Photos_EventSchema = new mongoose.Schema({
    event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  photos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', 
    required: true
  }
})

const Photos_Event = mongoose.model('Photos_Event', Photos_EventSchema)

module.exports = Photos_Event