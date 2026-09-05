'use client';

import React, { useState, useEffect } from 'react';
import LockResetIcon from '@mui/icons-material/LockReset';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const AdminCredentialsForm: React.FC = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/credentials')
      .then((res) => res.json())
      .then((data) => {
        if (data.adminLoginEmail) {
          setAdminEmail(data.adminLoginEmail);
          setNewEmail(data.adminLoginEmail);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg(null);

    if (!newEmail.trim()) {
      setEmailMsg({ type: 'error', text: 'Voer een geldig e-mailadres in.' });
      return;
    }

    if (!currentPassword) {
      setEmailMsg({ type: 'error', text: 'Voer uw huidige wachtwoord in ter verificatie.' });
      return;
    }

    setLoadingEmail(true);

    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newEmail: newEmail.trim().toLowerCase(),
          currentPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Bijwerken van e-mail mislukt.');
      }

      setAdminEmail(data.adminLoginEmail);
      setEmailMsg({ type: 'success', text: 'Beheerders e-mailadres succesvol bijgewerkt in de database!' });
      setCurrentPassword('');
    } catch (err: any) {
      setEmailMsg({ type: 'error', text: err.message || 'Fout bij opslaan.' });
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (!currentPassword) {
      setPwdMsg({ type: 'error', text: 'Voer uw huidige wachtwoord in.' });
      return;
    }

    if (newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'Nieuw wachtwoord moet minimaal 6 tekens bevatten.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'error', text: 'De nieuwe wachtwoorden komen niet overeen.' });
      return;
    }

    setLoadingPassword(true);

    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Bijwerken van wachtwoord mislukt.');
      }

      setPwdMsg({ type: 'success', text: 'Wachtwoord succesvol gewijzigd in de database!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdMsg({ type: 'error', text: err.message || 'Fout bij wijzigen wachtwoord.' });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl shadow-card border border-gray-100 space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-lightMint text-brand-green rounded-2xl">
            <VpnKeyIcon fontSize="medium" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-heading">
              Beheerdersaccount &amp; Wachtwoord
            </h3>
            <p className="text-xs text-gray-500">
              Beheer het inlog e-mailadres en wachtwoord voor toegang tot dit dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Change Admin Email */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 text-brand-heading font-bold text-base border-b border-gray-100 pb-3">
            <EmailIcon className="text-brand-green" fontSize="small" />
            <span>Inlog E-mailadres Wijzigen</span>
          </div>

          {emailMsg && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                emailMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {emailMsg.type === 'success' ? (
                <CheckCircleOutlineIcon fontSize="small" />
              ) : (
                <ErrorOutlineIcon fontSize="small" />
              )}
              <span>{emailMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Huidig Actief Inlogadres
              </label>
              <input
                type="text"
                disabled
                value={adminEmail || 'Laden...'}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase tracking-wider mb-1">
                Nieuw E-mailadres *
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nieuw-admin@drivetalk.nl"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase tracking-wider mb-1">
                Huidig Wachtwoord ter Bevestiging *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loadingEmail}
              className="w-full py-3 bg-brand-green hover:bg-brand-hover text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <SaveIcon fontSize="small" />
              <span>{loadingEmail ? 'Bezig met opslaan...' : 'E-mailadres Bijwerken'}</span>
            </button>
          </form>
        </div>

        {/* Section 2: Change Admin Password */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 text-brand-heading font-bold text-base border-b border-gray-100 pb-3">
            <LockResetIcon className="text-brand-green" fontSize="small" />
            <span>Wachtwoord Wijzigen</span>
          </div>

          {pwdMsg && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                pwdMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {pwdMsg.type === 'success' ? (
                <CheckCircleOutlineIcon fontSize="small" />
              ) : (
                <ErrorOutlineIcon fontSize="small" />
              )}
              <span>{pwdMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase tracking-wider mb-1">
                Huidig Wachtwoord *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase tracking-wider mb-1">
                Nieuw Wachtwoord (min. 6 tekens) *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase tracking-wider mb-1">
                Bevestig Nieuw Wachtwoord *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full py-3 bg-brand-dark hover:bg-brand-heading text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <SaveIcon fontSize="small" />
              <span>{loadingPassword ? 'Bezig met wijzigen...' : 'Wachtwoord Wijzigen'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCredentialsForm;
