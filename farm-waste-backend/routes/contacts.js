const express = require('express');
const Contact = require('../models/Contact');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth('buyer'), async (req, res) => {
  try {
    const { listingId, message, phone } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const contact = await Contact.create({
      listing: listingId,
      buyer: req.user.id,
      farmer: listing.farmer,
      message,
      phone,
    });
    res.status(201).json({ message: 'Request sent to farmer', contact });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/received', auth('farmer'), async (req, res) => {
  const contacts = await Contact.find({ farmer: req.user.id })
    .populate('buyer', 'name email phone')
    .populate('listing', 'wasteType quantity location')
    .sort({ createdAt: -1 });
  res.json(contacts);
});

router.get('/sent', auth('buyer'), async (req, res) => {
  const contacts = await Contact.find({ buyer: req.user.id })
    .populate('listing', 'wasteType quantity location')
    .sort({ createdAt: -1 });
  res.json(contacts);
});

module.exports = router;