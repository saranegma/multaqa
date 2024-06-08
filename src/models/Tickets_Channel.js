
const mongoose = require('mongoose')

const Tickets_ChannelSchema = new mongoose.Schema({
    sales_channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true
  },
  ticket_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  }
})

const Tickets_Channel = mongoose.model('Tickets_Channel', Tickets_ChannelSchema)

module.exports = Tickets_Channel