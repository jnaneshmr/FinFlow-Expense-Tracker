// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    const result = await login(form.email, form.password);
    if (!result.success) setError(result.error);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      
      {/* Ambient Backgrounds */}
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: 440, borderRadius: 24, padding: 48, position: 'relative', zIndex: 10 }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'var(--color-muted)', fontSize: 13, fontWeight: 500, marginBottom: 40, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}>
          <ArrowLeft size={14} /> Back to home
        </Link>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8, letterSpacing: '-0.02em' }}>Log in</h1>
        <p style={{ fontSize: 15, color: 'var(--color-muted)', marginBottom: 32, fontWeight: 400 }}>Enter your details to access your account.</p>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--color-red-bg)', color: 'var(--color-red)', fontSize: 14, marginBottom: 24, border: '1px solid rgba(248, 113, 113, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com"
                style={{ width: '100%', padding: '14px 16px 14px 44px', background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 15, color: 'var(--color-text)', outline: 'none', transition: 'border-color 0.2s', fontWeight: 400 }} 
                onFocus={e => e.target.style.borderColor = 'var(--color-text)'} onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••"
                style={{ width: '100%', padding: '14px 44px 14px 44px', background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 15, color: 'var(--color-text)', outline: 'none', transition: 'border-color 0.2s', fontWeight: 400 }}
                onFocus={e => e.target.style.borderColor = 'var(--color-text)'} onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 14, background: 'var(--color-text)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, color: 'var(--color-bg)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 8, transition: 'transform 0.2s' }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'scale(1.02)')} onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: 'var(--color-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-text)', fontWeight: 500, textDecoration: 'none' }}>Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
}
