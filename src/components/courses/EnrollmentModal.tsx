'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Modal from '@/components/ui/Modal';
import SendIcon from '@mui/icons-material/Send';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  courseTitle?: string;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}) => {
  const t = useTranslations('EnrollmentModal');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'enrollment',
          courseId: courseId || undefined,
          ...formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t('error'));
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: '',
      });
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={courseTitle ? `${t('title')}: ${courseTitle}` : t('title')}
      maxWidth="lg"
    >
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-brand-green rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h4 className="text-xl font-bold text-brand-heading">Aanvraag Ontvangen!</h4>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">{t('success')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                {t('firstName')} *
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                {t('lastName')} *
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="De Vries"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                {t('email')} *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jan@example.nl"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
                {t('phone')} *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+31 6 12345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-heading uppercase mb-1">
              {t('notes')}
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Welke dagen schikken het beste? Vragen..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-brand-green hover:bg-brand-hover text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <SendIcon fontSize="small" />
              <span>{loading ? t('sending') : t('submit')}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EnrollmentModal;
