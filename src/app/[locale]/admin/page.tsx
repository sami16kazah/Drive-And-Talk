import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { EnrollmentContact } from '@/models/EnrollmentContact';
import { Course } from '@/models/Course';
import { SuccessStory } from '@/models/SuccessStory';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

async function getAdminMetrics() {
  try {
    await connectDB();
    const totalLeads = await EnrollmentContact.countDocuments();
    const pendingLeads = await EnrollmentContact.countDocuments({ status: 'pending' });
    const totalCourses = await Course.countDocuments({ isActive: true });
    const totalStories = await SuccessStory.countDocuments();

    return { totalLeads, pendingLeads, totalCourses, totalStories };
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return { totalLeads: 0, pendingLeads: 0, totalCourses: 0, totalStories: 0 };
  }
}

export default async function AdminDashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const session = await auth();

  // Redirect unauthenticated visitors
  if (!session || !session.user) {
    redirect(`/${locale}/admin/login`);
  }

  // Verify admin authorization
  const role = (session.user as any)?.role;
  if (role !== 'admin') {
    redirect(`/${locale}/admin/login?error=Unauthorized`);
  }

  const metrics = await getAdminMetrics();

  return (
    <div className="py-10 bg-gray-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full uppercase tracking-wider">
              Beheerderspaneel
            </span>
            <h1 className="text-3xl font-black text-brand-heading mt-1">
              Drive&amp;Talk Academy Beheer
            </h1>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Ingelogd als: <strong className="text-brand-heading">{session.user?.email}</strong>
          </div>
        </div>

        {/* Client Dashboard Component */}
        <AdminDashboardClient metrics={metrics} />
      </div>
    </div>
  );
}
