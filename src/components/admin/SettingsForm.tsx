'use client';

import React, { useState, useEffect } from 'react';
import SaveIcon from '@mui/icons-material/Save';

export const SettingsForm: React.FC = () => {
  const [form, setForm] = useState({
    adminNotificationEmail: 'info@drivetalk.nl',
    senderEmail: 'info@drivetalk.nl',
    senderName: 'Drive&Talk Academy',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setForm({
          adminNotificationEmail: data.adminNotificationEmail || 'info@drivetalk.nl',
          senderEmail: data.senderEmail || 'info@drivetalk.nl',
          senderName: data.senderName || 'Drive&Talk Academy',
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update settings');
      }

      setMsg({ type: 'success', text: 'Instellingen succesvol bijgewerkt in MongoDB!' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Error updating settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded-2xl shadow-card border border-gray-100 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-heading">Academie E-mail &amp; Systeeminstellingen</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Pas het e-mailadres aan waarop admin notificaties binnenkomen en de afzendergegevens voor Mailjet.
        </p>
      </div>

      {loading ? (
        <div className="py-8 text-center text-gray-400">Instellingen laden...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {msg && (
            <div
              className={`p-3 rounded-xl text-sm font-semibold ${
                msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {msg.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
              Admin Notificatie E-mail *
            </label>
            <input
              type="email"
              required
              value={form.adminNotificationEmail}
              onChange={(e) => setForm({ ...form, adminNotificationEmail: e.target.value })}
              placeholder="info@drivetalk.nl"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Alle nieuwe inschrijvingen en contactaanvragen worden automatisch naar dit adres gemaild via Mailjet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                Mailjet Afzender E-mail *
              </label>
              <input
                type="email"
                required
                value={form.senderEmail}
                onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
                placeholder="info@drivetalk.nl"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                Mailjet Afzendernaam *
              </label>
              <input
                type="text"
                required
                value={form.senderName}
                onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                placeholder="Drive&Talk Academy"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-green hover:bg-brand-hover text-white font-bold text-sm rounded-xl shadow transition-all disabled:opacity-50"
            >
              <SaveIcon fontSize="small" />
              <span>{saving ? 'Opslaan...' : 'Wijzigingen Opslaan'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsForm;
