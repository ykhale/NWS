const EmailService = require('../lib/emailService');

async function testEmails() {
  try {
    // Test welcome email
    console.log('Testing welcome email...');
    await EmailService.sendWelcomeEmail('test@example.com', ['California', 'Texas']);
    console.log('Welcome email sent successfully');

    // Test weather alert email
    console.log('\nTesting weather alert email...');
    await EmailService.sendWeatherAlertEmail('test@example.com', {
      event: 'Tornado Warning',
      areaDesc: 'Los Angeles County',
      severity: 'Extreme',
      description: 'A tornado has been spotted in your area. Take shelter immediately.',
      effective: new Date().toISOString(),
      expires: new Date(Date.now() + 3600000).toISOString(),
    });
    console.log('Weather alert email sent successfully');

  } catch (error) {
    console.error('Error testing emails:', error);
  }
}

testEmails(); 