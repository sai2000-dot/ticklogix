import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute  from './routes/PrivateRoute';
import RoleRoute     from './routes/RoleRoute';
import Layout        from './components/layout/Layout';
import LoginPage     from './pages/LoginPage';
import PricingPage   from './pages/PricingPage';
import PaymentPage   from './pages/PaymentPage';
import Dashboard     from './pages/Dashboard';
import Timesheets    from './pages/Timesheets';
import Invoices      from './pages/Invoices';
import Employees     from './pages/Employees';
import AuthCallback  from './pages/AuthCallback';
import OnboardingPage from './pages/OnboardingPage';

// Wraps each page with a fade-up entrance animation
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route path="/"         element={<LoginPage />} />
        <Route path="/pricing"  element={<PricingPage />} />
        <Route path="/payment"  element={<PaymentPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/onboarding"    element={<OnboardingPage />} />

        {/* All authenticated users */}
        <Route path="/dashboard" element={
          <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
        } />

        {/* Employee + Manager + Admin: timesheets */}
        <Route path="/timesheets" element={
          <PrivateRoute><Layout><Timesheets /></Layout></PrivateRoute>
        } />

        {/* Admin only: invoices */}
        <Route path="/invoices" element={
          <PrivateRoute>
            <RoleRoute allowed={['admin']}>
              <Layout><Invoices /></Layout>
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Admin only: employees */}
        <Route path="/employees" element={
          <PrivateRoute>
            <RoleRoute allowed={['admin']}>
              <Layout><Employees /></Layout>
            </RoleRoute>
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
