import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavIcon = ({ path }) => {
  const icons = {
    dashboard: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
    timesheets: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    invoices: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    employees: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  };
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[path]}
    </svg>
  );
};

export default function Layout({ children }) {
  const { user, logout, getTrialDaysLeft } = useAuth();
  const navigate  = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const trialDays = getTrialDaysLeft();
  const onTrial   = user?.subscriptionStatus === 'trial' && trialDays !== null;

  const handleLogout = () => { logout(); navigate('/'); };

  // Build nav items based on role
  const navItems = [
    { to: '/dashboard',  label: 'Dashboard',  icon: 'dashboard',  roles: ['employee', 'manager', 'admin'] },
    { to: '/timesheets', label: 'Timesheets', icon: 'timesheets', roles: ['employee', 'manager', 'admin'] },
    { to: '/invoices',   label: 'Invoices',   icon: 'invoices',   roles: ['admin'] },
    { to: '/employees',  label: 'Employees',  icon: 'employees',  roles: ['admin'] },
  ].filter(item => item.roles.includes(user?.role));

  const roleBadge = {
    employee: { label: 'Employee', bg: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.35)',  text: '#a5b4fc' },
    manager:  { label: 'Manager',  bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', text: '#fcd34d' },
    admin:    { label: 'Admin',    bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',   text: '#fca5a5' },
  }[user?.role] || {};

  return (
    <div className="flex h-screen" style={{ background: '#f8f9fc' }}>

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col transition-all duration-300"
        style={{
          width: collapsed ? '70px' : '240px',
          background: '#fff',
          borderRight: '1px solid #e5e7eb',
          boxShadow: '4px 0 24px rgba(0,0,0,0.04)',
        }}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: '1px solid #f3f4f6' }}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 10px rgba(99,102,241,0.35)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <span className="font-bold text-gray-800 text-base">TickLogix</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
            style={{ color: '#9ca3af' }}
            onMouseEnter={e => { e.currentTarget.style.background='#f3f4f6'; e.currentTarget.style.color='#374151'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#9ca3af'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {collapsed
                ? <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
                : <><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></>
              }
            </svg>
          </button>
        </div>

        {/* Trial banner (sidebar) */}
        {onTrial && !collapsed && (
          <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl"
            style={{ background: trialDays <= 2 ? 'rgba(239,68,68,0.08)' : 'rgba(99,102,241,0.08)', border: `1px solid ${trialDays <= 2 ? 'rgba(239,68,68,0.25)' : 'rgba(99,102,241,0.2)'}` }}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full animate-trial-pulse`}
                style={{ background: trialDays <= 2 ? '#f87171' : '#818cf8' }}></div>
              <span className="text-xs font-semibold" style={{ color: trialDays <= 2 ? '#f87171' : '#818cf8' }}>
                {trialDays === 0 ? 'Trial Expired' : `${trialDays} day${trialDays !== 1 ? 's' : ''} left`}
              </span>
            </div>
            <button onClick={() => navigate('/pricing')}
              className="text-xs font-medium w-full text-left transition-colors"
              style={{ color: 'rgba(99,102,241,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color='#6366f1'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(99,102,241,0.8)'}>
              Upgrade plan →
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.label : undefined}>
              <NavIcon path={item.icon} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
          {!collapsed ? (
            <div>
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', color: '#4338ca' }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: roleBadge.bg, border: `1px solid ${roleBadge.border}`, color: roleBadge.text }}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background='#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 rounded-lg transition-colors"
              style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Sign Out"
              onMouseEnter={e => e.currentTarget.style.background='#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top trial banner (header) */}
        {onTrial && (
          <div className="flex items-center justify-between px-6 py-2.5"
            style={{
              background: trialDays <= 2
                ? 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.08))'
                : 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
              borderBottom: `1px solid ${trialDays <= 2 ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.15)'}`,
            }}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-trial-pulse`}
                style={{ background: trialDays <= 2 ? '#f87171' : '#818cf8' }}></div>
              <span className="text-sm" style={{ color: trialDays <= 2 ? '#fca5a5' : 'rgba(99,102,241,0.9)' }}>
                {trialDays === 0
                  ? 'Your free trial has expired.'
                  : `Your free trial ends in ${trialDays} day${trialDays !== 1 ? 's' : ''}.`}
              </span>
            </div>
            <button onClick={() => navigate('/pricing')}
              className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all"
              style={{
                background: trialDays <= 2 ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.15)',
                border: `1px solid ${trialDays <= 2 ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.35)'}`,
                color: trialDays <= 2 ? '#fca5a5' : '#a5b4fc',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity='0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}>
              Upgrade Now →
            </button>
          </div>
        )}

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
