const mongoose = require('mongoose')
const validator = require('validator')

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  features: {
    type: String,
    required: true
  },
  noOfTickets: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
})

const Plan = mongoose.model('Plan', planSchema)

module.exports = Plan