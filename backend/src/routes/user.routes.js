// src/routes/user.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const router = express.Router();
router.use(protect);

// GET /api/users/profile
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, currency: true, avatar: true, createdAt: true }
  });
  res.json({ user });
}));

// PUT /api/users/profile
router.put('/profile', asyncHandler(async (req, res) => {
  const { name, email, currency } = req.body;
  if (email && email !== req.user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
  }
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, email, currency },
    select: { id: true, name: true, email: true, currency: true, createdAt: true }
  });
  res.json({ user });
}));

// PUT /api/users/password
router.put('/password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both fields required' });
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(401).json({ error: 'Current password incorrect' });
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
  res.json({ message: 'Password updated successfully' });
}));

// GET /api/users/notifications
router.get('/notifications', asyncHandler(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  res.json({ notifications });
}));

// PUT /api/users/notifications/:id/read
router.put('/notifications/:id/read', asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: { id: parseInt(req.params.id), userId: req.user.id },
    data: { isRead: true }
  });
  res.json({ message: 'Marked as read' });
}));

module.exports = router;
