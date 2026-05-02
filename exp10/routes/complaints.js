const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { isAuthenticated } = require('../middleware/auth');

// GET /api/complaints — get all complaints for logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.session.userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    console.error('Fetch complaints error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch complaints' });
  }
});

// POST /api/complaints — raise a new complaint
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { category, subject, description } = req.body;

    const complaint = new Complaint({
      user: req.session.userId,
      category,
      subject,
      description
    });

    await complaint.save();
    res.status(201).json({ success: true, message: 'Complaint registered successfully', complaint });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('Create complaint error:', err);
    res.status(500).json({ success: false, message: 'Failed to register complaint' });
  }
});

// GET /api/complaints/:id — get single complaint
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.session.userId
    });
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, complaint });
  } catch (err) {
    console.error('Fetch complaint error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch complaint' });
  }
});

module.exports = router;
