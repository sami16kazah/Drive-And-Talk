import Mailjet from 'node-mailjet';
import { connectDB } from './db';
import { Setting } from '@/models/Setting';

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

  const subject = leadData.type === 'enrollment'
    ? `[Drive&Talk] New Course Enrollment Request: ${leadData.firstName} ${leadData.lastName}`
    : `[Drive&Talk] New Contact Inquiry from ${leadData.firstName} ${leadData.lastName}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #00B050; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">Drive&amp;Talk Academy</h1>
        <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">New Lead Notification</p>
      </div>
      <div style="padding: 24px; color: #1E293B;">
        <h2 style="color: #0F1F14; margin-top: 0;">${subject}</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px;">Name:</td>
            <td style="padding: 8px 0;">${leadData.firstName} ${leadData.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${leadData.email}" style="color: #00B050;">${leadData.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${leadData.phone}" style="color: #00B050;">${leadData.phone}</a></td>
          </tr>
          ${
            leadData.courseTitle
              ? `<tr>
                  <td style="padding: 8px 0; font-weight: bold;">Selected Course:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #00B050;">${leadData.courseTitle}</td>
                </tr>`
              : ''
          }
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Notes/Message:</td>
            <td style="padding: 8px 0; background-color: #F8FAF7; padding: 12px; border-radius: 6px;">${leadData.notes || 'None provided'}</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #F8FAF7; padding: 16px 24px; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #e0e0e0;">
        Automated notification from Drive&amp;Talk Academy Web System
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

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background-color: #1A2E20; padding: 28px; text-align: center;">
        <h1 style="color: #00B050; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 2px;">DRIVE &amp; TALK</h1>
        <p style="color: #E2E8F0; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">English &middot; Dutch &middot; Driving</p>
      </div>

      <!-- Body Content -->
      <div style="padding: 32px; color: #1E293B; line-height: 1.6;">
        <h3 style="color: #0F1F14; margin-top: 0; font-size: 18px;">Beste ${toName},</h3>
        <div style="font-size: 15px; color: #334155; margin-bottom: 24px; white-space: pre-wrap;">${replyMessage}</div>

        <div style="margin-top: 32px; padding: 16px; background-color: #EAF5EE; border-left: 4px solid #00B050; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #0F1F14; font-size: 14px;">Heeft u direct aanvullende vragen?</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #334155;">
            Stuur ons een bericht via WhatsApp: 
            <a href="https://wa.me/31628468247" style="color: #00B050; font-weight: bold; text-decoration: underline;">+31 6 28468247</a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #F8FAF7; padding: 24px; border-top: 1px solid #E2E8F0; font-size: 13px; color: #475569;">
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div>
            <strong style="color: #0F1F14;">Drive&amp;Talk Academy</strong><br />
            Email: <a href="mailto:info@drivetalk.nl" style="color: #00B050;">info@drivetalk.nl</a><br />
            WhatsApp / Telefoon: <a href="https://wa.me/31628468247" style="color: #00B050;">+31 6 28468247</a>
          </div>
          <div style="margin-top: 12px;">
            <strong style="color: #0F1F14;">Openingstijden:</strong><br />
            Maandag t/m Zondag : 09:00 - 22:00
          </div>
        </div>
        <div style="margin-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #CBD5E1; padding-top: 12px;">
          &copy; ${new Date().getFullYear()} Drive&amp;Talk Academy. Alle rechten voorbehouden.
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
