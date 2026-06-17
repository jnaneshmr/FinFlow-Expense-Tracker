// src/pages/BudgetsPage.jsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Modal } from '../components/ui';
import { fmt, CAT_ICONS } from '../utils/helpers';
import toast from 'react-hot-toast';

import { useBudgets, useBudgetMutations, useTransactions } from '../hooks/useData';

const CATS = Object.keys(CAT_ICONS).filter(c => !['Salary','Freelance','Investment'].includes(c));
const inputSt = { width: '100%', padding: '10px 12px', background: 'var(--color-surface2)', border: '1px solid var(--color-border2)', borderRadius: 10, fontSize: 14, color: 'var(--color-text)', outline: 'none', fontFamily: 'DM Sans, sans-serif' };
const labelSt = { fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' };

function BudgetForm({ budget, onSave, onClose }) {
  const blank = { category: 'Food & Dining', limit: '', month: new Date().toISOString().slice(0, 7) };
  const [form, setForm] = useState(budget ? { ...budget, limit: String(budget.limit) } : blank);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.limit) { toast.error('Budget limit is required'); return; }
    onSave({ ...form, limit: parseFloat(form.limit) });
    onClose();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={labelSt}>Category</label>
        <select value={form.category} onChange={set('category')} style={inputSt}>
          {CATS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={labelSt}>Monthly Limit ($)</label>
        <input type="number" value={form.limit} onChange={set('limit')} placeholder="0.00" min="0" style={inputSt} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / -1' }}>
        <label style={labelSt}>Month</label>
        <input type="month" value={form.month} onChange={set('month')} style={inputSt} />
      </div>
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
        <button onClick={onClose} style={{ padding: '9px 18px', background: 'var(--color-surface2)', border: '1px solid var(--color-border2)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--color-text)', fontFamily: 'DM Sans, sans-serif' }}>Cancel</button>
        <button onClick={submit} style={{ padding: '9px 18px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
          {budget ? 'Update Budget' : 'Create Budget'}
        </button>
      </div>
    </div>
  );
}

export default function BudgetsPage() {
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const { data: txs = [], isLoading: txsLoading } = useTransactions();
  const { create, update, remove } = useBudgetMutations();
  const [editB, setEditB] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const getSpent = (category, month) =>
    txs.filter(t => t.type === 'expense' && t.category === category && t.date.startsWith(month))
      .reduce((s, t) => s + t.amount, 0);

  const enriched = useMemo(() => budgets.map(b => {
    const spent = getSpent(b.category, b.month);
    const pct   = Math.min(100, Math.round((spent / b.limit) * 100));
    const over  = spent > b.limit;
    return { ...b, spent, pct, over, remaining: b.limit - spent };
  }), [budgets]);

  const saveBudget = (b) => {
    if (b.id) {
      update.mutate(b);
    } else {
      create.mutate(b);
    }
  };
  const deleteBudget = (id) => {
    if (!confirm('Delete this budget?')) return;
    remove.mutate(id);
  };

  if (budgetsLoading || txsLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--color-muted)' }}>Loading budgets...</div>;
  }

  const totalBudgeted = enriched.reduce((s, b) => s + b.limit, 0);
  const totalSpent    = enriched.reduce((s, b) => s + b.spent, 0);
  const overCount     = enriched.filter(b => b.over).length;

  const pctColor = (pct) => pct > 90 ? 'var(--color-red)' : pct > 70 ? 'var(--color-amber)' : 'var(--color-accent)';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>Budgets</h1>
          <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>Track spending against your monthly targets</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
          <Plus size={15} /> New Budget
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Budgeted', value: fmt(totalBudgeted), color: '#6c63ff', icon: '🎯' },
          { label: 'Total Spent',    value: fmt(totalSpent),    color: totalSpent > totalBudgeted ? 'var(--color-red)' : 'var(--color-green)', icon: '💳' },
          { label: 'Remaining',      value: fmt(totalBudgeted - totalSpent), color: 'var(--color-green)', icon: '💚' },
          { label: 'Over Budget',    value: `${overCount} categories`, color: overCount > 0 ? 'var(--color-red)' : 'var(--color-green)', icon: overCount > 0 ? '⚠️' : '✅' },
        ].map(s => (
          <div key={s.label} className="glass-panel" style={{ borderRadius: 16, padding: '16px 20px' }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: 'var(--color-hint)', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {overCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'var(--color-red-bg)', border: '1px solid rgba(255,95,126,0.2)', color: 'var(--color-red)', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
          <AlertTriangle size={18} />
          You've exceeded {overCount} budget{overCount > 1 ? 's' : ''} this month. Consider reviewing your spending.
        </div>
      )}

      {/* Budget cards */}
      {enriched.length === 0 ? (
        <div className="glass-panel" style={{ borderRadius: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 40 }}>🎯</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No budgets yet</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Create budget limits by category to track your spending habits</div>
            <button onClick={() => setShowAdd(true)} style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
              <Plus size={15} /> Create First Budget
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {enriched.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-panel"
              style={{ borderRadius: 24, padding: 24 }}>
              {b.over && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'var(--color-red-bg)', border: '1px solid rgba(255,95,126,0.2)', marginBottom: 14, fontSize: 12, color: 'var(--color-red)', fontWeight: 600 }}>
                  <AlertTriangle size={13} />
                  Over budget by {fmt(b.spent - b.limit)}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {CAT_ICONS[b.category] || '📦'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{b.category}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-hint)', marginTop: 2 }}>{b.month}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditB(b)} style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-surface3)', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={12} /></button>
                  <button onClick={() => deleteBudget(b.id)} style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-red-bg)', border: 'none', cursor: 'pointer', color: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={12} /></button>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 8, background: 'var(--color-surface3)', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                  style={{ height: '100%', borderRadius: 10, background: pctColor(b.pct) }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                  Spent: <strong style={{ color: b.over ? 'var(--color-red)' : 'var(--color-text)' }}>{fmt(b.spent)}</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                  Limit: <strong>{fmt(b.limit)}</strong>
                </div>
                <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: b.over ? 'var(--color-red-bg)' : b.pct > 70 ? 'var(--color-amber-bg)' : 'var(--color-green-bg)', color: b.over ? 'var(--color-red)' : b.pct > 70 ? 'var(--color-amber)' : 'var(--color-green)' }}>
                  {b.pct}%
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-hint)', marginTop: 8 }}>
                {b.remaining >= 0 ? `${fmt(b.remaining)} remaining` : `${fmt(Math.abs(b.remaining))} over limit`}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showAdd && <Modal title="Create Budget" onClose={() => setShowAdd(false)}><BudgetForm onSave={saveBudget} onClose={() => setShowAdd(false)} /></Modal>}
      {editB && <Modal title="Edit Budget" onClose={() => setEditB(null)}><BudgetForm budget={editB} onSave={saveBudget} onClose={() => setEditB(null)} /></Modal>}
    </div>
  );
}
