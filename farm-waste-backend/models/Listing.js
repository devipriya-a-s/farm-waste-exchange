const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    wasteType: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, default: 0 },
    location: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    description: String,
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);