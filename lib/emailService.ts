// Basic mock email functions for testing
export async function sendEmail(options: { to: string; subject: string; text: string }) {
  console.log('Email would be sent:', options);
  return { id: 'mock-email-id', status: 'success' };
}

export async function sendWeatherAlertEmail(email: string, alert: any) {
  return sendEmail({
    to: email,
    subject: `Weather Alert: ${alert?.event || 'Update'}`,
    text: `Weather alert for ${alert?.areaDesc || 'your area'}`,
  });
}

export async function sendWelcomeEmail(email: string, states: string[]) {
  return sendEmail({
    to: email,
    subject: 'Welcome to Weather Alerts',
    text: `You have subscribed to alerts for: ${states.join(', ')}`,
  });
}

export async function checkAndSendStateAlerts(alert: any) {
  console.log('Would check and send alerts for:', alert);
  return { status: 'success' };
} 