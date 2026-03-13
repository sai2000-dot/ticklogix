import React, { useState, useEffect } from 'react';
import { fetchUsers, updateUser } from '../services/userService';
import StatusBadge from '../components/ui/StatusBadge';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await fetchUsers();
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await updateUser(id, { isActive: !currentStatus });
      loadEmployees();
    } catch (err) {
      setError('Failed to update employee');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUser(id, { role });
      loadEmployees();
    } catch (err) {
      setError('Failed to update role');
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <p className="text-gray-500 text-sm mt-1">
          {employees.length} total employees
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(emp => (
          <div
            key={emp._id}
            className={`bg-white rounded-xl border p-5 ${
              emp.isActive ? 'border-gray-200' : 'border-red-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {emp.firstName?.[0]}{emp.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {emp.firstName} {emp.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{emp.email}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                emp.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}>
                {emp.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Username</span>
                <span className="text-gray-800 font-medium">{emp.username}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Department</span>
                <span className="text-gray-800 font-medium">
                  {emp.department || '—'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Role</span>
                <select
                  value={emp.role}
                  onChange={e => handleRoleChange(emp._id, e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => handleToggleActive(emp._id, emp.isActive)}
              className={`w-full text-sm py-2 rounded-lg font-medium transition-colors ${
                emp.isActive
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              {emp.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}