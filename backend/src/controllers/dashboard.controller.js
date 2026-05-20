// src/controllers/dashboard.controller.js
const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require('../middleware/error.middleware');

const prisma = new PrismaClient();

const toMonthly = (s) => {
  if (s.cycle === 'yearly') return s.amount / 12;
  if (s.cycle === 'weekly') return s.amount * 4.33;
  return s.amount;
};

const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [transactions, subscriptions] = await Promise.all([
    prisma.transaction.findMany({ where: { userId } }),
    prisma.subscription.findMany({ where: { userId } }),
  ]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const monthlySubCost = activeSubs.reduce((sum, s) => sum + toMonthly(s), 0);

  // Category breakdown
  const categoryBreakdown = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
  });

  // Monthly chart data — last 6 months
  const monthlyChart = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthTxs = transactions.filter(t => {
      const td = new Date(t.date);
      return td.getFullYear() === year && td.getMonth() === month;
    });
    monthlyChart.push({
      month: d.toLocaleString('en-US', { month: 'short' }),
      income: monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expenses: monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    });
  }

  // Upcoming renewals (next 14 days)
  const now = new Date();
  const in14 = new Date(); in14.setDate(in14.getDate() + 14);
  const upcomingRenewals = activeSubs
    .filter(s => s.nextRenewal && s.nextRenewal >= now && s.nextRenewal <= in14)
    .sort((a, b) => a.nextRenewal - b.nextRenewal);

  // Recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  res.json({
    totalIncome, totalExpenses, balance: totalIncome - totalExpenses,
    monthlySubCost: parseFloat(monthlySubCost.toFixed(2)),
    activeSubscriptions: activeSubs.length,
    totalSubscriptions: subscriptions.length,
    categoryBreakdown, monthlyChart, upcomingRenewals, recentTransactions,
  });
});

module.exports = { getSummary };
