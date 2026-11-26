import Mailjet from 'node-mailjet';
import { connectDB } from './db';
import { Setting } from '@/models/Setting';
import { getGlobalContent } from './content';
import { whatsappLink, hexToRgbChannels } from './contentUtils';

function safeColor(value: string, fallback: string): string {
  return hexToRgbChannels(value) ? value : fallback;
}

function escapeHtml(value: string | undefined | null): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const apiKey = process.env.MAILJET_API_KEY || '';
const apiSecret = process.env.MAILJET_SECRET_KEY || '';

const mailjetClient = Mailjet.apiConnect(apiKey, apiSecret);

export async function getSiteSettings() {
  try {
    await connectDB();
    let settings = await Setting.findOne({ key: 'site_settings' });
    if (!settings) {
      settings = await Setting.create({
        key: 'site_settings',
        adminNotificationEmail: process.env.MAILJET_SENDER_EMAIL || 'info@drivetalk.nl',
        senderEmail: process.env.MAILJET_SENDER_EMAIL || 'info@drivetalk.nl',
        senderName: process.env.MAILJET_SENDER_NAME || 'Drive&Talk Academy',
      });
    }
    return settings;
  } catch (error) {
    console.error('Error fetching site settings from DB:', error);
    return {
      adminNotificationEmail: process.env.MAILJET_SENDER_EMAIL || 'info@drivetalk.nl',
      senderEmail: process.env.MAILJET_SENDER_EMAIL || 'info@drivetalk.nl',
      senderName: process.env.MAILJET_SENDER_NAME || 'Drive&Talk Academy',
    };
  }
}

export async function notifyAdminOfLead(leadData: {
  type: 'contact' | 'enrollment';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  courseTitle?: string;
}) {
  const settings = await getSiteSettings();
  const recipientEmail = settings.adminNotificationEmail || 'info@drivetalk.nl';
  const senderEmail = settings.senderEmail || 'info@drivetalk.nl';
  const senderName = settings.senderName || 'Drive&Talk Notification';
  const site = await getGlobalContent();
  const em = site.email;
  const primary = safeColor(site.theme.primaryColor, '#00B050');

  const subject = leadData.type === 'enrollment'
    ? `${em.notificationSubjectEnrollment} ${leadData.firstName} ${leadData.lastName}`
    : `${em.notificationSubjectContact} ${leadData.firstName} ${leadData.lastName}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: ${primary}; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">${escapeHtml(em.notificationTitle)}</h1>
        <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">${escapeHtml(em.notificationSubtitle)}</p>
      </div>
      <div style="padding: 24px; color: #1E293B;">
        <h2 style="color: #0F1F14; margin-top: 0;">${escapeHtml(subject)}</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px;">Name:</td>
            <td style="padding: 8px 0;">${escapeHtml(leadData.firstName)} ${escapeHtml(leadData.lastName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(leadData.email)}" style="color: ${primary};">${escapeHtml(leadData.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${escapeHtml(leadData.phone)}" style="color: ${primary};">${escapeHtml(leadData.phone)}</a></td>
          </tr>
          ${
            leadData.courseTitle
              ? `<tr>
                  <td style="padding: 8px 0; font-weight: bold;">Selected Course:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: ${primary};">${escapeHtml(leadData.courseTitle)}</td>
                </tr>`
              : ''
          }
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Notes/Message:</td>
            <td style="padding: 8px 0; background-color: #F8FAF7; padding: 12px; border-radius: 6px;">${escapeHtml(leadData.notes) || 'None provided'}</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #F8FAF7; padding: 16px 24px; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #e0e0e0;">
        ${escapeHtml(em.notificationFooter)}
      </div>
    </div>
  `;

  try {
    const result = await mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: senderName,
          },
          To: [
            {
              Email: recipientEmail,
              Name: 'Drive&Talk Admin',
            },
          ],
          Subject: subject,
          HTMLPart: htmlContent,
        },
      ],
    });
    return { success: true, result };
  } catch (error) {
    console.error('Mailjet notifyAdminOfLead error:', error);
    return { success: false, error };
  }
}

export async function sendAdminReplyToUser({
  toEmail,
  toName,
  replySubject,
  replyMessage,
}: {
  toEmail: string;
  toName: string;
  replySubject: string;
  replyMessage: string;
}) {
  const settings = await getSiteSettings();
  const senderEmail = settings.senderEmail || 'info@drivetalk.nl';
  const senderName = settings.senderName || 'Drive&Talk Academy';
  const site = await getGlobalContent();
  const em = site.email;
  const primary = safeColor(site.theme.primaryColor, '#00B050');
  const wa = whatsappLink(site.contact.whatsappNumber);
  const phone = escapeHtml(site.contact.phoneDisplay);
  const contactEmail = escapeHtml(site.contact.email);

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background-color: ${safeColor(site.theme.darkColor, '#1A2E20')}; padding: 28px; text-align: center;">
        <h1 style="color: ${primary}; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 2px;">${escapeHtml(em.headerTitle)}</h1>
        <p style="color: #E2E8F0; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">${escapeHtml(em.headerSubtitle)}</p>
      </div>

      <!-- Body Content -->
      <div style="padding: 32px; color: #1E293B; line-height: 1.6;">
        <h3 style="color: #0F1F14; margin-top: 0; font-size: 18px;">${escapeHtml(em.greeting)} ${escapeHtml(toName)},</h3>
        <div style="font-size: 15px; color: #334155; margin-bottom: 24px; white-space: pre-wrap;">${escapeHtml(replyMessage)}</div>

        <div style="margin-top: 32px; padding: 16px; background-color: #EAF5EE; border-left: 4px solid ${primary}; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #0F1F14; font-size: 14px;">${escapeHtml(em.followUpTitle)}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #334155;">
            ${escapeHtml(em.followUpText)}
            <a href="${wa}" style="color: ${primary}; font-weight: bold; text-decoration: underline;">${phone}</a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #F8FAF7; padding: 24px; border-top: 1px solid #E2E8F0; font-size: 13px; color: #475569;">
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div>
            <strong style="color: #0F1F14;">${escapeHtml(em.notificationTitle)}</strong><br />
            ${escapeHtml(em.emailLabel)}: <a href="mailto:${contactEmail}" style="color: ${primary};">${contactEmail}</a><br />
            ${escapeHtml(em.phoneLabel)}: <a href="${wa}" style="color: ${primary};">${phone}</a>
          </div>
          <div style="margin-top: 12px;">
            <strong style="color: #0F1F14;">${escapeHtml(em.hoursLabel)}</strong><br />
            ${escapeHtml(em.hoursText)}
          </div>
        </div>
        <div style="margin-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #CBD5E1; padding-top: 12px;">
          &copy; ${new Date().getFullYear()} ${escapeHtml(em.copyright)}
        </div>
      </div>
    </div>
  `;

  try {
    const result = await mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: senderName,
          },
          To: [
            {
              Email: toEmail,
              Name: toName,
            },
          ],
          Subject: replySubject,
          HTMLPart: htmlContent,
        },
      ],
    });
    return { success: true, result };
  } catch (error) {
    console.error('Mailjet sendAdminReplyToUser error:', error);
    return { success: false, error };
  }
}
