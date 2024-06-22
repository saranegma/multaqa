const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deleteRequestSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  target_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  target_type: {
    type: String,
    enum: ['User', 'Event'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DeleteRequest = mongoose.model('DeleteRequest', deleteRequestSchema);

module.exports = DeleteRequest;