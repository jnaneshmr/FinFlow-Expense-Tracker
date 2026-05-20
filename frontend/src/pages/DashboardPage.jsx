// src/pages/DashboardPage.jsx
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fmt, fmtDate, daysUntil, CAT_ICONS, CHART_COLORS } from '../utils/helpers';

import { useDashboard } from '../hooks/useData';

const tooltipStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border2)',
  borderRadius: 10,
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 13,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: dash, isLoading } = useDashboard();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--color-muted)' }}>Loading dashboard...</div>;
  }

  const {
    totalIncome = 0,
    totalExpenses = 0,
    balance = 0,
    monthlySubCost = 0,
    activeSubscriptions = 0,
    categoryBreakdown = {},
    monthlyChart = [],
    upcomingRenewals = [],
    recentTransactions: recent = []
  } = dash || {};

  const mappedMonthly = monthlyChart.map(m => ({ name: m.month, Income: m.income, Expenses: m.expenses }));
  const catTotals = Object.entries(categoryBreakdown)
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const metrics = [
    { label: 'Total Balance', value: fmt(balance), trend: '', trendUp: balance >= 0, icon: '💎', color: '#6c63ff' },
    { label: 'Total Income', value: fmt(totalIncome), trend: '', trendUp: true, icon: '📈', color: '#22d3a5' },
    { label: 'Total Expenses', value: fmt(totalExpenses), trend: '', trendUp: false, icon: '💳', color: '#ff5f7e' },
    { label: 'Monthly Subscriptions', value: fmt(monthlySubCost), trend: `${activeSubscriptions} active`, trendUp: true, icon: '🔄', color: '#f5a623' },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>Here's your financial overview for today</p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -2 }}
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${m.color}, transparent)` }} />
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 20 }}>{m.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 6, letterSpacing: '0.02em' }}>{m.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>{m.value}</div>
            {m.trend && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: m.trendUp ? 'var(--color-green-bg)' : 'var(--color-red-bg)', color: m.trendUp ? 'var(--color-green)' : 'var(--color-red)' }}>
                {m.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {m.trend}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Area chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Monthly Cash Flow</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>Income vs expenses over the last 6 months</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mappedMonthly}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff5f7e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ff5f7e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--color-hint)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-hint)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [fmt(v)]} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-muted)' }} />
              <Area type="monotone" dataKey="Income" stroke="#6c63ff" strokeWidth={2.5} fill="url(#incGrad)" dot={false} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="Expenses" stroke="#ff5f7e" strokeWidth={2.5} fill="url(#expGrad)" dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Expense Breakdown</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>By category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={catTotals} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={3} dataKey="value">
                {catTotals.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={v => [fmt(v)]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {catTotals.slice(0, 4).map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS[i], flexShrink: 0 }} />
                <span style={{ color: 'var(--color-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Recent transactions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700 }}>Recent Transactions</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Transaction', 'Category', 'Date', 'Amount'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-hint)', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-hint)', marginTop: 2 }}>{t.method}</div>
                    </td>
                    <td style={{ padding: '12px', fontSize: 13, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                      {CAT_ICONS[t.category]} {t.category}
                    </td>
                    <td style={{ padding: '12px', fontSize: 13, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{fmtDate(t.date)}</td>
                    <td style={{ padding: '12px', fontWeight: 700, fontSize: 15, color: t.type === 'income' ? 'var(--color-green)' : 'var(--color-red)', whiteSpace: 'nowrap' }}>
                      {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Upcoming renewals */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Upcoming Renewals</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>Next 30 days</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcomingRenewals.map(s => {
              const days = daysUntil(s.nextRenewal);
              const urgent = days <= 3;
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: 'var(--color-surface2)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: urgent ? 'var(--color-red-bg)' : 'var(--color-amber-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {CAT_ICONS[s.category] || '📦'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-hint)' }}>{fmt(s.amount)}/{s.cycle}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: urgent ? 'var(--color-red)' : 'var(--color-amber)' }}>
                      {days <= 0 ? 'Today!' : `${days}d`}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-hint)' }}>{fmtDate(s.nextRenewal)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
