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

const mail = (user, vehicle) =>({
    from: process.env.GMAIL_USER_NAME,
    to: user.email,
    subject: 'LPR alerta',
    html: `<b>Ei ${user.name}! </b>
<br>Este é o e-mail de alerta da LPR.<br/>
<br>Licença: ${vehicle.license}</br>
<br>Tipo de Alerta: ${vehicle.alertType}</br>
<br>Cidade: ${vehicle.cityLabel}</br>
<br>Rua: ${vehicle.street}</br>
<br>Tempo: ${vehicle.time} ${vehicle.date}</br>
<hr/>
<img src="cid:vehicle" width="200"/><img src="cid:plate" width="200"/>
<hr/>`,
    attachments: [
        {
            filename: 'vehicle.png',
            path: `${process.env.STORAGE_SERVER_EXTERNAL}/vehicle/${vehicle.vehicleImg}`,
            cid: 'vehicle'
        },
        {
            filename: 'plate.png',
            path: `${process.env.STORAGE_SERVER_EXTERNAL}/plate/${vehicle.plateImg}`,
            cid: 'plate'
        }
    ]
});

const resetMail = (email, token) =>({
    from: process.env.GMAIL_USER_NAME,
    to: email,
    subject: "Redefinir senha",
    html: `<p>Você solicitou a redefinição de senha</p>
<h5>Clique neste <a href="${process.env.WEB_SERVER_EXTERNAL}/#/cmVzZXRwYXNzd29yZA/${token}" >link</a> para redefinir a senha</h5>`
});

const sendMail =  (users, vehicle) =>{

        for(let user of users){
            if(user.mail){
                transporter.sendMail(mail(user, vehicle), (error, info) =>{
                    if(error)
                        console.log(error);
                    else
                        console.log(info.response);
                });
            }
        }
};

const sendResetMail = (email, token) =>{
    transporter.sendMail(resetMail(email, token), (error, info) =>{
        if(error)
            console.log(error);
        else
            console.log(info.response);
    })
};

module.exports = {
    sendAlertMail: sendMail,
    sendResetMail: sendResetMail
};