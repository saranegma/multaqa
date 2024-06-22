const mongoose = require('mongoose');
const validator = require('validator');

const organizerSchema = new mongoose.Schema({
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
    birthDayDate:{
        type:Date,
        required:false
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
    bio:{
        type: String,
        required:false
    },
    website_url: {
        type: String
    },
    companyType:{
        type:String,
        enum:['individual','corporate','non-profit'],
        required:false
    },
    accountNumber:{
        type:Number,
        required:false
    },
    revenue: {
        type: Number,
        default: 0
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    subscribtion:{
        type: Boolean,
        default: false
    },
    subscribe_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Plans'
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendee'
    }],
    chosenPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plans'
    },


}, { timestamps: true });

/*organizerSchema.virtual('owner', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true
});*/

//organizerSchema.set('toJSON', { virtuals: true });
//organizerSchema.set('toObject', { virtuals: true });

const Organizer = mongoose.model('Organizer', organizerSchema)
module.exports = Organizer;
