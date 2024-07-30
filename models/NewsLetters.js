const mongoose = require('mongoose');

const NewsLetterSchema = new mongoose.Schema({
  email: { type: String, required: true },
  subscribedAt: { type: Date, default: Date.now }
});

const NewsLetter = mongoose.model('NewsLetters', NewsLetterSchema);
module.exports = NewsLetter;
