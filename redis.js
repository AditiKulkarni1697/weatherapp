const Redis = require("ioredis");
require("dotenv").config();

let configuration = {
  host: "redis-12467.c305.ap-south-1-1.ec2.cloud.redislabs.com",
  port: 12467,
  username: "default",
  password: process.env.redis_password,
};

const client = new Redis(configuration);

//if (client) console.log("redis is running", client);

module.exports = { client };
