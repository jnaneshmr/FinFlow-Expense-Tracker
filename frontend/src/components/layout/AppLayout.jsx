// src/components/layout/AppLayout.jsx
import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CreditCard, RefreshCw, Wallet,
  BarChart3, Settings, LogOut, Bell, Search,
  Sun, Moon, Menu, X, TrendingUp, Infinity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { initials } from '../../utils/helpers';

const NAV = [
  { path: '/dashboard',     label: 'Dashboard',     Icon: LayoutDashboard },
  { path: '/transactions',  label: 'Transactions',  Icon: CreditCard },
  { path: '/subscriptions', label: 'Subscriptions', Icon: RefreshCw },
  { path: '/budgets',       label: 'Budgets',       Icon: Wallet },
  { path: '/analytics',     label: 'Analytics',     Icon: BarChart3 },
  { path: '/settings',      label: 'Settings',      Icon: Settings },
];

function Avatar({ name, src, size = 34 }) {
  if (src) {
    return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)' }} />;
  }
  const abbr = initials(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #6c63ff, #b57bee)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color: 'white', flexShrink: 0,
      border: '2px solid rgba(255,255,255,0.1)'
    }}>{abbr}</div>
  );
}

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handle = () => {
      const isMobile = window.innerWidth < 768;
      setMobile(isMobile);
      if (isMobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handle);
    handle();
    return () => window.removeEventListener('resize', handle);
  }, []);

  const SIDEBAR_W = 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Global Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, background: 'url(/premium_finance_bg.png) center/cover no-repeat', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, background: 'linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.8) 100%)', pointerEvents: 'none' }} />

      {/* Overlay for mobile */}
      <AnimatePresence>
        {mobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 98 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : -SIDEBAR_W }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="glass-panel"
        style={{
          width: SIDEBAR_W, minHeight: '100vh',
          borderRight: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column',
          position: mobile ? 'fixed' : 'sticky',
          top: 0, left: 0, zIndex: 99,
          height: mobile ? '100vh' : 'auto',
          borderRadius: 0, // override glass-panel default if needed, but it should be fine
        }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6c63ff, #b57bee)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Infinity size={22} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>FinFlow</span>
          {mobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-hint)', padding: '8px 12px 6px', marginBottom: 4 }}>Main Menu</div>
          {NAV.map(({ path, label, Icon }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} onClick={() => mobile && setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 10, marginBottom: 2,
                  fontSize: 14, fontWeight: 500, textDecoration: 'none',
                  color: active ? 'var(--color-accent2)' : 'var(--color-muted)',
                  background: active ? 'var(--color-accent-bg)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(108,99,255,0.2)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: 12, borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--color-surface2)', cursor: 'pointer' }} onClick={logout}>
            <Avatar name={user?.name || 'User'} src={user?.avatar} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--color-hint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
            <LogOut size={15} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, marginLeft: (!mobile && sidebarOpen) ? 0 : 0 }}>
        {/* Header */}
        <header className="glass-panel" style={{ height: 64, borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14, position: 'sticky', top: 0, zIndex: 50, borderRadius: 0 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ width: 36, height: 36, border: '1px solid var(--color-border2)', borderRadius: 8, background: 'transparent', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Menu size={18} />
          </button>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-hint)' }} />
            <input placeholder="Search..." style={{ width: '100%', padding: '8px 12px 8px 34px', background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 13, color: 'var(--color-text)', outline: 'none', fontFamily: 'DM Sans, sans-serif' }} />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={toggleTheme} style={{ width: 36, height: 36, border: '1px solid var(--color-border2)', borderRadius: 8, background: 'transparent', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setShowNotifications(s => !s); setShowProfile(false); }} style={{ width: 36, height: 36, border: '1px solid var(--color-border2)', borderRadius: 8, background: 'transparent', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Bell size={17} />
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="glass-panel"
                    style={{ position: 'absolute', top: 48, right: 0, width: 280, padding: 16, borderRadius: 16, zIndex: 100, border: '1px solid var(--color-border)' }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
                      Notifications
                    </div>
                    <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-hint)', fontSize: 13 }}>
                      You have no new notifications.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setShowProfile(s => !s); setShowNotifications(false); }} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <Avatar name={user?.name || 'U'} src={user?.avatar} size={34} />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="glass-panel"
                    style={{ position: 'absolute', top: 48, right: 0, width: 260, padding: '24px 16px 16px', borderRadius: 20, zIndex: 100, border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <Avatar name={user?.name || 'User'} src={user?.avatar} size={64} />
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginTop: 16, letterSpacing: '-0.01em' }}>{user?.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 24 }}>{user?.email}</div>
                    
                    <button 
                      onClick={logout} 
                      style={{ width: '100%', padding: '12px', background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 12, cursor: 'pointer', color: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} 
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-red-bg)'; e.currentTarget.style.borderColor = 'var(--color-red)'; }} 
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface2)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}>
                      <LogOut size={16} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, padding: '28px', maxWidth: 1400, width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
