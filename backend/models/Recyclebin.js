const mongoose = require('mongoose');

const recycleBinSchema = new mongoose.Schema({
  blockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Block' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date, default: Date.now },
});

const RecycleBinItem = mongoose.model('recycleBinItems', recycleBinSchema);

module.exports = RecycleBinItem;
