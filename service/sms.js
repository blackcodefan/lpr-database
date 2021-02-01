const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const message = async (user, vehicle) =>{
    await client.messages
        .create({
            from: '+15136665907',//replace to twillio phone number
            body: `Ei ${user.name}!\nEste é o e-mail de alerta da LPR.\nLicença: ${vehicle.license}\nTipo de Alerta: ${vehicle.alertType}\nCidade: ${vehicle.cityLabel}\nRua: ${vehicle.street}\nTempo: ${vehicle.time} ${vehicle.date}\nImagem do veículo`,
            mediaUrl: [`${process.env.STORAGE_SERVER_EXTERNAL}/vehicle/${vehicle.vehicleImg}`,
                `${process.env.STORAGE_SERVER_EXTERNAL}/plate/${vehicle.plateImg}`],
            to: user.mobile
        });
};

const send = async (users, vehicle) =>{
    for(let user of users){
        if(user.sms){
            await message(user, vehicle);
        }
    }
    return true;
};

module.exports=send;