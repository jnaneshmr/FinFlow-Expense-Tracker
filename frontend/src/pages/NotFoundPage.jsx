// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{ fontSize: 'clamp(80px, 15vw, 160px)', fontWeight: 800, lineHeight: 1, background: 'linear-gradient(135deg, #6c63ff, #b57bee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>
          404
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text)', marginBottom: 10 }}>
          Page not found
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-muted)', maxWidth: 380, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Looks like this page took an unexpected budget cut. It doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: '#6c63ff', borderRadius: 12, fontSize: 15, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
            <Home size={17} /> Go to Dashboard
          </Link>
          <button onClick={() => window.history.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'var(--color-surface)', border: '1px solid var(--color-border2)', borderRadius: 12, fontSize: 15, fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            <ArrowLeft size={17} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
