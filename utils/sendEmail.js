const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  const mailOptions = {
    from: options.from, // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
    html: options.html, // html body
  }
  
    var transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    transport.sendMail(mailOptions);
  }

  module.exports = sendEmail