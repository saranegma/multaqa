const mongoose = require('mongoose')
const validator = require('validator')

const planOrganizerSchema = new mongoose.Schema({
  eventOrganizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organizer',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  noOfSubscription: {
    type: Number,
    required: true,
    min: 0
  }
})


const planOrganizer = mongoose.model('planOrganizer', planOrganizerSchema)

module.exports = planOrganizer