'use client';

import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, ShieldCheck, Loader } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  status: 'active' | 'blocked';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (e) {
      console.error('Failed to load customers', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'blocked') => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    const actionStr = newStatus === 'blocked' ? 'block' : 'unblock';
    if (!confirm(`Are you sure you want to ${actionStr} this customer? They will not be able to log in.`)) return;

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomers(
          customers.map((c) => (c._id === id ? { ...c, status: data.customer.status } : c))
        );
      }
    } catch (e) {
      console.error('Failed to toggle customer status', e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border-default pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Customer Management</h1>
        <p className="text-sm text-brand-text-secondary mt-1">View registered store customers and toggle account access status</p>
      </div>

      {/* Customers Table list */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 bg-brand-surface/35 border border-dashed border-border-default rounded-2xl">
          <p className="text-brand-text-secondary text-sm">No customers registered yet.</p>
        </div>
      ) : (
        <div className="bg-brand-surface border border-border-default rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-brand-deep border-b border-slate-850 text-brand-text-secondary font-bold uppercase tracking-wider">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Date Joined</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {customers.map((cust, index) => {
                const isBlocked = cust.status === 'blocked';
                const date = new Date(cust.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr key={cust._id} className="hover:bg-slate-955/20 transition-all text-slate-200">
                    <td className="p-4 text-center font-semibold text-brand-text-tertiary">{index + 1}</td>
                    <td className="p-4 font-semibold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent-bright" />
                      <span>{cust.name}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-450">{cust.email}</td>
                    <td className="p-4 text-brand-text-secondary">{date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold border ${
                        isBlocked
                          ? 'bg-red-955/20 text-red-400 border-red-900/30'
                          : 'bg-emerald-955/20 text-emerald-400 border-emerald-900/30'
                      }`}>
                        {isBlocked ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        <span className="capitalize">{cust.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {updatingId === cust._id ? (
                        <Loader className="w-4 h-4 text-indigo-500 animate-spin mr-3 inline-block" />
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(cust._id, cust.status)}
                          className={`font-semibold py-1 px-3 rounded-lg text-[10px] uppercase border transition-colors inline-block ${
                            isBlocked
                              ? 'bg-emerald-650/15 border-emerald-900/35 text-emerald-400 hover:bg-emerald-650/30'
                              : 'bg-red-650/15 border-red-900/35 text-red-400 hover:bg-red-650/30'
                          }`}
                        >
                          {isBlocked ? 'Activate User' : 'Block User'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
