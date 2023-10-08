const mongoose = require('mongoose');

const securityQuestionSchema = new mongoose.Schema({
  question: String,
  answer: String,
},{ _id : false})

const blockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  blockName: String,
  name: String,
  email: String,
  username: String,
  password: String,
  picture: String,
  securityQuestions: [securityQuestionSchema],
});

const Block = mongoose.model('blocks', blockSchema);

module.exports = Block;
