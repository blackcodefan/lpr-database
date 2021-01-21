const { workerData } = require('worker_threads');
const sendMail = require('./mailer');
const sendWhatsapp = require('./whatsapp');
const sendSMS = require('./sms');

let users = JSON.parse(workerData.users);

sendMail.sendAlertMail(users, workerData.vehicle);
sendWhatsapp(users, workerData.vehicle).then(res => console.log(res));
// sendSMS(users, workerData.vehicle).then(res => console.log(res));