// src/components/ui/index.jsx
// All core reusable UI components in one file for clean imports

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// ── Card ─────────────────────────────────────────────────────
export function Card({ children, className = '', style = {}, hover = false }) {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        padding: 20,
        transition: 'border-color 0.2s',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── MetricCard ───────────────────────────────────────────────
export function MetricCard({ label, value, trend, trendUp, trendLabel, icon, accentColor }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accentColor}, transparent)`, opacity: 0.8 }} />
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 20 }}>
        {icon}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 6, letterSpacing: '0.02em' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>{value}</div>
      {trend && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
          background: trendUp ? 'var(--color-green-bg)' : 'var(--color-red-bg)',
          color: trendUp ? 'var(--color-green)' : 'var(--color-red)',
        }}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      )}
      {trendLabel && <div style={{ fontSize: 12, color: 'var(--color-hint)', marginTop: 4 }}>{trendLabel}</div>}
    </motion.div>
  );
}

// ── Button ───────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', style = {}, className = '' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', outline: 'none', transition: 'all 0.15s',
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 13, borderRadius: 8 },
    md: { padding: '9px 18px', fontSize: 14, borderRadius: 10 },
    lg: { padding: '12px 28px', fontSize: 16, borderRadius: 12 },
    icon: { padding: 8, borderRadius: 8, fontSize: 14 },
  };
  const variants = {
    primary:   { background: 'var(--color-accent)', color: 'white' },
    secondary: { background: 'var(--color-surface2)', color: 'var(--color-text)', border: '1px solid var(--color-border2)' },
    ghost:     { background: 'transparent', color: 'var(--color-muted)', border: '1px solid var(--color-border)' },
    danger:    { background: 'var(--color-red-bg)', color: 'var(--color-red)', border: '1px solid rgba(255,95,126,0.2)' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

// ── Badge ────────────────────────────────────────────────────
export function Badge({ status, children }) {
  const map = {
    active:    { bg: 'var(--color-green-bg)',  color: 'var(--color-green)'  },
    cancelled: { bg: 'var(--color-red-bg)',    color: 'var(--color-red)'    },
    paused:    { bg: 'var(--color-amber-bg)',  color: 'var(--color-amber)'  },
    income:    { bg: 'var(--color-green-bg)',  color: 'var(--color-green)'  },
    expense:   { bg: 'var(--color-red-bg)',    color: 'var(--color-red)'    },
    info:      { bg: 'var(--color-blue-bg)',   color: 'var(--color-blue)'   },
    purple:    { bg: 'var(--color-purple-bg)', color: 'var(--color-purple)' },
  };
  const style = map[status] || { bg: 'var(--color-surface3)', color: 'var(--color-muted)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: style.bg, color: style.color,
    }}>
      {children || status}
    </span>
  );
}

// ── Modal ────────────────────────────────────────────────────
export function Modal({ title, onClose, children, maxWidth = 520 }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border2)', borderRadius: 20, padding: 28, width: '100%', maxWidth, maxHeight: '90vh', overflowY: 'auto' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{title}</h2>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-surface2)', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Input ────────────────────────────────────────────────────
export function Input({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{label}</label>}
      <input
        {...props}
        style={{
          padding: '10px 12px', background: 'var(--color-surface2)',
          border: `1px solid ${error ? 'var(--color-red)' : 'var(--color-border2)'}`,
          borderRadius: 10, fontSize: 14, color: 'var(--color-text)',
          outline: 'none', fontFamily: 'DM Sans, sans-serif', width: '100%',
          transition: 'border-color 0.15s',
        }}
      />
      {error && <span style={{ fontSize: 12, color: 'var(--color-red)' }}>{error}</span>}
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────
export function Select({ label, options = [], error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{label}</label>}
      <select
        {...props}
        style={{
          padding: '10px 12px', background: 'var(--color-surface2)',
          border: `1px solid ${error ? 'var(--color-red)' : 'var(--color-border2)'}`,
          borderRadius: 10, fontSize: 14, color: 'var(--color-text)',
          outline: 'none', fontFamily: 'DM Sans, sans-serif', width: '100%',
          cursor: 'pointer',
        }}
      >
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
      {error && <span style={{ fontSize: 12, color: 'var(--color-red)' }}>{error}</span>}
    </div>
  );
}

// ── ProgressBar ──────────────────────────────────────────────
export function ProgressBar({ value, max, showLabel = false }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct > 90 ? 'var(--color-red)' : pct > 70 ? 'var(--color-amber)' : 'var(--color-accent)';
  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, color: 'var(--color-muted)' }}>
          <span>{pct}%</span>
        </div>
      )}
      <div style={{ height: 6, background: 'var(--color-surface3)', borderRadius: 10, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 10, background: color }}
        />
      </div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ w = '100%', h = 20, radius = 8, style = {} }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: radius, ...style }} />;
}

// ── EmptyState ───────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 12, textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        {icon}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)' }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: 'var(--color-muted)', maxWidth: 260, lineHeight: 1.5 }}>{description}</div>}
      {action}
    </div>
  );
}

// ── AlertBanner ──────────────────────────────────────────────
export function AlertBanner({ type = 'info', message }) {
  const styles = {
    info:    { bg: 'var(--color-blue-bg)',   border: 'rgba(56,182,255,0.2)',   color: 'var(--color-blue)',   Icon: Info },
    warning: { bg: 'var(--color-amber-bg)',  border: 'rgba(245,166,35,0.2)',   color: 'var(--color-amber)',  Icon: AlertTriangle },
    success: { bg: 'var(--color-green-bg)',  border: 'rgba(34,211,165,0.2)',   color: 'var(--color-green)',  Icon: CheckCircle },
    danger:  { bg: 'var(--color-red-bg)',    border: 'rgba(255,95,126,0.2)',   color: 'var(--color-red)',    Icon: AlertTriangle },
  };
  const s = styles[type];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: 13, fontWeight: 600 }}>
      <s.Icon size={16} />
      {message}
    </div>
  );
}
