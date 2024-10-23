const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: false }, // Image URL
  hotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Admin user
});

module.exports = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
