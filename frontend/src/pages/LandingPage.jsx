// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, RefreshCw, Wallet, Shield, Moon, TrendingUp, Sun, Infinity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FEATURES = [
  { icon: BarChart3,  title: 'Smart Dashboard',        desc: 'Real-time overview of income, expenses, and net worth with interactive charts.' },
  { icon: RefreshCw,  title: 'Subscription Tracker',   desc: 'Never miss a renewal. Track all subscriptions with smart reminders before billing dates.' },
  { icon: Wallet,     title: 'Budget Manager',         desc: 'Set monthly budgets by category and get alerts when approaching your limits.' },
  { icon: TrendingUp, title: 'Advanced Analytics',     desc: 'Deep insights into your spending patterns with monthly trends and category breakdowns.' },
  { icon: Shield,     title: 'Secure & Private',       desc: 'JWT-based authentication with bcrypt-hashed passwords. Your data stays private.' },
  { icon: Moon,       title: 'Dark & Light Mode',      desc: 'Switch between beautifully crafted dark and light themes to suit your preference.' },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Custom Generated Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, background: 'url(/premium_finance_bg.png) center/cover no-repeat', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, background: 'linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.8) 100%)', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav className="glass-panel" style={{ margin: '24px 32px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 20, position: 'sticky', top: 24, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6c63ff, #b57bee)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Infinity size={22} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>FinFlow</span>
        </div>
        
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ width: 36, height: 36, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}>
            Log in
          </Link>
          <Link to="/register" style={{ padding: '8px 20px', background: 'var(--color-text)', borderRadius: 100, fontSize: 14, fontWeight: 600, color: 'var(--color-bg)', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', zIndex: 10 }}>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <div className="glass-panel" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, color: 'var(--color-muted)', fontSize: 13, fontWeight: 500, marginBottom: 32, border: '1px solid var(--color-border)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-green)', boxShadow: '0 0 10px var(--color-green)' }} /> 
            Welcome to the future of finance
          </div>
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: 800, color: 'var(--color-text)', marginBottom: 24, letterSpacing: '-0.03em', lineHeight: 1.1, maxWidth: 900 }}>
          Next-generation <br/>
          <span style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontStyle: 'italic', 
            fontWeight: 700, 
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 20%, #b57bee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            financial intelligence.
          </span>
        </motion.h1>
        
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 18, color: 'var(--color-muted)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 400 }}>
          Experience a sleek, powerful, and utterly transparent way to track your income, expenses, budgets, and subscriptions.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px', background: 'var(--color-text)', borderRadius: 100, fontSize: 16, fontWeight: 600, color: 'var(--color-bg)', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: '0 0 40px rgba(255,255,255,0.1)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            Start for free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      {/* Bento Grid Features */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 140px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'minmax(240px, auto)', gap: 24, zIndex: 10, position: 'relative' }}>
        
        {/* Large Feature 1 (Spans 8 cols) */}
        <motion.div initial={{ opacity: 0, y: 40, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-panel"
          style={{ gridColumn: 'span 8', borderRadius: 32, padding: 48, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'var(--color-purple-bg)', filter: 'blur(60px)', borderRadius: '50%' }} />
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--color-surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'auto', color: 'var(--color-text)', border: '1px solid var(--color-border)', position: 'relative' }}>
            <BarChart3 size={28} strokeWidth={1.5} />
          </div>
          <div style={{ marginTop: 48, position: 'relative' }}>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>{FEATURES[0].title}</h3>
            <p style={{ fontSize: 16, color: 'var(--color-muted)', lineHeight: 1.6, fontWeight: 400, maxWidth: 400 }}>{FEATURES[0].desc}</p>
          </div>
        </motion.div>

        {/* Tall Feature 2 (Spans 4 cols, 2 rows) */}
        <motion.div initial={{ opacity: 0, y: 40, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-panel"
          style={{ gridColumn: 'span 4', gridRow: 'span 2', borderRadius: 32, padding: 40, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(108,99,255,0.05) 100%)' }}>
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'var(--color-blue-bg)', filter: 'blur(60px)', borderRadius: '50%' }} />
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--color-surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'auto', color: 'var(--color-text)', border: '1px solid var(--color-border)', position: 'relative' }}>
            <RefreshCw size={28} strokeWidth={1.5} />
          </div>
          <div style={{ marginTop: 48, position: 'relative' }}>
            <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{FEATURES[1].title}</h3>
            <p style={{ fontSize: 16, color: 'var(--color-muted)', lineHeight: 1.6, fontWeight: 400 }}>{FEATURES[1].desc}</p>
          </div>
        </motion.div>

        {/* Small Feature 3 (Spans 4 cols) */}
        <motion.div initial={{ opacity: 0, y: 40, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-panel"
          style={{ gridColumn: 'span 4', borderRadius: 32, padding: 32, display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--color-surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
            <Wallet size={24} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>{FEATURES[2].title}</h3>
          <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.6, fontWeight: 400 }}>{FEATURES[2].desc}</p>
        </motion.div>

        {/* Small Feature 4 (Spans 4 cols) */}
        <motion.div initial={{ opacity: 0, y: 40, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-panel"
          style={{ gridColumn: 'span 4', borderRadius: 32, padding: 32, display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--color-surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
            <TrendingUp size={24} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>{FEATURES[3].title}</h3>
          <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.6, fontWeight: 400 }}>{FEATURES[3].desc}</p>
        </motion.div>

        {/* Wide Feature 5 (Spans 6 cols) */}
        <motion.div initial={{ opacity: 0, y: 40, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-panel"
          style={{ gridColumn: 'span 6', borderRadius: 32, padding: 40, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, left: '50%', width: 150, height: 150, background: 'var(--color-green-bg)', filter: 'blur(50px)', borderRadius: '50%' }} />
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--color-surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--color-text)', border: '1px solid var(--color-border)', position: 'relative' }}>
            <Shield size={24} strokeWidth={1.5} />
          </div>
          <div style={{ position: 'relative' }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>{FEATURES[4].title}</h3>
            <p style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.6, fontWeight: 400 }}>{FEATURES[4].desc}</p>
          </div>
        </motion.div>

        {/* Wide Feature 6 (Spans 6 cols) */}
        <motion.div initial={{ opacity: 0, y: 40, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-panel"
          style={{ gridColumn: 'span 6', borderRadius: 32, padding: 40, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -30, right: '20%', width: 150, height: 150, background: 'var(--color-amber-bg)', filter: 'blur(50px)', borderRadius: '50%' }} />
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--color-surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--color-text)', border: '1px solid var(--color-border)', position: 'relative' }}>
            <Moon size={24} strokeWidth={1.5} />
          </div>
          <div style={{ position: 'relative' }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>{FEATURES[5].title}</h3>
            <p style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.6, fontWeight: 400 }}>{FEATURES[5].desc}</p>
          </div>
        </motion.div>
        
      </div>

    </div>
  );
}
