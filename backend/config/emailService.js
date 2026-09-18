import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNER_PATH = path.join(__dirname, '..', 'assets', 'sage_email_banner.png');

// Create transporter
const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null; // Will fallback to simulated luxury email logging
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Clean & Simple Text Email Template with Top Banner
 */
const getSimpleBannerEmailTemplate = ({ title, contentHtml }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F2937; line-height: 1.65;">
  
  <div style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
    
    <!-- TOP BANNER WITH SAGE LOGO -->
    <div style="background-color: #073E47; text-align: center; border-bottom: 3px solid #F3D898; overflow: hidden;">
      <img 
        src="cid:sage_email_banner" 
        alt="Sagē Café — Good Food Brings People Together" 
        width="100%" 
        style="display: block; width: 100%; max-width: 580px; height: auto; margin: 0 auto; border: 0;"
      />
    </div>

    <!-- CLEAN TEXT BODY -->
    <div style="padding: 28px 24px; font-size: 14px; color: #1F2937;">
      ${contentHtml}
    </div>

    <!-- FOOTER -->
    <div style="background-color: #F9FAFB; padding: 18px 24px; text-align: center; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6B7280; line-height: 1.6;">
      <p style="margin: 0 0 4px 0; font-weight: 600; color: #374151;">
        SAGĒ CAFÉ &amp; ROASTERY &bull; MG Marg, Hazratganj, Lucknow
      </p>
      <p style="margin: 0 0 6px 0;">
        Host Desk: <a href="tel:+915224028899" style="color: #0A6473; text-decoration: none; font-weight: 600;">+91 (522) 402-8899</a> | Email: <a href="mailto:progixtechnology@gmail.com" style="color: #0A6473; text-decoration: none;">progixtechnology@gmail.com</a>
      </p>
      <p style="margin: 0; font-size: 10px; color: #9CA3AF;">
        &copy; 2026 Sagē Group. All rights reserved.
      </p>
    </div>

  </div>

</body>
</html>
  `;
};

/**
 * 1. Initial Email to User: Booking Request Received
 * Simple text letter format with details list & 2-3 hour notice
 */
export const sendReservationReceivedEmail = async (reservation) => {
  const userEmail = reservation.email;
  if (!userEmail) {
    console.log(`ℹ️ No user email provided for reservation #${reservation._id || reservation.id}, skipping email.`);
    return false;
  }

  const bookingId = reservation._id?.toString().slice(-4) || reservation.id || 'SAGE';

  const contentHtml = `
    <h2 style="font-size: 18px; color: #0A6473; margin: 0 0 16px 0; font-family: Georgia, serif; font-weight: 700;">
      Reservation Request Received (#${bookingId})
    </h2>

    <p style="margin: 0 0 14px 0; font-size: 14px;">
      Dear <strong>${reservation.name}</strong>,
    </p>

    <p style="margin: 0 0 14px 0; font-size: 14px;">
      Thank you for choosing <strong>Sagē Café &amp; Roastery</strong>. We have successfully received your table booking request.
    </p>

    <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 6px; margin: 18px 0; font-size: 13px; color: #92400E;">
      <strong>⏱️ Verification in Progress:</strong><br>
      Our host concierge team is reviewing table availability for your requested slot. <strong>We will confirm your reservation within 2–3 hours.</strong>
    </div>

    <p style="margin: 18px 0 8px 0; font-size: 14px; font-weight: 700; color: #374151;">
      Booking Details:
    </p>

    <ul style="margin: 0 0 18px 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #374151;">
      <li><strong>Guest Name:</strong> ${reservation.name}</li>
      <li><strong>Requested Date:</strong> ${reservation.date}</li>
      <li><strong>Requested Time:</strong> ${reservation.time}</li>
      <li><strong>Party Size:</strong> ${reservation.guests} Guests</li>
      <li><strong>Seating Section:</strong> ${reservation.experience || 'Main Artisanal Dining Room'}</li>
      ${reservation.specialRequests ? `<li><strong>Special Request:</strong> <em>${reservation.specialRequests}</em></li>` : ''}
    </ul>

    <p style="margin: 0 0 14px 0; font-size: 14px; color: #4B5563;">
      No action is required from your side right now. You will receive an official confirmation email as soon as our host manager approves the booking.
    </p>

    <p style="margin: 18px 0 0 0; font-size: 14px; color: #374151;">
      Warm regards,<br>
      <strong>Host Desk &amp; Concierge Team</strong><br>
      Sagē Café &amp; Roastery, Hazratganj Lucknow
    </p>
  `;

  const html = getSimpleBannerEmailTemplate({
    title: `Reservation Request Received (#${bookingId})`,
    contentHtml,
  });

  return await sendMail({
    to: userEmail,
    subject: `🛎️ Table Request Received (#${bookingId}) - Sagē Café & Roastery`,
    html,
  });
};

/**
 * 2. Confirmation Email to User: Admin Confirmed
 */
export const sendReservationConfirmedEmail = async (reservation, customNote = '') => {
  const userEmail = reservation.email;
  if (!userEmail) return false;

  const bookingId = reservation._id?.toString().slice(-4) || reservation.id || 'SAGE';

  const contentHtml = `
    <h2 style="font-size: 18px; color: #047857; margin: 0 0 16px 0; font-family: Georgia, serif; font-weight: 700;">
      🎉 Your Table Reservation is Confirmed! (#${bookingId})
    </h2>

    <p style="margin: 0 0 14px 0; font-size: 14px;">
      Dear <strong>${reservation.name}</strong>,
    </p>

    <p style="margin: 0 0 14px 0; font-size: 14px;">
      We are delighted to confirm your table reservation at <strong>Sagē Café &amp; Roastery, Hazratganj</strong>!
    </p>

    ${
      customNote
        ? `
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 12px 16px; border-radius: 6px; margin: 18px 0; font-size: 13px; color: #065F46;">
      <strong>💬 Note from Manager:</strong><br>
      ${customNote}
    </div>
    `
        : ''
    }

    <p style="margin: 18px 0 8px 0; font-size: 14px; font-weight: 700; color: #374151;">
      Confirmed Booking Summary:
    </p>

    <ul style="margin: 0 0 18px 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #374151;">
      <li><strong>Booking Reference:</strong> #${bookingId}</li>
      <li><strong>Confirmed Date:</strong> ${reservation.date}</li>
      <li><strong>Confirmed Time:</strong> ${reservation.time}</li>
      <li><strong>Party Size:</strong> ${reservation.guests} Persons</li>
      <li><strong>Seating Area:</strong> ${reservation.experience || 'Main Dining Room'}</li>
      <li><strong>Venue:</strong> MG Marg, Hazratganj, Lucknow</li>
    </ul>

    <p style="margin: 0 0 14px 0; font-size: 13px; color: #4B5563;">
      Please arrive 5–10 minutes prior to your reserved time. Tables are held for up to 15 minutes past the booking hour.
    </p>

    <p style="margin: 18px 0 0 0; font-size: 14px; color: #374151;">
      We look forward to serving you,<br>
      <strong>Host Desk &amp; Concierge Team</strong><br>
      Sagē Café &amp; Roastery, Hazratganj Lucknow
    </p>
  `;

  const html = getSimpleBannerEmailTemplate({
    title: `Your Table is Confirmed! (#${bookingId})`,
    contentHtml,
  });

  return await sendMail({
    to: userEmail,
    subject: `✨ Table Reservation Confirmed! (#${bookingId}) - Sagē Café Hazratganj`,
    html,
  });
};

/**
 * 3. Custom Update / Reschedule Suggestion Email from Admin
 */
export const sendReservationCustomUpdateEmail = async (reservation, customMessage, alternateTime = '', alternateDate = '') => {
  const userEmail = reservation.email;
  if (!userEmail) return false;

  const bookingId = reservation._id?.toString().slice(-4) || reservation.id || 'SAGE';

  const contentHtml = `
    <h2 style="font-size: 18px; color: #B45309; margin: 0 0 16px 0; font-family: Georgia, serif; font-weight: 700;">
      Schedule Update for Table Reservation (#${bookingId})
    </h2>

    <p style="margin: 0 0 14px 0; font-size: 14px;">
      Dear <strong>${reservation.name}</strong>,
    </p>

    <p style="margin: 0 0 14px 0; font-size: 14px;">
      Our host manager has reviewed your table reservation request for <strong>${reservation.date}</strong> at <strong>${reservation.time}</strong>.
    </p>

    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 6px; margin: 18px 0; font-size: 13px; color: #92400E;">
      <strong>📝 Note from Host Manager:</strong><br>
      ${customMessage || 'Due to high booking volume during your requested slot, our team has suggested an alternate timing below.'}
    </div>

    ${
      alternateTime || alternateDate
        ? `
    <p style="margin: 18px 0 8px 0; font-size: 14px; font-weight: 700; color: #374151;">
      Suggested Alternate Availability:
    </p>

    <ul style="margin: 0 0 18px 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #374151;">
      <li><strong>Suggested Date:</strong> ${alternateDate || reservation.date}</li>
      <li><strong>Suggested Time:</strong> ${alternateTime || reservation.time}</li>
      <li><strong>Party Size:</strong> ${reservation.guests} Persons</li>
    </ul>
    `
        : ''
    }

    <p style="margin: 0 0 14px 0; font-size: 14px; color: #4B5563;">
      If this suggested time works for you, please reply directly to this email or call our host desk at <a href="tel:+915224028899" style="color: #0A6473; font-weight: 600;">+91 (522) 402-8899</a> so we can confirm and hold the table for you right away.
    </p>

    <p style="margin: 18px 0 0 0; font-size: 14px; color: #374151;">
      Warm regards,<br>
      <strong>Host Desk &amp; Concierge Team</strong><br>
      Sagē Café &amp; Roastery, Hazratganj Lucknow
    </p>
  `;

  const html = getSimpleBannerEmailTemplate({
    title: `Schedule Update for Reservation (#${bookingId})`,
    contentHtml,
  });

  return await sendMail({
    to: userEmail,
    subject: `🔔 Schedule Update for Table Reservation (#${bookingId}) - Sagē Café`,
    html,
  });
};

/**
 * 4. Dispatched when Event Ticket is successfully booked & paid via Razorpay
 */
export const sendEventTicketConfirmationEmail = async (booking) => {
  const userEmail = booking.guestEmail;
  const userName = booking.guestName || 'Valued Guest';
  const bookingId = booking.bookingId;

  const contentHtml = `
    <h2 style="color: #073E47; margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">
      🎟️ Event Ticket Confirmed (#${bookingId})
    </h2>

    <p style="margin: 0 0 14px 0; font-size: 15px; color: #374151;">
      Dear <strong>${userName}</strong>,
    </p>

    <p style="margin: 0 0 14px 0; font-size: 14px; color: #374151;">
      Your ticket booking for <strong>${booking.eventTitle}</strong> at Sagē Café is confirmed! Your payment has been verified successfully.
    </p>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #10B981; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <table style="width: 100%; font-size: 13.5px; color: #334155; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; font-weight: 600; width: 40%;">Pass / Booking ID:</td>
          <td style="padding: 4px 0; font-family: monospace; font-weight: 700; color: #073E47;">${bookingId}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: 600;">Event Name:</td>
          <td style="padding: 4px 0; font-weight: 600; color: #1E293B;">${booking.eventTitle}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: 600;">Date &amp; Time:</td>
          <td style="padding: 4px 0;">${booking.eventDate} &bull; ${booking.eventTime}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: 600;">Venue / Space:</td>
          <td style="padding: 4px 0;">${booking.eventLocation || 'Sagē Café & Roastery, Hazratganj'}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: 600;">Tickets Count:</td>
          <td style="padding: 4px 0;"><strong>${booking.ticketsCount} Seat(s)</strong></td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: 600;">Total Amount Paid:</td>
          <td style="padding: 4px 0; font-weight: 700; color: #059669;">₹${booking.totalAmount}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-weight: 600;">Payment Ref ID:</td>
          <td style="padding: 4px 0; font-family: monospace; font-size: 12px;">${booking.razorpayPaymentId || 'N/A'}</td>
        </tr>
      </table>
    </div>

    <p style="margin: 14px 0; font-size: 13.5px; color: #4B5563;">
      Please present this booking pass at the host desk upon arrival. We look forward to hosting you for an unforgettable experience!
    </p>

    <p style="margin: 18px 0 0 0; font-size: 14px; color: #374151;">
      Warm regards,<br>
      <strong>Events &amp; Experience Concierge</strong><br>
      Sagē Café &amp; Roastery, Hazratganj Lucknow
    </p>
  `;

  const html = getSimpleBannerEmailTemplate({
    title: `Event Pass: ${booking.eventTitle} (#${bookingId})`,
    contentHtml,
  });

  return await sendMail({
    to: userEmail,
    subject: `🎟️ Ticket Confirmed: ${booking.eventTitle} (#${bookingId}) - Sagē Café`,
    html,
  });
};

/**
 * Core sendMail helper with inline banner attachment
 */
const sendMail = async ({ to, subject, html }) => {
  const from = process.env.EMAIL_FROM || '"Sagē Café & Roastery" <noreply@sagecafe.in>';
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`\n==================================================`);
    console.log(`📧 [MOCK SMTP DISPATCH] To: ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`ℹ️ (SMTP_USER / SMTP_PASS not set in .env. Real email will send when credentials are added.)`);
    console.log(`==================================================\n`);
    return { success: true, mocked: true };
  }

  // Attach banner image inline if file exists
  const attachments = [];
  if (fs.existsSync(BANNER_PATH)) {
    attachments.push({
      filename: 'sage_email_banner.png',
      path: BANNER_PATH,
      cid: 'sage_email_banner',
    });
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });
    console.log(`✅ [SMTP SENT] Email sent to ${to} (MessageID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [SMTP ERROR] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};
