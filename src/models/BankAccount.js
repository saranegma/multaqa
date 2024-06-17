const mongoose = require('mongoose');
const validator = require('validator');

const BankAccountSchema = new mongoose.Schema({
  cardNumber: {
    type: Number,
    required: true,
    validate(value) {
      if (!/^\d{16}$/.test(value)) {
        throw new Error('Card number must be 16 digits');
      }
    }
  },
  expireDate: {
    type: String,
    required: true,
    validate(value) {
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
        throw new Error('Expiration date must be in MM/YY format');
      }
    }
  },
  cardHolderName: {
    type: String,
    required: true,
    trim: true
  },
  cvv: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!/^\d{3,4}$/.test(value)) {
        throw new Error('CVV must be 3 or 4 digits');
      }
    }
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  }
  ,
  transactions: [
    {
      transactionType: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
  });
  
  // Method to deduct amount from bank account and record transaction
  BankAccountSchema.methods.deductAmountAndRecordTransaction = async function(amountToDeduct) {
    try {
      if (this.amount < amountToDeduct) {
        throw new Error('Insufficient balance');
      }
  
      this.amount -= amountToDeduct;
  
      this.transactions.push({
        transactionType: 'ticket_booking',
        amount: -amountToDeduct
      });
  
      await this.save();
    } catch (error) {
      throw error;
    }
  };
  


const BankAccount = mongoose.model('BankAccount', BankAccountSchema);

module.exports = BankAccount;
