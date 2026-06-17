// src/pages/AnalyticsPage.jsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { fmt, CHART_COLORS, CAT_ICONS } from '../utils/helpers';

import { useDashboard, useSubscriptions } from '../hooks/useData';

const toMo = (s) => s.cycle === 'yearly' ? s.amount / 12 : s.cycle === 'weekly' ? s.amount * 4.33 : s.amount;

const tooltipSt = { background: 'var(--color-surface)', border: '1px solid var(--color-border2)', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 13 };

const TABS = ['Spending Trends', 'Category Analysis', 'Subscription Costs'];

function TabButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ flex: 1, padding: '8px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s', background: active ? 'var(--color-surface)' : 'transparent', color: active ? 'var(--color-text)' : 'var(--color-muted)', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.2)' : 'none' }}>
      {label}
    </button>
  );
}

export default function AnalyticsPage() {
  const [tab, setTab] = useState(0);

  const { data: dash, isLoading: dashLoading } = useDashboard();
  const { data: subs = [], isLoading: subsLoading } = useSubscriptions();

  const { monthlyChart = [], categoryBreakdown = {} } = dash || {};

  const MONTHLY = useMemo(() => 
    monthlyChart.map(m => ({ name: m.month, Income: m.income, Expenses: m.expenses, Savings: m.income - m.expenses })).reverse()
  , [monthlyChart]);

  const CAT_DATA = useMemo(() => 
    Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value)
  , [categoryBreakdown]);

  const subByCat = useMemo(() => {
    const map = {};
    subs.forEach(s => { map[s.category] = (map[s.category] || 0) + toMo(s); });
    return Object.entries(map).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [subs]);

  if (dashLoading || subsLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--color-muted)' }}>Loading analytics...</div>;
  }

  const avgIncome   = MONTHLY.length ? Math.round(MONTHLY.reduce((s, d) => s + d.Income, 0)   / MONTHLY.length) : 0;
  const avgExpenses = MONTHLY.length ? Math.round(MONTHLY.reduce((s, d) => s + d.Expenses, 0) / MONTHLY.length) : 0;
  const bestSavings = MONTHLY.length ? [...MONTHLY].sort((a, b) => b.Savings - a.Savings)[0] : { name: '-', Savings: 0 };
  
  const totalInc = MONTHLY.reduce((s, d) => s + d.Income, 0);
  const totalSav = MONTHLY.reduce((s, d) => s + d.Savings, 0);
  const savingsRate = totalInc > 0 ? Math.round((totalSav / totalInc) * 100) : 0;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>Deep dive into your financial patterns and trends</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Avg Monthly Income',   value: fmt(avgIncome),   color: '#22d3a5', icon: '📈' },
          { label: 'Avg Monthly Expenses', value: fmt(avgExpenses),  color: '#ff5f7e', icon: '📉' },
          { label: 'Best Savings Month',   value: bestSavings.name,  color: '#6c63ff', icon: '🏆' },
          { label: 'Avg Savings Rate',     value: `${savingsRate}%`, color: '#22d3a5', icon: '💹' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-panel" style={{ borderRadius: 16, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 11, color: 'var(--color-hint)', fontWeight: 600, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: k.color }}>{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface2)', padding: 4, borderRadius: 12, marginBottom: 24, maxWidth: 480 }}>
        {TABS.map((t, i) => <TabButton key={t} label={t} active={tab === i} onClick={() => setTab(i)} />)}
      </div>

      {/* Tab: Spending Trends */}
      {tab === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel" style={{ gridColumn: '1 / -1', borderRadius: 24, padding: 24 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Monthly Cash Flow</h2>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>Income vs expenses over 7 months</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MONTHLY} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-hint)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-hint)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipSt} formatter={v => [fmt(v)]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Income"   fill="#6c63ff" radius={[6,6,0,0]} maxBarSize={40} />
                <Bar dataKey="Expenses" fill="#ff5f7e" radius={[6,6,0,0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel" style={{ borderRadius: 24, padding: 24 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Monthly Savings</h2>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>How much saved each month</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY}>
                <defs>
                  <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3a5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3a5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-hint)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-hint)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
                <Tooltip contentStyle={tooltipSt} formatter={v => [fmt(v)]} />
                <Area type="monotone" dataKey="Savings" stroke="#22d3a5" strokeWidth={2.5} fill="url(#savGrad)" dot={{ fill: '#22d3a5', strokeWidth: 0, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-panel" style={{ borderRadius: 24, padding: 24 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Income Trend</h2>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>Monthly income growth</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-hint)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-hint)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
                <Tooltip contentStyle={tooltipSt} formatter={v => [fmt(v)]} />
                <Line type="monotone" dataKey="Income" stroke="#6c63ff" strokeWidth={2.5} dot={{ fill: '#6c63ff', strokeWidth: 0, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Tab: Category Analysis */}
      {tab === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel" style={{ borderRadius: 24, padding: 24 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Expenses by Category</h2>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>All-time totals</p>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={CAT_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--color-hint)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--color-muted)', fontSize: 12 }} axisLine={false} tickLine={false} width={115} />
                <Tooltip contentStyle={tooltipSt} formatter={v => [fmt(v)]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {CAT_DATA.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel" style={{ borderRadius: 24, padding: 24 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Distribution</h2>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>Share of total spending</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={CAT_DATA} cx="50%" cy="50%" outerRadius={90} dataKey="value" paddingAngle={2}>
                  {CAT_DATA.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipSt} formatter={v => [fmt(v)]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {CAT_DATA.slice(0, 5).map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS[i], flexShrink: 0 }} />
                  <span style={{ color: 'var(--color-muted)', flex: 1 }}>{d.name}</span>
                  <span style={{ fontWeight: 600 }}>{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Tab: Subscriptions */}
      {tab === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel" style={{ borderRadius: 24, padding: 24 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Cost by Category</h2>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>Monthly subscription spend</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={subByCat} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {subByCat.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipSt} formatter={v => [`$${v.toFixed(2)}/mo`]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel" style={{ borderRadius: 24, padding: 24 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Top Subscriptions</h2>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>Ranked by monthly cost</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...subs].sort((a, b) => toMo(b) - toMo(a)).map((s, i) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-hint)', width: 20, textAlign: 'center' }}>#{i + 1}</div>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                    {CAT_ICONS[s.category] || '📦'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-hint)' }}>{s.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-accent2)' }}>{fmt(toMo(s))}/mo</div>
                    {s.cycle === 'yearly' && <div style={{ fontSize: 10, color: 'var(--color-hint)' }}>{fmt(s.amount)}/yr</div>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
