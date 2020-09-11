const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "24bb326de92b2f",
    pass: "fea6d148c65864"
  }
});
