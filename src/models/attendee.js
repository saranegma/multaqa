const mongoose = require('mongoose');
const validator = require('validator'); // Ensure you have the validator package installed

const attendeeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fname: {
        type: String,
        required: false,
        trim: true
    },
    lname: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        validate(val) {
            if (val && !validator.isEmail(val)) {
                throw new Error('Email is INVALID');
            }
        }
    },
    password: {
        type: String,
        required: false,
        trim: true,
        minlength: 8,
        validate(value) {
            let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])");
            if (!password.test(value)) {
                throw new Error("Password must include uppercase, lowercase, numbers, special characters");
            }
        }
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: function(v) {
                return /\d{10,15}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    bankAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount',
        required: false
    },
    tokens: [{
        token: {
            type: String,
            required: false
        }
    }],
    profileImg: {
        type: String, // URL
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
    savedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      }],
      bookedTickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
      }]
   
});

const Attendee = mongoose.model('Attendee', attendeeSchema);

module.exports = Attendee;