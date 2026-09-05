'use client';

import React, { useState } from 'react';
import AdminMetrics from './AdminMetrics';
import LeadsInbox from './LeadsInbox';
import CourseManager from './CourseManager';
import StoryManager from './StoryManager';
import SettingsForm from './SettingsForm';
import InboxIcon from '@mui/icons-material/Inbox';
import SchoolIcon from '@mui/icons-material/School';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SettingsIcon from '@mui/icons-material/Settings';

interface AdminDashboardClientProps {
  metrics: {
    totalLeads: number;
    pendingLeads: number;
    totalCourses: number;
    totalStories: number;
  };
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ metrics }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'courses' | 'stories' | 'settings'>('inbox');

  const tabs = [
    { id: 'inbox', label: 'Inschrijvingen & Inbox', icon: <InboxIcon fontSize="small" /> },
    { id: 'courses', label: 'Cursusbeheer', icon: <SchoolIcon fontSize="small" /> },
    { id: 'stories', label: 'Succesverhalen', icon: <AutoAwesomeIcon fontSize="small" /> },
    { id: 'settings', label: 'E-mail Instellingen', icon: <SettingsIcon fontSize="small" /> },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Top Metrics Cards */}
      <AdminMetrics
        totalLeads={metrics.totalLeads}
        pendingLeads={metrics.pendingLeads}
        totalCourses={metrics.totalCourses}
        totalStories={metrics.totalStories}
      />

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-brand-green text-white shadow-md'
                  : 'text-gray-600 hover:text-brand-heading hover:bg-brand-mint'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'inbox' && <LeadsInbox />}
        {activeTab === 'courses' && <CourseManager />}
        {activeTab === 'stories' && <StoryManager />}
        {activeTab === 'settings' && <SettingsForm />}
      </div>
    </div>
  );
};

export default AdminDashboardClient;
