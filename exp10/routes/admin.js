const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Complaint = require('../models/Complaint');
const { isAdmin } = require('../middleware/auth');

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@complaint.com';
const ADMIN_PASSWORD = 'admin123';

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // Set admin session
    req.session.isAdmin = true;
    req.session.adminEmail = ADMIN_EMAIL;

    res.json({ success: true, message: 'Admin login successful' });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Admin logged out successfully' });
  });
});

// GET /api/admin/me — check admin session
router.get('/me', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.json({ success: true, admin: { email: req.session.adminEmail } });
  }
  res.status(401).json({ success: false, message: 'Not authenticated as admin' });
});

// GET /api/admin/complaints — get ALL complaints
router.get('/complaints', isAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'fullName email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    console.error('Admin fetch complaints error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch complaints' });
  }
});

// PATCH /api/admin/complaints/:id/status — update complaint status
router.patch('/complaints/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('user', 'fullName email phone');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, message: 'Status updated successfully', complaint });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

module.exports = router;
