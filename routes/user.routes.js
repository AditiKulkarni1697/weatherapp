const { UserModel } = require("../models/user.model");
const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require("../redis");
const { auth } = require("../middlewares/authentication.middleware");

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send({ msg: users });
  } catch (err) {
    res.send(err);
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const ip = req.socket.remoteAddress;
  bcrypt.hash(password, 8, async function (err, hash) {
    if (hash) {
      const user = new UserModel({ name, email, password: hash, ip });
      await user.save();
      res.send({ msg: "User is registered" });
    } else {
      res.send({ msg: err });
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      const token = jwt.sign({ userID: user._id }, "token", {
        expiresIn: "1h",
      });
      res.send({ msg: "User is logged in", token: token });
    } else {
      res.send({ msg: err });
    }
  });
});

userRouter.get("/logout", auth, async (req, res) => {
  const token = req.headers?.authorization;
  const decoded = jwt.verify(token, "token");
  if (decoded) {
    client.set("blacklisted_token", JSON.stringify(token), "EX", 6 * 60);
    const blacklisted = await client.get("blacklisted_token");
    console.log(blacklisted);
    res.send({ msg: "User is logged out" });
  } else {
    res.send({ msg: "Please login again" });
  }
});
module.exports = { userRouter };
