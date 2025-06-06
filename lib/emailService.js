const nodemailer = require('nodemailer');

// Direct configuration with credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hireyousifkhaleel@gmail.com',
    pass: 'bvwvxqwynmgfhnel' // App password (no spaces or special characters)
  },
});

const EmailService = {
  async sendEmail({ to, subject, text, html }) {
    try {
      const mailOptions = {
        from: 'hireyousifkhaleel@gmail.com',
        to,
        subject,
        text,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  async sendWeatherAlertEmail(
    to,
    alert
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

    return this.sendEmail({ to, subject, text, html });
  },

  async sendWelcomeEmail(
    to,
    states
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

    return this.sendEmail({ to, subject, text, html });
  },

  async checkAndSendStateAlerts(alert) {
    console.log('Would check and send alerts for:', alert);
    return { status: 'success' };
  }
};

module.exports = EmailService; 