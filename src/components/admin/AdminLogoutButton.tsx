'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-slate-500 hover:text-red-400 p-2 hover:bg-slate-800 rounded-lg transition-all"
      title="Logout"
      aria-label="Admin Logout"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
