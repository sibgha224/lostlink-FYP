const sendEmail = async (to, subject, htmlContent) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'LostLink', email: process.env.EMAIL_FROM || process.env.EMAIL_USER },
      to: [{ email: to }],
      subject,
      htmlContent
    })
  });

  if (!response.ok) {
    const details = await response.text();
    console.log('Brevo email error:', response.status, details);
    throw new Error(`Email failed: ${response.status}`);
  }
};

module.exports = sendEmail;