const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f428579ca20fbc",
      pass: "83f9672f996753"
    }
  });
