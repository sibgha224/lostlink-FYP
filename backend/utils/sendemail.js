const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"LostLink" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;