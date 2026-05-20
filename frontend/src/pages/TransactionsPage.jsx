// src/pages/TransactionsPage.jsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Modal } from '../components/ui';
import { fmt, fmtDate, CAT_ICONS, exportToCSV } from '../utils/helpers';
import toast from 'react-hot-toast';

import { useTransactions, useTransactionMutations } from '../hooks/useData';

const CATS = Object.keys(CAT_ICONS);
const METHODS = ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'PayPal', 'Auto-Pay', 'Other'];

const inputSt = { width: '100%', padding: '10px 12px', background: 'var(--color-surface2)', border: '1px solid var(--color-border2)', borderRadius: 10, fontSize: 14, color: 'var(--color-text)', outline: 'none', fontFamily: 'DM Sans, sans-serif' };
const labelSt = { fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' };
const fgSt    = { display: 'flex', flexDirection: 'column', gap: 6 };

function TxForm({ tx, onSave, onClose }) {
  const blank = { title: '', amount: '', type: 'expense', category: 'Food & Dining', date: new Date().toISOString().split('T')[0], method: 'Credit Card', notes: '' };
  const [form, setForm] = useState(tx ? { ...tx, amount: String(tx.amount), date: tx.date?.split('T')[0] || blank.date } : blank);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.title.trim() || !form.amount) { toast.error('Title and amount are required'); return; }
    onSave({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ ...fgSt, gridColumn: '1 / -1' }}>
        <label style={labelSt}>Title</label>
        <input value={form.title} onChange={set('title')} placeholder="Transaction title" style={inputSt} />
      </div>
      <div style={fgSt}>
        <label style={labelSt}>Amount ($)</label>
        <input type="number" value={form.amount} onChange={set('amount')} placeholder="0.00" min="0" step="0.01" style={inputSt} />
      </div>
      <div style={fgSt}>
        <label style={labelSt}>Type</label>
        <select value={form.type} onChange={set('type')} style={inputSt}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div style={fgSt}>
        <label style={labelSt}>Category</label>
        <select value={form.category} onChange={set('category')} style={inputSt}>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={fgSt}>
        <label style={labelSt}>Date</label>
        <input type="date" value={form.date} onChange={set('date')} style={inputSt} />
      </div>
      <div style={{ ...fgSt, gridColumn: '1 / -1' }}>
        <label style={labelSt}>Payment Method</label>
        <select value={form.method} onChange={set('method')} style={inputSt}>
          {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div style={{ ...fgSt, gridColumn: '1 / -1' }}>
        <label style={labelSt}>Notes (optional)</label>
        <textarea value={form.notes} onChange={set('notes')} placeholder="Add a note..." rows={3}
          style={{ ...inputSt, resize: 'vertical' }} />
      </div>
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
        <button onClick={onClose} style={{ padding: '9px 18px', background: 'var(--color-surface2)', border: '1px solid var(--color-border2)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--color-text)', fontFamily: 'DM Sans, sans-serif' }}>Cancel</button>
        <button onClick={submit} style={{ padding: '9px 18px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
          {tx ? <Edit2 size={15} /> : <Plus size={15} />} {tx ? 'Update' : 'Add Transaction'}
        </button>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const { data: txs = [], isLoading } = useTransactions();
  const { create, update, remove } = useTransactionMutations();
  const [editTx, setEditTx] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState({ type: 'all', category: 'all', sort: 'date_desc', search: '' });

  const cats = useMemo(() => [...new Set(txs.map(t => t.category))].sort(), [txs]);

  const filtered = useMemo(() => {
    return txs
      .filter(t => {
        if (filter.type !== 'all' && t.type !== filter.type) return false;
        if (filter.category !== 'all' && t.category !== filter.category) return false;
        if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (filter.sort === 'date_desc') return new Date(b.date) - new Date(a.date);
        if (filter.sort === 'date_asc')  return new Date(a.date) - new Date(b.date);
        if (filter.sort === 'amount_desc') return b.amount - a.amount;
        if (filter.sort === 'amount_asc')  return a.amount - b.amount;
        return 0;
      });
  }, [txs, filter]);

  const totIncome   = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const saveTx = (tx) => {
    if (tx.id) {
      update.mutate(tx);
    } else {
      create.mutate(tx);
    }
  };

  const deleteTx = (id) => {
    if (!confirm('Delete this transaction?')) return;
    remove.mutate(id);
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--color-muted)' }}>Loading transactions...</div>;
  }

  const handleExport = () => exportToCSV(
    filtered.map(({ id, ...t }) => t),
    'finflow-transactions.csv'
  );

  const filterInput = { padding: '8px 12px', background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 13, color: 'var(--color-text)', outline: 'none', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>Transactions</h1>
          <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>{filtered.length} transactions · Net: <strong style={{ color: (totIncome - totExpenses) >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>{fmt(totIncome - totExpenses)}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleExport} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--color-muted)', fontFamily: 'DM Sans, sans-serif' }}>
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => setShowAdd(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
            <Plus size={15} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Income',   value: fmt(totIncome),   color: 'var(--color-green)', bg: 'var(--color-green-bg)', Icon: TrendingUp },
          { label: 'Total Expenses', value: fmt(totExpenses), color: 'var(--color-red)',   bg: 'var(--color-red-bg)',   Icon: TrendingDown },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.Icon size={16} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-hint)', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.color, fontFamily: 'Syne, sans-serif' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="🔍 Search transactions..." value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          style={{ ...filterInput, minWidth: 220, cursor: 'text' }} />
        <select value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))} style={filterInput}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} style={filterInput}>
          <option value="all">All Categories</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filter.sort} onChange={e => setFilter(f => ({ ...f, sort: e.target.value }))} style={filterInput}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Highest Amount</option>
          <option value="amount_asc">Lowest Amount</option>
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 12, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💳</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No transactions found</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Try adjusting your filters or add a new transaction</div>
            <button onClick={() => setShowAdd(true)} style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
              <Plus size={15} /> Add Transaction
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Transaction', 'Type', 'Category', 'Date', 'Method', 'Amount', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-hint)', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                      {t.notes && <div style={{ fontSize: 12, color: 'var(--color-hint)', marginTop: 2 }}>{t.notes}</div>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: t.type === 'income' ? 'var(--color-green-bg)' : 'var(--color-red-bg)', color: t.type === 'income' ? 'var(--color-green)' : 'var(--color-red)' }}>
                        {t.type === 'income' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{CAT_ICONS[t.category]} {t.category}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{fmtDate(t.date)}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--color-hint)', whiteSpace: 'nowrap' }}>{t.method}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 15, color: t.type === 'income' ? 'var(--color-green)' : 'var(--color-red)', whiteSpace: 'nowrap' }}>
                      {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setEditTx(t)} title="Edit" style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--color-surface3)', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={13} /></button>
                        <button onClick={() => deleteTx(t.id)} title="Delete" style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--color-red-bg)', border: 'none', cursor: 'pointer', color: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {showAdd && (
        <Modal title="Add Transaction" onClose={() => setShowAdd(false)}>
          <TxForm onSave={saveTx} onClose={() => setShowAdd(false)} />
        </Modal>
      )}
      {editTx && (
        <Modal title="Edit Transaction" onClose={() => setEditTx(null)}>
          <TxForm tx={editTx} onSave={saveTx} onClose={() => setEditTx(null)} />
        </Modal>
      )}
    </div>
  );
}
