const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);