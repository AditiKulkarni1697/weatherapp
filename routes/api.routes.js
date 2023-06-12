const express = require("express");
//const { apiRouter } = require("../../evaluation/routes/api.routes");
const axios = require("axios");
const { client } = require("../redis");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/authentication.middleware");
require("dotenv").config();

const apiRouter = express.Router();

apiRouter.get("/", auth, async (req, res) => {
  const token = req.headers?.authorization;
  const decoded = jwt.verify(token, "token");
  const user = await UserModel.findOne({ _id: decoded.userID });
  const city = req.query.city;
  try {
    const already_present = await client.get(city);
    if (already_present) {
      const data = JSON.parse(already_present);
      res.send({ msg: data });
      return;
    }
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_key}`
    );
    const weather = response.data;
    client.set(city, JSON.stringify(weather), "EX", 30);
    await UserModel.findByIdAndUpdate(
      { _id: user._id },
      { prefered_city: city }
    );
    res.send({ msg: response.data.weather });
  } catch (err) {
    res.send({ err: err });
  }
});

module.exports = { apiRouter };
