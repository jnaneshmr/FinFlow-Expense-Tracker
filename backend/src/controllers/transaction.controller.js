// src/controllers/transaction.controller.js
const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require('../middleware/error.middleware');

const prisma = new PrismaClient();

const getAll = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, search, sort = 'date_desc', page = 1, limit = 50 } = req.query;
  const where = { userId: req.user.id };
  if (type) where.type = type;
  if (category) where.category = category;
  if (search) where.title = { contains: search, mode: 'insensitive' };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }
  const orderMap = {
    date_desc: { date: 'desc' }, date_asc: { date: 'asc' },
    amount_desc: { amount: 'desc' }, amount_asc: { amount: 'asc' }
  };
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where, orderBy: orderMap[sort] || { date: 'desc' },
      skip: (page - 1) * limit, take: parseInt(limit)
    }),
    prisma.transaction.count({ where })
  ]);
  res.json({ transactions, total, page: parseInt(page), pages: Math.ceil(total / limit) });
});

const getOne = asyncHandler(async (req, res) => {
  const tx = await prisma.transaction.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
  if (!tx) return res.status(404).json({ error: 'Transaction not found' });
  res.json({ transaction: tx });
});

const create = asyncHandler(async (req, res) => {
  const { title, amount, type, category, date, method, notes } = req.body;
  const tx = await prisma.transaction.create({
    data: { title, amount: parseFloat(amount), type, category, date: new Date(date), method, notes, userId: req.user.id }
  });
  res.status(201).json({ transaction: tx });
});

const update = asyncHandler(async (req, res) => {
  const existing = await prisma.transaction.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
  if (!existing) return res.status(404).json({ error: 'Transaction not found' });
  const { title, amount, type, category, date, method, notes } = req.body;
  const tx = await prisma.transaction.update({
    where: { id: parseInt(req.params.id) },
    data: { title, amount: parseFloat(amount), type, category, date: new Date(date), method, notes }
  });
  res.json({ transaction: tx });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await prisma.transaction.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
  if (!existing) return res.status(404).json({ error: 'Transaction not found' });
  await prisma.transaction.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: 'Transaction deleted' });
});

const getSummary = asyncHandler(async (req, res) => {
  const { month } = req.query;
  const where = { userId: req.user.id };
  if (month) {
    const [y, m] = month.split('-');
    where.date = { gte: new Date(y, m - 1, 1), lt: new Date(y, m, 1) };
  }
  const txs = await prisma.transaction.findMany({ where });
  const totalIncome = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const categoryBreakdown = {};
  txs.filter(t => t.type === 'expense').forEach(t => {
    categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
  });
  res.json({ totalIncome, totalExpenses, balance: totalIncome - totalExpenses, categoryBreakdown });
});

module.exports = { getAll, getOne, create, update, remove, getSummary };
