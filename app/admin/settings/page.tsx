'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme';
import { utils, writeFileXLSX } from 'xlsx';

interface AdminProfile {
  email: string;
  role: string;
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { theme, setTheme } = useTheme();
  // Notification toggle (dummy, for UI only)
  const [notif, setNotif] = useState(true);
  // Form state
  const [emailInput, setEmailInput] = useState(profile?.email || '');
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwError, setPwError] = useState('');
  const [emailMsg, setEmailMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('id', session.user.id)
        .single();
      if (error || !data) {
        setProfile(null);
      } else {
        setProfile({ email: data.email, role: data.role });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Update email handler
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg('');
    if (!emailInput || !profile) return;
    if (emailInput === profile.email) {
      setEmailMsg('Email tidak berubah.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ email: emailInput });
    if (error) setEmailMsg('Gagal update email.');
    else setEmailMsg('Email berhasil diupdate (cek inbox untuk verifikasi).');
  };

  // Ganti password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (!pw1 || !pw2) {
      setPwError('Password tidak boleh kosong.');
      return;
    }
    if (pw1 !== pw2) {
      setPwError('Password tidak sama.');
      return;
    }
    if (pw1.length < 6) {
      setPwError('Password minimal 6 karakter.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    if (error) setPwError('Gagal update password.');
    else setPwError('Password berhasil diupdate.');
    setPw1(''); setPw2('');
  };

  // Export data
  const handleExport = async () => {
    const res = await fetch('/api/orders?export=json');
    if (!res.ok) {
      alert('Gagal export data');
      return;
    }
    const orders = await res.json();
    // Flatten data
    const rows = orders.map((order: any) => ({
      ID: order.id,
      Customer: order.customer_name,
      Phone: order.customer_phone,
      Date: order.created_at,
      Delivery: order.delivery_date,
      Amount: order.total_amount,
      Status: order.status,
      Payment: order.payment_status,
    }));
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Orders');
    writeFileXLSX(wb, 'orders.xlsx');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-8 border border-gray-100 dark:border-gray-800 space-y-8 text-gray-900 dark:text-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Admin Settings</h1>
        {/* Profil */}
        {profile ? (
          <div className="mb-6">
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Email:</span> <span className="text-gray-800">{profile.email}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Role:</span> <span className="text-gray-800 capitalize">{profile.role}</span>
            </div>
          </div>
        ) : (
          <div className="text-red-500 mb-4">Failed to load profile.</div>
        )}
        {/* Update Email */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-2">Update Email</h2>
          <form onSubmit={handleUpdateEmail} className="flex gap-2 items-center">
            <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} className="border rounded px-2 py-1 flex-1" required />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Update</button>
          </form>
          {emailMsg && <div className="text-xs mt-1 text-gray-500">{emailMsg}</div>}
        </section>
        {/* Ganti Password */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-2">Ganti Password</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-2 max-w-xs">
            <input type="password" placeholder="Password baru" value={pw1} onChange={e => setPw1(e.target.value)} className="border rounded px-2 py-1" required />
            <input type="password" placeholder="Ulangi password" value={pw2} onChange={e => setPw2(e.target.value)} className="border rounded px-2 py-1" required />
            <button type="submit" className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700">Update Password</button>
          </form>
          {pwError && <div className={`text-xs mt-1 ${pwError.includes('berhasil') ? 'text-green-600' : 'text-red-500'}`}>{pwError}</div>}
        </section>
        {/* Notifikasi */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-2">Notifikasi</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={notif} onChange={() => setNotif(v => !v)} className="accent-orange-600" />
            <span>Aktifkan notifikasi order baru</span>
          </label>
        </section>
        {/* Preferensi Tampilan */}
        <section>
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Preferensi Tampilan</h2>
          <div className="flex gap-4">
            <button type="button" onClick={() => setTheme('light')} className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100'}`}>Light</button>
            <button type="button" onClick={() => setTheme('dark')} className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100'}`}>Dark</button>
          </div>
        </section>
        {/* Export Data */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-2">Export Data</h2>
          <button onClick={handleExport} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Export (CSV)</button>
        </section>
        {/* Logout */}
        <section className="pt-4 border-t">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-semibold"
          >
            Logout
          </button>
        </section>
      </div>
    </>
  );
} 