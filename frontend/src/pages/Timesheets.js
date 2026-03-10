import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchTimesheets,
  createTimesheet,
  submitTimesheet,
  approveTimesheet,
  rejectTimesheet,
} from '../services/timesheetService';
import StatusBadge from '../components/ui/StatusBadge';

export default function Timesheets() {
  const { user, canApprove } = useAuth();
  const [timesheets, setTimesheets] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [form, setForm] = useState({
    project:     '',
    client:      '',
    date:        '',
    hoursWorked: '',
    description: '',
  });

  useEffect(() => {
    loadTimesheets();
  }, []);

  const loadTimesheets = async () => {
    try {
      const res = await fetchTimesheets();
      setTimesheets(res.data);
    } catch (err) {
      setError('Failed to load timesheets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createTimesheet(form);
      setShowForm(false);
      setForm({ project: '', client: '', date: '', hoursWorked: '', description: '' });
      loadTimesheets();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create timesheet');
    }
  };

  const handleSubmit = async (id) => {
    try {
      await submitTimesheet(id);
      loadTimesheets();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit timesheet');
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveTimesheet(id);
      loadTimesheets();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve timesheet');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectTimesheet(id);
      loadTimesheets();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject timesheet');
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Timesheets</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your time entries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Entry'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">New Time Entry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <input
                type="text"
                value={form.project}
                onChange={e => setForm({ ...form, project: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input
                type="text"
                value={form.client}
                onChange={e => setForm({ ...form, client: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
              <input
                type="number"
                value={form.hoursWorked}
                onChange={e => setForm({ ...form, hoursWorked: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="8"
                min="0.5"
                max="24"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What did you work on?"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCreate}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Save Entry
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Hours</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {timesheets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No timesheets yet. Create your first entry.
                </td>
              </tr>
            ) : (
              timesheets.map(ts => (
                <tr key={ts._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{ts.project}</div>
                    <div className="text-sm text-gray-500">{ts.client}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(ts.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ts.hoursWorked}h</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ts.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {ts.status === 'draft' && (
                        <button
                          onClick={() => handleSubmit(ts._id)}
                          className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Submit
                        </button>
                      )}
                      {canApprove && ts.status === 'submitted' && (
                        <>
                          <button
                            onClick={() => handleApprove(ts._id)}
                            className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(ts._id)}
                            className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}