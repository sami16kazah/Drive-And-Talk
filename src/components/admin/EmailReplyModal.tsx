'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import SendIcon from '@mui/icons-material/Send';

interface EmailReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  recipientEmail: string;
  recipientName: string;
  onReplySuccess: () => void;
}

export const EmailReplyModal: React.FC<EmailReplyModalProps> = ({
  isOpen,
  onClose,
  leadId,
  recipientEmail,
  recipientName,
  onReplySuccess,
}) => {
  const [subject, setSubject] = useState(`Drive&Talk Academy - Reactie op uw aanvraag`);
  const [message, setMessage] = useState(
    `Beste ${recipientName},\n\nHartelijk dank voor uw interesse in Drive&Talk Academy!\n\nWij hebben uw bericht goed ontvangen. Voor het inplannen van een intakegesprek of aanvullende informatie over de cursus, staan we u graag te woord.\n\nMet vriendelijke groet,\nHet Drive&Talk Team`
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/leads/${leadId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replySubject: subject.trim(),
          replyMessage: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send email reply');
      }

      setSuccessMsg('E-mail succesvol verzonden via Mailjet!');
      setTimeout(() => {
        setSuccessMsg('');
        onReplySuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Beantwoorden via E-mail (Mailjet)`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{errorMsg}</div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 font-bold rounded-lg text-sm">
            {successMsg}
          </div>
        )}

        <div className="p-3 bg-brand-mint rounded-xl text-xs space-y-1">
          <p>
            <strong className="text-brand-heading">Ontvanger:</strong> {recipientName} &lt;
            {recipientEmail}&gt;
          </p>
          <p>
            <strong className="text-brand-heading">Verzender:</strong> Mailjet Service (info@drivetalk.nl)
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
            Onderwerp *
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
            Bericht *
          </label>
          <textarea
            rows={8}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm resize-y"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-brand-green hover:bg-brand-hover text-white font-bold text-sm rounded-xl shadow transition-all disabled:opacity-50"
          >
            <SendIcon fontSize="small" />
            <span>{loading ? 'Verzenden...' : 'E-mail Verzenden'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmailReplyModal;
