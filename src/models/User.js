const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
