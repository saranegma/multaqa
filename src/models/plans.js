const mongoose = require('mongoose');

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
    required: false,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    enum: [0, 6, 12]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['Basic', 'Standard', 'Premium'], 
  },
  subscriptions: {
    type: Number,
    default: 0
  }
});

planSchema.methods.getPlanCost = function() {
  return this.price;
};

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;