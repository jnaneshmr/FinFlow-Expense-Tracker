// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, RefreshCw, Wallet, Shield, Moon, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FEATURES = [
  { icon: BarChart3,  title: 'Smart Dashboard',        desc: 'Real-time overview of income, expenses, and net worth with beautiful interactive charts.' },
  { icon: RefreshCw,  title: 'Subscription Tracker',   desc: 'Never miss a renewal. Track all subscriptions with smart reminders before billing dates.' },
  { icon: Wallet,     title: 'Budget Manager',         desc: 'Set monthly budgets by category and get alerts when you\'re approaching your limits.' },
  { icon: TrendingUp, title: 'Advanced Analytics',     desc: 'Deep insights into your spending patterns with monthly trends and category breakdowns.' },
  { icon: Shield,     title: 'Secure & Private',       desc: 'JWT-based authentication with bcrypt-hashed passwords. Your data stays private.' },
  { icon: Moon,       title: 'Dark & Light Mode',      desc: 'Switch between beautifully crafted dark and light themes to suit your preference.' },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 48px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6c63ff, #b57bee)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: 14 }}>FF</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg, #8b85ff, #b57bee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FinFlow</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', alignItems: 'center' }}>
            <Moon size={16} />
          </button>
          <Link to="/login" style={{ padding: '8px 18px', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none', background: 'transparent' }}>Sign In</Link>
          <Link to="/register" style={{ padding: '8px 18px', background: '#6c63ff', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'white', textDecoration: 'none' }}>Get Started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -150, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ textAlign: 'center', padding: '100px 24px 80px', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', fontSize: 13, fontWeight: 600, color: '#8b85ff', marginBottom: 28 }}>
              ✨ Your Financial Command Center
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, color: 'var(--color-text)', marginBottom: 20 }}>
            Master Your Money<br />
            with <span style={{ background: 'linear-gradient(135deg, #8b85ff, #b57bee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FinFlow</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 18, color: 'var(--color-muted)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Track income, expenses, budgets, and subscriptions in one stunning dashboard. Built for people who take their finances seriously.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: '#6c63ff', borderRadius: 12, fontSize: 16, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: 'var(--color-surface)', border: '1px solid var(--color-border2)', borderRadius: 12, fontSize: 16, fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none' }}>
              Sign In
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px 100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon size={22} color="#8b85ff" />
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>{title}</div>
            <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.6 }}>{desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--color-border)', textAlign: 'center', padding: '24px', fontSize: 13, color: 'var(--color-hint)' }}>
        © 2024 FinFlow · Built with React, Node.js, PostgreSQL & Prisma
      </div>
    </div>
  );
}
