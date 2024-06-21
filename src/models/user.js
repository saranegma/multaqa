const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require ('validator')
const auth = require('../middelware/auth')
const jwt = require('jsonwebtoken')

const userSchema = new Schema ({
  fname: {
    type: String,
    required: true,
    trim : true
  },
  lname: {
      type: String,
      required: true,
      trim : true
  },
  type: {
    type: String,
    enum: ['Organizer', 'Attendee', 'organizer', 'attendee'], 
    required: false
  },
  email: {
      type: String,
      required: true,
      trim: true,
      lowercase : true,
      unique: true,
      validate(val){
          if(!validator.isEmail(val)){
              throw new Error ('Email is INVALID')
          }
      }
  },
  password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value){
          let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
          if(!password.test(value)){
              throw new Error("Password must include uppercase , lowercase , numbers , speacial characters")
          }
      }
  },
  phone:{
        type: String,
        required: true,
        trim: true,
        validate: {
        validator: function(v) {
        return /\d{10,15}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`}
    },
    bankAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount',
        required: false
   },
   tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    profileImg: {
        type: String, //URL
        required: false
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        enum: ['Cairo', 'Giza'],
        required: false
    },
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: false
    }],
    admin_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Admin'
    }
})

/////////////////generate token///////////////////

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'arwa500');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.toJSON = function (){
    const user = this 

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject 
}

module.exports = mongoose.model('Users', userSchema);