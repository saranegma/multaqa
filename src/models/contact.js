const mongoose = require('mongoose')
const validator = require('validator')

const contactSchema = new mongoose.Schema({
  name: {
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
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
})

const Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact
