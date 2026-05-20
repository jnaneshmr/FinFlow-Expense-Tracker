// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('All fields are required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    const result = await register(form.name, form.email, form.password);
    if (!result.success) setError(result.error);
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px 10px 36px',
    background: 'var(--color-surface2)', border: '1px solid var(--color-border2)',
    borderRadius: 10, fontSize: 14, color: 'var(--color-text)',
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: -200, left: -100, width: 600, height: 600, background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 440, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 24, padding: 40 }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6c63ff, #b57bee)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: 14 }}>FF</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg, #8b85ff, #b57bee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FinFlow</span>
        </Link>

        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--color-text)', marginBottom: 6 }}>Create account</h1>
        <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 28 }}>Start managing your finances today</p>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--color-red-bg)', border: '1px solid rgba(255,95,126,0.25)', color: 'var(--color-red)', fontSize: 13, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Full Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-hint)' }} />
              <input type="text" value={form.name} onChange={set('name')} placeholder="Alex Morgan" style={inputStyle} />
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-hint)' }} />
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" style={inputStyle} />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-hint)' }} />
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 6 characters"
                style={{ ...inputStyle, paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-hint)', display: 'flex' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-hint)' }} />
              <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat your password" style={inputStyle} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 12, background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, color: 'white', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'DM Sans, sans-serif', marginTop: 4 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--color-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent2)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
        </p>
      </motion.div>
    </div>
  );
}
