import React, { useState, useEffect } from 'react';
import API from '../services/api';
import StatCard from '../components/ui/StatCard';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    API.get('/dashboard/summary')
      .then(res => setSummary(res.data))
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="👥"
          label="Total Employees"
          value={summary?.totalEmployees ?? 0}
          color="indigo"
        />
        <StatCard
          icon="⏱️"
          label="Tracked Hours"
          value={summary?.trackedHours ?? 0}
          color="amber"
        />
        <StatCard
          icon="💰"
          label="Revenue"
          value={'$' + (summary?.revenue ?? 0)}
          color="green"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="/timesheets"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <span className="text-2xl">📋</span>
            <div>
              <div className="font-medium text-gray-800">Timesheets</div>
              <div className="text-sm text-gray-500">Manage time entries</div>
            </div>
          </a>
          <a
            href="/invoices"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <span className="text-2xl">🧾</span>
            <div>
              <div className="font-medium text-gray-800">Invoices</div>
              <div className="text-sm text-gray-500">Manage invoices</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}