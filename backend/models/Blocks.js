const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  blockName: String,
  name: String,
  email: String,
  username: String,
  password: String,
  picture: String,
  securityQuestions: [String],
});

const Block = mongoose.model('blocks', blockSchema);

module.exports = Block;
