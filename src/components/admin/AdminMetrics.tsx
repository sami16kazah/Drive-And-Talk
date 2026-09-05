'use client';

import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import SchoolIcon from '@mui/icons-material/School';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AdminMetricsProps {
  totalLeads: number;
  pendingLeads: number;
  totalCourses: number;
  totalStories: number;
}

export const AdminMetrics: React.FC<AdminMetricsProps> = ({
  totalLeads,
  pendingLeads,
  totalCourses,
  totalStories,
}) => {
  const cards = [
    {
      title: 'Totale Aanvragen',
      value: totalLeads,
      icon: <PeopleIcon className="text-blue-600 text-3xl" />,
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'In Behandeling',
      value: pendingLeads,
      icon: <MarkEmailUnreadIcon className="text-amber-600 text-3xl" />,
      bg: 'bg-amber-50 border-amber-100',
    },
    {
      title: 'Actieve Cursussen',
      value: totalCourses,
      icon: <SchoolIcon className="text-emerald-600 text-3xl" />,
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Succesverhalen',
      value: totalStories,
      icon: <AutoAwesomeIcon className="text-purple-600 text-3xl" />,
      bg: 'bg-purple-50 border-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-6 rounded-2xl border ${card.bg} shadow-sm flex items-center justify-between`}
        >
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {card.title}
            </p>
            <h3 className="text-3xl font-extrabold text-brand-heading mt-1">{card.value}</h3>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm">{card.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default AdminMetrics;
