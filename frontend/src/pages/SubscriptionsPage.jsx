// src/pages/SubscriptionsPage.jsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Edit2, Trash2, RefreshCw, Wallet, Calendar, CheckCircle, PauseCircle } from 'lucide-react';
import { Modal } from '../components/ui';
import { fmt, fmtDate, daysUntil, CAT_ICONS, exportToCSV } from '../utils/helpers';
import toast from 'react-hot-toast';

import { useSubscriptions, useSubscriptionMutations } from '../hooks/useData';

const CATS    = ['Streaming', 'Software', 'Music', 'Gaming', 'News', 'Cloud', 'Fitness', 'Education', 'Other'];
const METHODS = ['Credit Card', 'Debit Card', 'Bank Transfer', 'PayPal', 'Auto-Pay'];
const CYCLES  = ['weekly', 'monthly', 'yearly'];

const inputSt = { width: '100%', padding: '10px 12px', background: 'var(--color-surface2)', border: '1px solid var(--color-border2)', borderRadius: 10, fontSize: 14, color: 'var(--color-text)', outline: 'none', fontFamily: 'DM Sans, sans-serif' };
const labelSt = { fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' };
const fgSt    = { display: 'flex', flexDirection: 'column', gap: 6 };

const toMonthly = (s) => {
  if (s.cycle === 'yearly')  return s.amount / 12;
  if (s.cycle === 'weekly')  return s.amount * 4.33;
  return s.amount;
};

function SubForm({ sub, onSave, onClose }) {
  const blank = { name: '', category: 'Streaming', amount: '', cycle: 'monthly', startDate: new Date().toISOString().split('T')[0], nextRenewal: '', method: 'Credit Card', status: 'active', notes: '' };
  const [form, setForm] = useState(sub ? { 
    ...sub, 
    amount: String(sub.amount),
    startDate: sub.startDate ? sub.startDate.split('T')[0] : blank.startDate,
    nextRenewal: sub.nextRenewal ? sub.nextRenewal.split('T')[0] : ''
  } : blank);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.name.trim() || !form.amount) { toast.error('Name and amount required'); return; }
    onSave({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ ...fgSt, gridColumn: '1 / -1' }}>
        <label style={labelSt}>Service Name</label>
        <input value={form.name} onChange={set('name')} placeholder="e.g. Netflix, Spotify" style={inputSt} />
      </div>
      <div style={fgSt}>
        <label style={labelSt}>Category</label>
        <select value={form.category} onChange={set('category')} style={inputSt}>
          {CATS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={fgSt}>
        <label style={labelSt}>Amount ($)</label>
        <input type="number" value={form.amount} onChange={set('amount')} placeholder="0.00" min="0" step="0.01" style={inputSt} />
      </div>
      <div style={fgSt}>
        <label style={labelSt}>Billing Cycle</label>
        <select value={form.cycle} onChange={set('cycle')} style={inputSt}>
          {CYCLES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>
      <div style={fgSt}>
        <label style={labelSt}>Status</label>
        <select value={form.status} onChange={set('status')} style={inputSt}>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div style={fgSt}>
        <label style={labelSt}>Start Date</label>
        <input type="date" value={form.startDate} onChange={set('startDate')} style={inputSt} />
      </div>
      <div style={fgSt}>
        <label style={labelSt}>Next Renewal</label>
        <input type="date" value={form.nextRenewal} onChange={set('nextRenewal')} style={inputSt} />
      </div>
      <div style={{ ...fgSt, gridColumn: '1 / -1' }}>
        <label style={labelSt}>Payment Method</label>
        <select value={form.method} onChange={set('method')} style={inputSt}>
          {METHODS.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div style={{ ...fgSt, gridColumn: '1 / -1' }}>
        <label style={labelSt}>Notes</label>
        <textarea value={form.notes} onChange={set('notes')} placeholder="Plan details, account info..." rows={2} style={{ ...inputSt, resize: 'vertical' }} />
      </div>
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
        <button onClick={onClose} style={{ padding: '9px 18px', background: 'var(--color-surface2)', border: '1px solid var(--color-border2)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--color-text)', fontFamily: 'DM Sans, sans-serif' }}>Cancel</button>
        <button onClick={submit} style={{ padding: '9px 18px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
          {sub ? <Edit2 size={15} /> : <Plus size={15} />} {sub ? 'Update' : 'Add Subscription'}
        </button>
      </div>
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const map = { active: ['var(--color-green-bg)', 'var(--color-green)', 'Active'], paused: ['var(--color-amber-bg)', 'var(--color-amber)', 'Paused'], cancelled: ['var(--color-red-bg)', 'var(--color-red)', 'Cancelled'] };
  const [bg, color, label] = map[status] || ['var(--color-surface3)', 'var(--color-muted)', status];
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg, color }}>{label}</span>;
};

export default function SubscriptionsPage() {
  const { data: subs = [], isLoading } = useSubscriptions();
  const { create, update, remove } = useSubscriptionMutations();
  const [editSub, setEditSub] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState({ status: 'all', category: 'all', search: '' });

  const filtered = useMemo(() => subs.filter(s => {
    if (filter.status !== 'all' && s.status !== filter.status) return false;
    if (filter.category !== 'all' && s.category !== filter.category) return false;
    if (filter.search && !s.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  }), [subs, filter]);

  const activeSubs = subs.filter(s => s.status === 'active');
  const totalMonthly = activeSubs.reduce((sum, s) => sum + toMonthly(s), 0);

  const saveSub = (sub) => {
    if (sub.id) {
      update.mutate(sub);
    } else {
      create.mutate(sub);
    }
  };
  const deleteSub = (id) => {
    if (!confirm('Delete this subscription?')) return;
    remove.mutate(id);
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--color-muted)' }}>Loading subscriptions...</div>;
  }

  const filterInput = { padding: '8px 12px', background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 13, color: 'var(--color-text)', outline: 'none', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6, letterSpacing: '-0.02em' }}>Subscriptions</h1>
          <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Monthly total: <strong style={{ color: 'var(--color-accent2)' }}>{fmt(totalMonthly)}</strong> · {activeSubs.length} active services
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => exportToCSV(filtered.map(({ id, ...s }) => s), 'subscriptions.csv')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--color-muted)', fontFamily: 'DM Sans, sans-serif' }}>
            <Download size={15} /> Export
          </button>
          <button onClick={() => setShowAdd(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
            <Plus size={15} /> Add Subscription
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Monthly Cost',   value: fmt(totalMonthly),                 color: '#6c63ff', icon: Wallet },
          { label: 'Annual Cost',    value: fmt(totalMonthly * 12),             color: '#f5a623', icon: Calendar },
          { label: 'Active',         value: activeSubs.length,                  color: '#22d3a5', icon: CheckCircle },
          { label: 'Paused',         value: subs.filter(s=>s.status==='paused').length, color: '#f5a623', icon: PauseCircle },
        ].map(s => {
          const IconComponent = s.icon;
          return (
            <motion.div key={s.label} className="glass-panel" 
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{ borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, border: '1px solid var(--color-border)' }}>
                  <IconComponent size={24} strokeWidth={1.5} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-muted)', letterSpacing: '0.01em' }}>{s.label}</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>{s.value}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="🔍 Search subscriptions..." value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          style={{ ...filterInput, minWidth: 220, cursor: 'text' }} />
        <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} style={filterInput}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} style={filterInput}>
          <option value="all">All Categories</option>
          {CATS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ borderRadius: 24, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 12, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={24} color="var(--color-muted)" />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No subscriptions found</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Add your first subscription to start tracking</div>
            <button onClick={() => setShowAdd(true)} style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
              <Plus size={15} /> Add Subscription
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Service', 'Category', 'Status', 'Billing', 'Next Renewal', 'Monthly Cost', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-hint)', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const days = s.nextRenewal ? daysUntil(s.nextRenewal) : null;
                  const urgent = days !== null && days <= 7 && s.status === 'active';
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                            {CAT_ICONS[s.category] || '📦'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                            {s.notes && <div style={{ fontSize: 12, color: 'var(--color-hint)', marginTop: 2 }}>{s.notes}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{s.category}</td>
                      <td style={{ padding: '14px 16px' }}><StatusBadge status={s.status} /></td>
                      <td style={{ padding: '14px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>
                        <strong>{fmt(s.amount)}</strong>
                        <span style={{ color: 'var(--color-hint)' }}>/{s.cycle}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {s.nextRenewal ? (
                          <div>
                            <div style={{ fontSize: 13 }}>{fmtDate(s.nextRenewal)}</div>
                            {urgent && (
                              <span style={{ display: 'inline-block', marginTop: 3, padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: 'var(--color-red-bg)', color: 'var(--color-red)' }}>
                                {days <= 0 ? 'Due today!' : `${days}d left`}
                              </span>
                            )}
                          </div>
                        ) : <span style={{ color: 'var(--color-hint)' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
                        {fmt(toMonthly(s))}<span style={{ fontSize: 11, color: 'var(--color-hint)', fontWeight: 400 }}>/mo</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setEditSub(s)} style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--color-surface3)', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={13} /></button>
                          <button onClick={() => deleteSub(s.id)} style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--color-red-bg)', border: 'none', cursor: 'pointer', color: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {showAdd && <Modal title="Add Subscription" onClose={() => setShowAdd(false)}><SubForm onSave={saveSub} onClose={() => setShowAdd(false)} /></Modal>}
      {editSub && <Modal title="Edit Subscription" onClose={() => setEditSub(null)}><SubForm sub={editSub} onSave={saveSub} onClose={() => setEditSub(null)} /></Modal>}
    </div>
  );
}
