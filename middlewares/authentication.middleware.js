const express = require("express");
const { client } = require("../redis");
const auth = async (req, res, next) => {
  const city = req.query.city;
  const token = req.headers?.authorization;
  let isBlacklisted = await client.get("blacklisted_token");
  isBlacklisted = JSON.parse(isBlacklisted);
  if (isBlacklisted == token) {
    res.send({ msg: "Please login again" });
    return;
  }
  const regex = new RegExp("[a-zA-Z]+");
  if (regex.test(city)) {
    next();
  } else {
    res.send({ msg: "please provide valid city name" });
  }
};

module.exports = { auth };
