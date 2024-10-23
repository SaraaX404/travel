const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, maxlength: 500 },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
  destination: { type: Schema.Types.ObjectId, ref: 'Destination' },
  hotel: { type: Schema.Types.ObjectId, ref: 'Hotel' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
