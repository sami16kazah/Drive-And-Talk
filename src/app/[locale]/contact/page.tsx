'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ContactPage() {
  const t = useTranslations('Contact');
  const tInfo = useTranslations('SchoolInfo');

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
        throw new Error(data.error || t('error'));
      }

      setSubmitted(true);
      setForm({ firstName: '', lastName: '', email: '', phone: '', notes: '' });
    } catch (err: any) {
      setErrorMsg(err.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-4 py-1.5 bg-brand-lightMint text-brand-green font-extrabold text-xs rounded-full uppercase tracking-wider">
            Contact
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-brand-heading">{t('title')}</h1>
          <p className="text-base text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-card border border-gray-100 space-y-6">
            <h3 className="text-2xl font-bold text-brand-heading">{t('formTitle')}</h3>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircleIcon className="text-brand-green text-5xl" />
                <h4 className="text-xl font-bold text-brand-heading">Bericht Verzonden!</h4>
                <p className="text-sm text-gray-600">{t('success')}</p>
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
                      placeholder="Jan"
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
                      placeholder="De Vries"
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
                      placeholder="jan@example.nl"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                      Telefoonnummer (WhatsApp) *
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
                    Uw Bericht *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Stel hier uw vraag..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-green hover:bg-brand-hover text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <SendIcon fontSize="small" />
                  <span>{loading ? t('sending') : t('submit')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Embedded Contact Info & WhatsApp CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-dark text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h3 className="text-2xl font-bold text-brand-green">Contactgegevens</h3>

              <div className="space-y-4 text-sm text-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl text-brand-green">
                    <EmailIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">E-mail</p>
                    <a href="mailto:info@drivetalk.nl" className="hover:text-brand-green font-bold">
                      info@drivetalk.nl
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#25D366]/20 rounded-xl text-[#25D366]">
                    <WhatsAppIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">WhatsApp / Telefoon</p>
                    <a
                      href="https://wa.me/31628468247"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-green font-bold"
                    >
                      +31 6 28468247
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl text-brand-green">
                    <AccessTimeIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Openingstijden</p>
                    <p className="font-bold">{tInfo('hours')}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <a
                  href="https://wa.me/31628468247"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold rounded-2xl shadow-lg transition-all"
                >
                  <WhatsAppIcon />
                  <span>Start WhatsApp Gesprek</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
