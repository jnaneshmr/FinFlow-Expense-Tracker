// src/controllers/subscription.controller.js
const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require('../middleware/error.middleware');

const prisma = new PrismaClient();

const toMonthlyAmount = (s) => {
  if (s.cycle === 'yearly') return s.amount / 12;
  if (s.cycle === 'weekly') return s.amount * 4.33;
  return s.amount;
};

const getAll = asyncHandler(async (req, res) => {
  const { status, category, search } = req.query;
  const where = { userId: req.user.id };
  if (status) where.status = status;
  if (category) where.category = category;
  if (search) where.name = { contains: search, mode: 'insensitive' };
  const subscriptions = await prisma.subscription.findMany({ where, orderBy: { createdAt: 'desc' } });
  const totalMonthly = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + toMonthlyAmount(s), 0);
  res.json({ subscriptions, totalMonthly: parseFloat(totalMonthly.toFixed(2)) });
});

const getOne = asyncHandler(async (req, res) => {
  const sub = await prisma.subscription.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
  if (!sub) return res.status(404).json({ error: 'Subscription not found' });
  res.json({ subscription: sub });
});

const create = asyncHandler(async (req, res) => {
  const { name, category, amount, cycle, startDate, nextRenewal, method, status, notes } = req.body;
  const sub = await prisma.subscription.create({
    data: {
      name, category, amount: parseFloat(amount), cycle,
      startDate: new Date(startDate),
      nextRenewal: nextRenewal ? new Date(nextRenewal) : null,
      method, status: status || 'active', notes,
      userId: req.user.id
    }
  });
  res.status(201).json({ subscription: sub });
});

const update = asyncHandler(async (req, res) => {
  const existing = await prisma.subscription.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
  if (!existing) return res.status(404).json({ error: 'Subscription not found' });
  const { name, category, amount, cycle, startDate, nextRenewal, method, status, notes } = req.body;
  const sub = await prisma.subscription.update({
    where: { id: parseInt(req.params.id) },
    data: {
      name, category, amount: parseFloat(amount), cycle,
      startDate: new Date(startDate),
      nextRenewal: nextRenewal ? new Date(nextRenewal) : null,
      method, status, notes
    }
  });
  res.json({ subscription: sub });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await prisma.subscription.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
  if (!existing) return res.status(404).json({ error: 'Subscription not found' });
  await prisma.subscription.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: 'Subscription deleted' });
});

const getUpcoming = asyncHandler(async (req, res) => {
  const { days = 14 } = req.query;
  const until = new Date();
  until.setDate(until.getDate() + parseInt(days));
  const subs = await prisma.subscription.findMany({
    where: { userId: req.user.id, status: 'active', nextRenewal: { lte: until, gte: new Date() } },
    orderBy: { nextRenewal: 'asc' }
  });
  res.json({ subscriptions: subs });
});

module.exports = { getAll, getOne, create, update, remove, getUpcoming };
