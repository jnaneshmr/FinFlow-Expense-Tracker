// src/pages/SettingsPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Moon, Sun, User, Lock, Bell, LogOut, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { initials } from '../utils/helpers';
import toast from 'react-hot-toast';

const inputSt = { width: '100%', padding: '10px 12px', background: 'var(--color-surface2)', border: '1px solid var(--color-border2)', borderRadius: 10, fontSize: 14, color: 'var(--color-text)', outline: 'none', fontFamily: 'DM Sans, sans-serif' };
const labelSt = { fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' };

function Section({ title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ borderRadius: 24, padding: 24, marginBottom: 24 }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>{title}</h2>
      {children}
    </motion.div>
  );
}

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', avatar: user?.avatar || '' });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { toast.error('Image must be less than 2MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(p => ({ ...p, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    if (!profile.name || !profile.email) { toast.error('Name and email are required'); return; }
    updateUser({ ...user, name: profile.name, email: profile.email, avatar: profile.avatar });
    toast.success('Profile saved successfully!');
  };

  const changePassword = () => {
    if (!pw.current || !pw.next) { toast.error('Please fill in all password fields'); return; }
    if (pw.next !== pw.confirm) { toast.error('New passwords do not match'); return; }
    if (pw.next.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    toast.success('Password changed successfully!');
    setPw({ current: '', next: '', confirm: '' });
  };

  const abbr = initials(user?.name || 'User');

  return (
    <div style={{ maxWidth: 660 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>Manage your account and preferences</p>
      </div>

      {/* Profile header */}
      <Section title="Profile">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ position: 'relative' }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #b57bee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'white', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)' }}>
                {abbr}
              </div>
            )}
            <label style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: 'var(--color-surface2)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              <Camera size={14} />
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{user?.name}</div>
            <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>{user?.email}</div>
            <span style={{ display: 'inline-flex', marginTop: 8, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'var(--color-green-bg)', color: 'var(--color-green)' }}>✓ Pro Member</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelSt}>Full Name</label>
            <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} style={inputSt} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelSt}>Email Address</label>
            <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} style={inputSt} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button onClick={saveProfile} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
              <Save size={15} /> Save Changes
            </button>
          </div>
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Current Password', key: 'current' },
            { label: 'New Password',     key: 'next' },
            { label: 'Confirm New Password', key: 'confirm' },
          ].map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelSt}>{f.label}</label>
              <input type="password" value={pw[f.key]} onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))} placeholder="••••••••" style={inputSt} />
            </div>
          ))}
          <div>
            <button onClick={changePassword} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: '#6c63ff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
              <Lock size={15} /> Update Password
            </button>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Color Theme</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 3 }}>Currently in <strong>{theme === 'dark' ? 'dark' : 'light'}</strong> mode</div>
          </div>
          <button onClick={toggleTheme} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'var(--color-surface2)', border: '1px solid var(--color-border2)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--color-text)', fontFamily: 'DM Sans, sans-serif' }}>
            {theme === 'dark' ? <><Sun size={16} /> Switch to Light</> : <><Moon size={16} /> Switch to Dark</>}
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        {[
          { label: 'Renewal Reminders', desc: 'Get notified 3 days before a subscription renews', default: true },
          { label: 'Budget Alerts',     desc: 'Alert when spending exceeds 80% of a budget',     default: true },
          { label: 'Weekly Summary',    desc: 'Weekly email summary of your finances',             default: false },
          { label: 'New Features',      desc: 'Updates about new FinFlow features',               default: false },
        ].map(n => (
          <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{n.label}</div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>{n.desc}</div>
            </div>
            <NotifToggle defaultOn={n.default} />
          </div>
        ))}
      </Section>

      {/* Danger zone */}
      <Section title="Account">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Sign Out</div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>You'll need to sign back in to access your data</div>
          </div>
          <button onClick={logout} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'var(--color-red-bg)', border: '1px solid rgba(255,95,126,0.2)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--color-red)', fontFamily: 'DM Sans, sans-serif' }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </Section>

      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-hint)', marginTop: 8 }}>
        FinFlow v1.0.0 · Built with React + Node.js + PostgreSQL
      </div>
    </div>
  );
}

function NotifToggle({ defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div onClick={() => setOn(v => !v)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? '#6c63ff' : 'var(--color-surface3)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </div>
  );
}
