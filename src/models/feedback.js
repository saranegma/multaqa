const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  like: {
    type: Boolean,
    default: false
  }
})

const Feedback = mongoose.model('Feedback', feedbackSchema)

module.exports = Feedback