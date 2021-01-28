const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const message = async (user, vehicle) =>{
    await client.messages
        .create({
            from: 'whatsapp:+15136665907',//replace with twilio phone
            body: `Ei *${user.name}*!\nEste é o e-mail de alerta da *LPR*.\nLicença: *${vehicle.license}*\nTipo de Alerta: *${vehicle.alertType}*\nCidade: *${vehicle.city}*\nRua: *${vehicle.street}*\nTempo: *${vehicle.time} ${vehicle.date}*\n\n*Imagem do veículo*`,
            mediaUrl: `${process.env.STORAGE_SERVER_EXTERNAL}/vehicle/${vehicle.vehicleImg}`,
            to: `whatsapp:${user.whatsApp}`// replace with user.whatsApp
        });
    await client.messages
        .create({
            from: 'whatsapp:+15136665907',//replace with twilio phone
            body: '*Imagem da licença*',
            mediaUrl: `${process.env.STORAGE_SERVER_EXTERNAL}/plate/${vehicle.plateImg}`,
            to: `whatsapp:${user.whatsApp}`// replace with user.whatsApp
        });
};

const send = async (users, vehicle) =>{
    for(let user of users){
        if(user.whatsAppMessage){
            await message(user, vehicle);
        }
    }
    return true;
};

module.exports=send;