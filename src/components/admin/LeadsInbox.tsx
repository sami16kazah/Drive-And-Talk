'use client';

import React, { useState, useEffect } from 'react';
import EmailReplyModal from './EmailReplyModal';
import ReplyIcon from '@mui/icons-material/Reply';
import ArchiveIcon from '@mui/icons-material/Archive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Modal from '@/components/ui/Modal';

export interface ILead {
  _id: string;
  type: 'contact' | 'enrollment';
  courseId?: {
    _id: string;
    title: { en: string; nl: string };
    slug: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  status: 'pending' | 'replied' | 'archived';
  replyHistory: { message: string; subject: string; sentAt: string }[];
  createdAt: string;
}

export const LeadsInbox: React.FC = () => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'replied' | 'archived'>('all');

  const [selectedLeadForReply, setSelectedLeadForReply] = useState<ILead | null>(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<ILead | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leads?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: 'pending' | 'replied' | 'archived') => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchLeads();
    } catch (err) {
      console.error('Update lead status error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-brand-heading">Inschrijvingen &amp; Berichten Inbox</h3>
          <p className="text-xs text-gray-500">Overzicht van alle binnengekomen contactaanvragen en inschrijvingen.</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
          {(['all', 'pending', 'replied', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-white text-brand-heading shadow-sm'
                  : 'text-gray-500 hover:text-brand-heading'
              }`}
            >
              {st === 'all'
                ? 'Alles'
                : st === 'pending'
                ? 'In behandeling'
                : st === 'replied'
                ? 'Beantwoord'
                : 'Gearchiveerd'}
            </button>
          ))}
        </div>
      </div>

      {/* Inbox Table */}
      {loading ? (
        <div className="py-12 text-center text-gray-400">Aanvragen laden...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-mint text-brand-heading font-bold text-xs uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Naam &amp; Type</th>
                  <th className="px-6 py-4">Contactgegevens</th>
                  <th className="px-6 py-4">Cursus</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Datum</th>
                  <th className="px-6 py-4 text-right">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      Geen aanvragen gevonden in deze categorie.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-brand-heading">
                          {lead.firstName} {lead.lastName}
                        </div>
                        <span
                          className={`inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                            lead.type === 'enrollment'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-gray-700">{lead.email}</p>
                        <p className="text-xs text-gray-400">{lead.phone}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-brand-green">
                        {lead.courseId?.title?.nl || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            lead.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : lead.status === 'replied'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {lead.status === 'pending'
                            ? 'In behandeling'
                            : lead.status === 'replied'
                            ? 'Beantwoord'
                            : 'Gearchiveerd'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Details bekijken"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => setSelectedLeadForReply(lead)}
                          className="p-1.5 text-brand-green hover:bg-emerald-50 rounded-lg font-bold"
                          title="Beantwoorden via E-mail"
                        >
                          <ReplyIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              lead._id,
                              lead.status === 'archived' ? 'pending' : 'archived'
                            )
                          }
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                          title={lead.status === 'archived' ? 'Herstellen' : 'Archiveren'}
                        >
                          <ArchiveIcon fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {selectedLeadForReply && (
        <EmailReplyModal
          isOpen={!!selectedLeadForReply}
          onClose={() => setSelectedLeadForReply(null)}
          leadId={selectedLeadForReply._id}
          recipientEmail={selectedLeadForReply.email}
          recipientName={`${selectedLeadForReply.firstName} ${selectedLeadForReply.lastName}`}
          onReplySuccess={fetchLeads}
        />
      )}

      {/* Lead Detail Modal */}
      {selectedLeadForDetail && (
        <Modal
          isOpen={!!selectedLeadForDetail}
          onClose={() => setSelectedLeadForDetail(null)}
          title="Aanvraag Details"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm bg-brand-mint p-4 rounded-xl">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Naam</p>
                <p className="font-bold text-brand-heading">
                  {selectedLeadForDetail.firstName} {selectedLeadForDetail.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Type Aanvraag</p>
                <p className="font-bold text-brand-green uppercase">{selectedLeadForDetail.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">E-mail</p>
                <p className="font-medium text-gray-700">{selectedLeadForDetail.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Telefoon</p>
                <p className="font-medium text-gray-700">{selectedLeadForDetail.phone}</p>
              </div>
            </div>

            {selectedLeadForDetail.courseId && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
                <span className="font-bold text-emerald-800">Geselecteerde Cursus: </span>
                <span className="font-semibold text-emerald-900">
                  {selectedLeadForDetail.courseId.title.nl}
                </span>
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">Opmerkingen / Bericht</p>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">
                {selectedLeadForDetail.notes || 'Geen opmerkingen ingevuld.'}
              </div>
            </div>

            {/* Reply History */}
            {selectedLeadForDetail.replyHistory.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">Verzonden Antwoorden</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedLeadForDetail.replyHistory.map((rep, idx) => (
                    <div key={idx} className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs">
                      <div className="flex justify-between font-bold text-blue-900 mb-1">
                        <span>{rep.subject}</span>
                        <span>{new Date(rep.sentAt).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{rep.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedLeadForReply(selectedLeadForDetail);
                  setSelectedLeadForDetail(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-green text-white font-bold text-xs rounded-xl shadow"
              >
                <ReplyIcon fontSize="small" />
                <span>Beantwoorden via Mailjet</span>
              </button>
              <button
                onClick={() => setSelectedLeadForDetail(null)}
                className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Sluiten
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeadsInbox;
