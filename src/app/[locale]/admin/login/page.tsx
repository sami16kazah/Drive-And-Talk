'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useLocale } from 'next-intl';
import Logo from '@/components/ui/Logo';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';

export default function AdminLoginPage() {
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('admin-credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg('Ongeldige inloggegevens. Controleer uw e-mailadres en wachtwoord.');
      } else {
        // Navigate cleanly to the admin dashboard
        window.location.href = `/${locale}/admin`;
      }
    } catch (err: any) {
      setErrorMsg('Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gray-50 flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-gray-200/80 p-8 sm:p-10 space-y-7">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <Logo showSubtitle={true} size="md" />
          <div className="pt-1">
            <h1 className="text-2xl font-black text-brand-heading">Beheerdersportaal</h1>
            <p className="text-xs text-gray-500 mt-1">
              Beveiligde toegang voor geautoriseerd personeel
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Production Credentials Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-heading uppercase tracking-wider mb-1.5">
              E-mailadres
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@drivetalk.nl"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-heading uppercase tracking-wider mb-1.5">
              Wachtwoord
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-green hover:bg-brand-hover text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LockOutlinedIcon fontSize="small" />
            <span>{loading ? 'Bezig met verifiëren...' : 'Inloggen'}</span>
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">
            of
          </span>
          <div className="border-t border-gray-200 w-full" />
        </div>

        {/* Google OAuth Option */}
        <div>
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: `/${locale}/admin` })}
            className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-300 text-brand-heading text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2.5 shadow-sm"
          >
            <GoogleIcon fontSize="small" />
            <span>Inloggen met Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
