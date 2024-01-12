const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const securityQuestionSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

const blockSchema = new mongoose.Schema({
  postedBy: {
    type: ObjectId,
    ref: "users",
  },
  blockName: String,
  name: String,
  email: String,
  username: String,
  password: String,
  picture: String,
  securityQuestions: [securityQuestionSchema],
  iv: String,
});

const Block = mongoose.model("blocks", blockSchema);

module.exports = Block;
