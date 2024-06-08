const mongoose = require('mongoose')
const validator = require('validator')

const complaintSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('Email is INVALID');
      }
    }
  }
})


const Complaint = mongoose.model('Complaint', complaintSchema)

module.exports = Complaint