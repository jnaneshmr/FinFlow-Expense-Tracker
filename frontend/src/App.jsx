// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage     from './pages/LandingPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import DashboardPage   from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import BudgetsPage     from './pages/BudgetsPage';
import AnalyticsPage   from './pages/AnalyticsPage';
import SettingsPage    from './pages/SettingsPage';
import NotFoundPage    from './pages/NotFoundPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout><DashboardPage /></AppLayout>
        </ProtectedRoute>
      }/>
      <Route path="/transactions" element={
        <ProtectedRoute>
          <AppLayout><TransactionsPage /></AppLayout>
        </ProtectedRoute>
      }/>
      <Route path="/subscriptions" element={
        <ProtectedRoute>
          <AppLayout><SubscriptionsPage /></AppLayout>
        </ProtectedRoute>
      }/>
      <Route path="/budgets" element={
        <ProtectedRoute>
          <AppLayout><BudgetsPage /></AppLayout>
        </ProtectedRoute>
      }/>
      <Route path="/analytics" element={
        <ProtectedRoute>
          <AppLayout><AnalyticsPage /></AppLayout>
        </ProtectedRoute>
      }/>
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout><SettingsPage /></AppLayout>
        </ProtectedRoute>
      }/>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
