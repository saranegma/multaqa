
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const adminSchema = new Schema({
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('Email is INVALID');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
      if (!password.test(value)) {
        throw new Error("Password must include uppercase, lowercase, numbers, and special characters");
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  fullName: {
    type: String,
    required: true
  },
  nationalityId: {
    type: Number,
    required: true,
    minlength: 14,
    maxlength: 14
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  startWorkDate: {
    type: Date,
    required: true
  },
  salary: {
    type: Number,
    required: false
  },
  bankaccNumber:{
    type:Number
  },
  subscribtionRevenue:{ type: Number,  default: 0 }
});

adminSchema.methods.generateAuthToken = async function() {
  const admin = this;
  const token = jwt.sign({ _id: admin._id.toString() }, 'arwa500');
  admin.tokens = admin.tokens.concat({ token });
  await admin.save();
  return token;
};

adminSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
