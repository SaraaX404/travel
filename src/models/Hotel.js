const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Admin user
});

module.exports = mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);
