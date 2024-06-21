const mongoose = require('mongoose')
const validator = require('validator')

const complaintSchema = new mongoose.Schema({
  
  reason: {
    type: String,
    enum: ['Spam', 'Fraudulent Event Listings or Scams', 'Harmful Content', 'Violence or Extremism',
       'Canceled Event', 'Request a Refund', 'Copyright or Trademark Infringement'],
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
  details:{
    type:String
  }, 
  status:{
  type:String,
    enum:['reviewed','unreviewed'],
    default: 'unreviewed'
  },
  admin_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Admin'
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',
    required: true
  },user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  },
{
  timestamps: true 


})


const Complaint = mongoose.model('Complaint', complaintSchema)

module.exports = Complaint