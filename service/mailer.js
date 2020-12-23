const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.GMAIL_SERVICE_NAME,
    port: process.env.GMAIL_SERVICE_PORT,
    host: process.env.GMAIL_SERVICE_HOST,
    auth: {
        user: process.env.GMAIL_USER_NAME,
        pass: process.env.GMAIL_USER_PASSWORD
    },
    secure: process.env.GMAIL_SERVICE_SECURE
});

module.exports = transporter;