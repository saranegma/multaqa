const mongoose = require('mongoose');

const user_phoneSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const user_phone = mongoose.model('user_phone', user_phoneSchema)

module.exports = user_phone
