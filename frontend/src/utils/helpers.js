// src/utils/helpers.js

/** Format a number as USD currency */
export const fmt = (n = 0) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

/** Format a date string to "Jan 12, 2024" */
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** Format a date string to "Jan 2024" */
export const fmtMonth = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

/** Days from today until a future date */
export const daysUntil = (dateStr) =>
  Math.ceil((new Date(dateStr) - new Date()) / 86_400_000);

/** Convert any subscription to its monthly cost */
export const toMonthly = (sub) => {
  if (sub.cycle === 'yearly') return sub.amount / 12;
  if (sub.cycle === 'weekly') return sub.amount * 4.33;
  return sub.amount;
};

/** Get initials from a name */
export const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

/** Category emoji map */
export const CAT_ICONS = {
  'Food & Dining': '🍽️',
  Housing: '🏠',
  Transportation: '🚗',
  Entertainment: '🎬',
  Health: '💊',
  Shopping: '🛍️',
  Utilities: '💡',
  Salary: '💼',
  Freelance: '💻',
  Investment: '📈',
  Other: '📦',
  Streaming: '📺',
  Software: '🔧',
  Fitness: '💪',
  News: '📰',
  Gaming: '🎮',
  Cloud: '☁️',
  Music: '🎵',
  Education: '📚',
};

/** Chart color palette */
export const CHART_COLORS = [
  '#6c63ff', '#22d3a5', '#ff5f7e', '#f5a623',
  '#b57bee', '#38b6ff', '#4ade80', '#fb923c',
];

/** Export an array of objects to CSV and trigger download */
export const exportToCSV = (rows, filename = 'export.csv') => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

/** Clamp a value between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Group an array by a key */
export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => { (acc[item[key]] = acc[item[key]] || []).push(item); return acc; }, {});
