import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute    from './routes/PrivateRoute';
import Layout          from './components/layout/Layout';
import LoginPage       from './pages/LoginPage';
import Dashboard       from './pages/Dashboard';
import Timesheets      from './pages/Timesheets';
import Invoices        from './pages/Invoices';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
          } />
          <Route path="/timesheets" element={
            <PrivateRoute><Layout><Timesheets /></Layout></PrivateRoute>
          } />
          <Route path="/invoices" element={
            <PrivateRoute><Layout><Invoices /></Layout></PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;