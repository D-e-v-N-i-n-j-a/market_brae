// utils/mailer.js

const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, templateName, context) => {
  try {  
    const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, context);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};

module.exports = {
  sendEmail
};
