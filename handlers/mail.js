const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.send = options => {
  const text = 'Hello';
  const html = '<p>Hello</p>';
  const mailOptions = {
    from: 'Node Exam <noreply@example.com>',
    to: 'seb.vilhelm@gmail.com',
    subject: 'Test',
    text,
    html,
  };
  return transport.sendMail(mailOptions);
};
