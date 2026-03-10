import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchInvoices,
  createInvoice,
  updateStatus,
} from '../services/invoiceService';
import StatusBadge from '../components/ui/StatusBadge';

export default function Invoices() {
  const { canGenerate } = useAuth();
  const [invoices,  setInvoices]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [form, setForm] = useState({
    clientName:  '',
    clientEmail: '',
    projectName: '',
    dueDate:     '',
    tax:         0,
    notes:       '',
    lineItems:   [{ description: '', hours: 0, rate: 0, amount: 0 }],
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await fetchInvoices();
      setInvoices(res.data);
    } catch (err) {
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const updated = [...form.lineItems];
    updated[index][field] = value;
    if (field === 'hours' || field === 'rate') {
      updated[index].amount = updated[index].hours * updated[index].rate;
    }
    setForm({ ...form, lineItems: updated });
  };

  const addLineItem = () => {
    setForm({
      ...form,
      lineItems: [...form.lineItems, { description: '', hours: 0, rate: 0, amount: 0 }],
    });
  };

  const handleCreate = async () => {
    try {
      await createInvoice(form);
      setShowForm(false);
      setForm({
        clientName: '', clientEmail: '', projectName: '',
        dueDate: '', tax: 0, notes: '',
        lineItems: [{ description: '', hours: 0, rate: 0, amount: 0 }],
      });
      loadInvoices();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create invoice');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status);
      loadInvoices();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">Manage client invoices</p>
        </div>
        {canGenerate && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Invoice'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">New Invoice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                value={form.clientName}
                onChange={e => setForm({ ...form, clientName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={e => setForm({ ...form, clientEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="client@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={form.projectName}
                onChange={e => setForm({ ...form, projectName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax %</label>
              <input
                type="number"
                value={form.tax}
                onChange={e => setForm({ ...form, tax: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Optional notes"
              />
            </div>
          </div>

          <h3 className="text-md font-semibold text-gray-700 mb-3">Line Items</h3>
          {form.lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 mb-2">
              <input
                type="text"
                value={item.description}
                onChange={e => handleLineItemChange(index, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Description"
              />
              <input
                type="number"
                value={item.hours}
                onChange={e => handleLineItemChange(index, 'hours', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Hours"
              />
              <input
                type="number"
                value={item.rate}
                onChange={e => handleLineItemChange(index, 'rate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
               placeholder="Rate $"
              />
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                ${item.amount}
              </div>
            </div>
          ))}
          <button
            onClick={addLineItem}
            className="text-sm text-indigo-600 hover:text-indigo-700 mt-2"
          >
            + Add Line Item
          </button>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleCreate}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Create Invoice
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Invoice</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              {canGenerate && (
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No invoices yet.
                </td>
              </tr>
            ) : (
              invoices.map(inv => (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{inv.invoiceNumber}</div>
                    <div className="text-sm text-gray-500">{inv.projectName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inv.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">${inv.total}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  {canGenerate && (
                    <td className="px-6 py-4">
                      <select
                        value={inv.status}
                        onChange={e => handleStatusChange(inv._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}