// src/controllers/budget.controller.js
const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require('../middleware/error.middleware');

const prisma = new PrismaClient();

const getAll = asyncHandler(async (req, res) => {
  const { month } = req.query;
  const where = { userId: req.user.id };
  if (month) where.month = month;
  const budgets = await prisma.budget.findMany({ where, orderBy: { createdAt: 'desc' } });
  // Enrich with actual spending
  const enriched = await Promise.all(budgets.map(async (b) => {
    const [year, mon] = b.month.split('-');
    const spent = await prisma.transaction.aggregate({
      where: { userId: req.user.id, type: 'expense', category: b.category, date: { gte: new Date(year, mon - 1, 1), lt: new Date(year, mon, 1) } },
      _sum: { amount: true }
    });
    return { ...b, spent: spent._sum.amount || 0, percentage: Math.round(((spent._sum.amount || 0) / b.limit) * 100) };
  }));
  res.json({ budgets: enriched });
});

const create = asyncHandler(async (req, res) => {
  const { category, limit, month } = req.body;
  const budget = await prisma.budget.create({ data: { category, limit: parseFloat(limit), month, userId: req.user.id } });
  res.status(201).json({ budget });
});

const update = asyncHandler(async (req, res) => {
  const existing = await prisma.budget.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
  if (!existing) return res.status(404).json({ error: 'Budget not found' });
  const { category, limit, month } = req.body;
  const budget = await prisma.budget.update({ where: { id: parseInt(req.params.id) }, data: { category, limit: parseFloat(limit), month } });
  res.json({ budget });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await prisma.budget.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
  if (!existing) return res.status(404).json({ error: 'Budget not found' });
  await prisma.budget.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: 'Budget deleted' });
});

module.exports = { getAll, create, update, remove };
