const express = require('express');
const cron = require('node-cron');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require("socket.io");
require('dotenv').config();
const route = require('./routes');
const cronJobs = require('./service/cronjob');

/**============
 *  mongoDB connect
 */
mongoose.connect(process.env.ATLAS_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
mongoose.connection.once('open', () =>{
    console.log('MongoDB connection established successfully!')
});

const app = express();
app.use(cookieParser());
app.use(cors({origin: true}));
app.use(express.json());

app.get('/', (req, res) =>{
    return res.status(200).send('server is running');
});

/** =========================
 *  Routes
 */
app.use('/vehicle', route.VehicleRouter);
app.use('/city', route.CityRouter);
app.use('/group', route.GroupRouter);
app.use('/permission', route.PermissionRouter);
app.use('/user', route.UserRouter);
app.use('/station', route.StationRouter);
app.use('/camera', route.CameraRouter);
app.use('/alert', route.AlertRouter);
app.use('/notification', route.NotificationRouter);

const server = app.listen(process.env.PORT || 5000, () =>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

global.io = socket(server, {
    cors: {
        origin: process.env.SOCKET_CLIENT,
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket =>{
    console.log(`Socket client ${socket.id} connected`);
});
/** =======================
 *  cron job at 9:00 am brazil time blitz file update on redisDB
 */
cron.schedule('10 9 * * *', () =>{
     cronJobs.updateBlitz();
    },
    {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });

/**========================
 *  cron job at 9:00 am on Monday brazil time. update other files on redisDB
 */
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
