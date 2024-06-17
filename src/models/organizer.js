const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    website_url: {
      type: String
    },
revenue: {
  type: Number,
  default: 0
}
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

module.exports = Organizer