'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const QuickInquiryForm: React.FC = () => {
  const t = useTranslations('Home');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSubmitted(false);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          ...form,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Fout bij het versturen van uw aanvraag');
      }

      setSubmitted(true);
      setForm({ firstName: '', lastName: '', email: '', phone: '', notes: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Fout bij het versturen van uw aanvraag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-brand-mint border-y border-brand-green/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-card border border-brand-green/20 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-brand-heading">
              {t('quickInquiryTitle')}
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              {t('quickInquirySubtitle')}
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircleIcon className="text-brand-green text-4xl" />
              <h4 className="text-lg font-bold text-brand-heading">Aanvraag Ontvangen!</h4>
              <p className="text-xs text-gray-600">
                Bedankt voor uw bericht. Ons team neemt binnen 24 uur contact met u op via e-mail of WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">{errorMsg}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                    Voornaam *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="Uw voornaam"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                    Achternaam *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Uw achternaam"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                    E-mailadres *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="naam@voorbeeld.nl"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                    Telefoon (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+31 6 12345678"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                  Vragen of Gewenste Cursus
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Bijvoorbeeld: Nederlands B1 of CBR Theorie in het Engels..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-green hover:bg-brand-hover text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <SendIcon fontSize="small" />
                <span>{loading ? 'Verzenden...' : 'Gratis Adviesgesprek Aanvragen'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickInquiryForm;
