'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from '@/i18n/routing';
import Logo from '@/components/ui/Logo';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import GoogleIcon from '@mui/icons-material/Google';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('info@drivetalk.nl');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('admin-credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg('Ongeldige inloggegevens. Controleer e-mail en wachtwoord.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg('Er is een fout opgetreden bij het inloggen.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDevLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await signIn('admin-credentials', {
        email: 'info@drivetalk.nl',
        password: 'admin123',
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg('Snelle toegang mislukt.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg('Fout bij snelle toegang.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-mint/40 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-brand-green/20 p-8 sm:p-10 space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <Logo showSubtitle={true} />
          <div className="pt-2">
            <h2 className="text-2xl font-black text-brand-heading">Beheerdersportaal</h2>
            <p className="text-xs text-gray-500 mt-1">
              Log in om het Drive&amp;Talk Academy dashboard te beheren
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Instant Developer / Admin Access */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <FlashOnIcon fontSize="small" className="text-brand-green" />
            <span>Snelle Beheerder Toegang (1-Klik)</span>
          </div>
          <p className="text-[11px] text-emerald-700">
            Log direct in als beheerder met <code className="font-mono bg-white px-1 py-0.5 rounded">info@drivetalk.nl</code>.
          </p>
          <button
            type="button"
            onClick={handleQuickDevLogin}
            disabled={loading}
            className="w-full py-2.5 bg-brand-green hover:bg-brand-hover text-white text-xs font-black rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
          >
            <LockOutlinedIcon fontSize="small" />
            <span>Direct Inloggen als Admin</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">
            of handmatig
          </span>
          <div className="border-t border-gray-200 w-full" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
              Admin E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@drivetalk.nl"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
              Wachtwoord
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              Standaard wachtwoord: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">admin123</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-dark hover:bg-brand-heading text-white font-bold text-sm rounded-xl shadow transition-all disabled:opacity-50"
          >
            {loading ? 'Bezig met inloggen...' : 'Inloggen'}
          </button>
        </form>

        {/* Google OAuth Option */}
        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/admin' })}
            className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-brand-heading text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <GoogleIcon fontSize="small" />
            <span>Inloggen met Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
