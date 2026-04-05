import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const KpiCard = ({ icon, label, value, color, sub }) => {
  const colors = {
    indigo: { bg: '#eef2ff', icon: '#6366f1', text: '#4338ca' },
    amber:  { bg: '#fffbeb', icon: '#f59e0b', text: '#d97706' },
    green:  { bg: '#f0fdf4', icon: '#22c55e', text: '#16a34a' },
    rose:   { bg: '#fff1f2', icon: '#f43f5e', text: '#e11d48' },
  }[color] || { bg: '#f3f4f6', icon: '#6b7280', text: '#374151' };

  return (
    <div className="bg-white rounded-2xl p-6 transition-all duration-200"
      style={{ border: '1px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow='0 1px 8px rgba(0,0,0,0.04)'}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold" style={{ color: colors.text }}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: colors.bg }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon, title, desc, to, color }) => {
  const navigate = useNavigate();
  const colors = {
    indigo: { bg: '#eef2ff', border: '#c7d2fe', hover: '#e0e7ff', text: '#4338ca' },
    green:  { bg: '#f0fdf4', border: '#bbf7d0', hover: '#dcfce7', text: '#15803d' },
    amber:  { bg: '#fffbeb', border: '#fde68a', hover: '#fef3c7', text: '#b45309' },
    rose:   { bg: '#fff1f2', border: '#fecdd3', hover: '#ffe4e6', text: '#be123c' },
  }[color] || {};

  return (
    <button onClick={() => navigate(to)}
      className="flex items-start gap-4 p-5 rounded-xl text-left w-full transition-all duration-200"
      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
      onMouseEnter={e => e.currentTarget.style.background=colors.hover}
      onMouseLeave={e => e.currentTarget.style.background=colors.bg}>
      <div className="text-2xl mt-0.5">{icon}</div>
      <div>
        <div className="font-semibold text-sm" style={{ color: colors.text }}>{title}</div>
        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
      </div>
    </button>
  );
};

export default function Dashboard() {
  const { user, getTrialDaysLeft } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const trialDays = getTrialDaysLeft();
  const onTrial   = user?.subscriptionStatus === 'trial' && trialDays !== null;

  useEffect(() => {
    API.get('/dashboard/summary')
      .then(res => setSummary(res.data))
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Quick actions per role
  const quickActions = {
    employee: [
      { icon: '📋', title: 'Log Time',         desc: 'Record your work hours',       to: '/timesheets', color: 'indigo' },
      { icon: '✅', title: 'Submit Timesheet', desc: 'Submit pending entries',        to: '/timesheets', color: 'green'  },
    ],
    manager: [
      { icon: '📋', title: 'View Timesheets',  desc: 'Review team time entries',     to: '/timesheets', color: 'indigo' },
      { icon: '✅', title: 'Pending Approvals',desc: 'Approve or reject submissions', to: '/timesheets', color: 'amber'  },
    ],
    admin: [
      { icon: '📋', title: 'Timesheets',        desc: 'Manage all time entries',     to: '/timesheets', color: 'indigo' },
      { icon: '🧾', title: 'Invoices',          desc: 'Create & manage invoices',    to: '/invoices',   color: 'green'  },
      { icon: '👥', title: 'Employees',         desc: 'Manage team members',         to: '/employees',  color: 'amber'  },
    ],
  }[user?.role] || [];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-xl w-64"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {greeting()}, {user?.firstName} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Plan badge */}
          <div className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: user?.subscriptionStatus === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(99,102,241,0.1)',
              border: `1px solid ${user?.subscriptionStatus === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(99,102,241,0.25)'}`,
              color: user?.subscriptionStatus === 'active' ? '#16a34a' : '#4338ca',
            }}>
            {user?.subscriptionStatus === 'active'
              ? `✓ ${user?.subscriptionPlan?.charAt(0).toUpperCase() + user?.subscriptionPlan?.slice(1)} Plan`
              : onTrial
                ? `⏱ Trial — ${trialDays} day${trialDays !== 1 ? 's' : ''} left`
                : '⚠ Trial Expired'}
          </div>
        </div>
      </div>

      {/* Trial upgrade CTA */}
      {onTrial && trialDays <= 3 && (
        <div className="mb-6 p-4 rounded-2xl animate-fade-up-delay1 flex items-center justify-between"
          style={{
            background: trialDays <= 1 ? 'linear-gradient(135deg, #fef2f2, #fff1f2)' : 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            border: `1px solid ${trialDays <= 1 ? '#fecdd3' : '#fde68a'}`,
          }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{trialDays === 0 ? '⛔' : trialDays === 1 ? '⚠️' : '🔔'}</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: trialDays <= 1 ? '#be123c' : '#b45309' }}>
                {trialDays === 0 ? 'Your trial has expired' : `Only ${trialDays} day${trialDays !== 1 ? 's' : ''} left in your trial`}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Upgrade to keep access to all features.</p>
            </div>
          </div>
          <button onClick={() => navigate('/pricing')}
            className="text-sm font-semibold px-5 py-2 rounded-xl transition-all"
            style={{ background: trialDays <= 1 ? '#be123c' : '#d97706', color: '#fff', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}>
            Upgrade Now
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-xl text-sm" style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#be123c' }}>
          {error}
        </div>
      )}

      {/* KPI Cards — admin/manager only */}
      {(user?.role === 'admin' || user?.role === 'manager') && summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 animate-fade-up-delay1">
          <KpiCard icon="👥" label="Total Employees" value={summary.totalEmployees ?? 0}   color="indigo" sub="Active team members" />
          <KpiCard icon="⏱️" label="Tracked Hours"   value={`${summary.trackedHours ?? 0}h`} color="amber"  sub="This period"         />
          <KpiCard icon="💰" label="Total Revenue"   value={`$${(summary.revenue ?? 0).toLocaleString()}`} color="green" sub="Invoiced amount" />
        </div>
      )}

      {/* Employee KPI */}
      {user?.role === 'employee' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 animate-fade-up-delay1">
          <KpiCard icon="⏱️" label="Your Tracked Hours" value={`${summary?.trackedHours ?? 0}h`} color="indigo" sub="Total logged" />
          <KpiCard icon="📋" label="Pending Submissions" value={summary?.pendingTimesheets ?? 0} color="amber" sub="Awaiting approval" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="animate-fade-up-delay2">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className={`grid gap-4 ${quickActions.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
          {quickActions.map((action, i) => (
            <QuickAction key={i} {...action} />
          ))}
        </div>
      </div>

      {/* Role access summary */}
      <div className="mt-8 p-5 rounded-2xl animate-fade-up-delay3"
        style={{ background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
        <h2 className="text-base font-semibold text-gray-700 mb-4">Your Access Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Timesheets',  access: true,                    desc: user?.role === 'employee' ? 'Create & submit' : user?.role === 'manager' ? 'View & approve/reject' : 'Full access' },
            { label: 'Invoices',   access: user?.role === 'admin',   desc: user?.role === 'admin' ? 'Full access' : 'No access' },
            { label: 'Employees',  access: user?.role === 'admin',   desc: user?.role === 'admin' ? 'Full access' : 'No access' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: item.access ? '#f0fdf4' : '#f9fafb', border: `1px solid ${item.access ? '#bbf7d0' : '#e5e7eb'}` }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: item.access ? '#dcfce7' : '#f3f4f6' }}>
                {item.access
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                }
              </div>
              <div>
                <div className="text-sm font-medium" style={{ color: item.access ? '#15803d' : '#6b7280' }}>{item.label}</div>
                <div className="text-xs" style={{ color: item.access ? '#16a34a' : '#9ca3af' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
