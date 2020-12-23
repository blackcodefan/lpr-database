const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('ready', () =>{
    console.log("RedisDb connection established successfully!")
});

module.exports = redisClient;