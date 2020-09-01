const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "",
    port: 2525,
    auth: {
      user: "",
      pass: ""
    }
  });
