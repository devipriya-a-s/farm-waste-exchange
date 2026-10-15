const express = require('express');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth('farmer'), async (req, res) => {
  try {
    const listing = await Listing.create({ ...req.body, farmer: req.user.id });
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { wasteType, location, minQty } = req.query;
    const filter = { status: 'available' };
    if (wasteType) filter.wasteType = new RegExp(wasteType, 'i');
    if (location) filter.location = new RegExp(location, 'i');
    if (minQty) filter.quantity = { $gte: Number(minQty) };

    const listings = await Listing.find(filter)
      .populate('farmer', 'name phone')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mine', auth('farmer'), async (req, res) => {
  const listings = await Listing.find({ farmer: req.user.id }).sort({ createdAt: -1 });
  res.json(listings);
});

router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('farmer', 'name phone');
    if (!listing) return res.status(404).json({ message: 'Not found' });
    res.json(listing);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
});

router.put('/:id', auth('farmer'), async (req, res) => {
  const listing = await Listing.findOne({ _id: req.params.id, farmer: req.user.id });
  if (!listing) return res.status(404).json({ message: 'Not found or not yours' });
  Object.assign(listing, req.body);
  await listing.save();
  res.json(listing);
});

router.delete('/:id', auth('farmer'), async (req, res) => {
  const listing = await Listing.findOneAndDelete({ _id: req.params.id, farmer: req.user.id });
  if (!listing) return res.status(404).json({ message: 'Not found or not yours' });
  res.json({ message: 'Deleted' });
});

module.exports = router;