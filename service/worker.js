const { workerData } = require('worker_threads');
const mailer = require('./mailer');

const mailData = {
    from: process.env.GMAIL_USER_NAME,
    to: 'myongilk@outlook.com',
    subject: 'Sending Email using Node.js',
    html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
};

mailer.sendMail(mailData, (error, info) =>{
    if(error) console.log(error);
    else{console.log(info.response)}
});