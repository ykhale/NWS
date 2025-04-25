import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailConfig {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailConfig) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Weather Alerts <alerts@yourdomain.com>',
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendWeatherAlertEmail(
  to: string,
  alert: {
    event: string;
    areaDesc: string;
    severity: string;
    description: string;
    effective: string;
    expires: string;
  }
) {
  const subject = `Weather Alert: ${alert.event} - ${alert.severity} Severity`;
  
  const text = `
    Weather Alert Notification
    Event: ${alert.event}
    Area: ${alert.areaDesc}
    Severity: ${alert.severity}
    Description: ${alert.description}
    Effective: ${new Date(alert.effective).toLocaleString()}
    Expires: ${new Date(alert.expires).toLocaleString()}
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${alert.severity === 'Extreme' ? '#d32f2f' : alert.severity === 'Severe' ? '#f57c00' : '#ffa000'}">
        Weather Alert: ${alert.event}
      </h2>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p><strong>Area:</strong> ${alert.areaDesc}</p>
        <p><strong>Severity:</strong> ${alert.severity}</p>
        <p><strong>Description:</strong> ${alert.description}</p>
        <p><strong>Effective:</strong> ${new Date(alert.effective).toLocaleString()}</p>
        <p><strong>Expires:</strong> ${new Date(alert.expires).toLocaleString()}</p>
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        This is an automated alert from the Hurricane & Weather Monitor system.
      </p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}

export async function checkAndSendStateAlerts(alert: {
  event: string;
  areaDesc: string;
  severity: string;
  description: string;
  effective: string;
  expires: string;
}) {
  try {
    // Extract state from area description
    const state = alert.areaDesc.split(',').pop()?.trim();
    if (!state) return;

    // Find all subscriptions that include this state
    const subscriptions = await prisma.subscription.findMany({
      where: {
        states: {
          path: '$[*]',
          array_contains: state
        }
      }
    });

    // Send alerts to all matching subscriptions
    for (const subscription of subscriptions) {
      await sendWeatherAlertEmail(subscription.email, alert);
    }
  } catch (error) {
    console.error('Error checking and sending state alerts:', error);
  }
}

export async function sendWelcomeEmail(
  to: string,
  states: string[]
) {
  const subject = 'Welcome to Weather Alert Subscriptions';
  
  const text = `
    Thank you for subscribing to weather alerts!
    
    You will receive email notifications for weather alerts in the following states:
    ${states.join(', ')}

    You can manage your subscription preferences at any time by visiting our website.
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a73e8;">Welcome to Weather Alert Subscriptions</h2>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p>Thank you for subscribing to weather alerts!</p>
        
        <p><strong>You will receive notifications for alerts in:</strong></p>
        <ul style="list-style-type: none; padding: 0;">
          ${states.map(state => `<li style="margin: 5px 0;">• ${state}</li>`).join('')}
        </ul>
      </div>

      <p style="margin-top: 20px; font-size: 14px; color: #666;">
        You can manage your subscription preferences at any time by visiting our website.
      </p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
} 