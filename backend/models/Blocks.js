const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  blockName: String,
  username: String,
  email: String,
  password: String,
  picture: String,
  securityQuestions: [String], // If storing security questions
});

const Block = mongoose.model('Block', blockSchema);

module.exports = Block;
