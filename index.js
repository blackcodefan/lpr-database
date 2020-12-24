const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const route = require('./routes');
const cronJobs = require('./service/cronjob');

mongoose.connect(process.env.ATLAS_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
mongoose.connection.once('open', () =>{
    console.log('MongoDB connection established successfully!')
});

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.get('/', (req, res) =>{
    return res.status(200).send('server is running');
});

app.use('/vehicle', route.VehicleRouter);

app.listen(process.env.PORT || 5000, () =>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

cron.schedule('* * * * *', () =>{
     cronJobs.updateBlitz();
    },
    {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });

cron.schedule('0 9 * * 1', () =>{
        cronJobs.updateBrand();
        cronJobs.updateColor();
        cronJobs.updatePlace();
        cronJobs.updateType();
        cronJobs.updateRenavam();
    },
    {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });
