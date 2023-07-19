const express = require("express");
const { escape } = require("lodash");
const router = express.Router();
const User = require("../models/User");

//* Signup Controller

const sgValidate = (name, email, password, cpassword) => {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const isInvalid =
    !name ||
    !email ||
    !password ||
    !cpassword ||
    name.trim().length == 0 ||
    name.trim().length > 30 ||
    email.trim().length == 0 ||
    !emailRegex.test(email) ||
    email.length > 150 ||
    !passwordRegex.test(password) ||
    cpassword != password;

  if (isInvalid) {
    return false;
  }

  return true;
};

router.post("/", async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;

    if (!sgValidate(name, email, password, cpassword)) {
      return res.status(400).send({
        error: true,
        message: "Bad Request! Validation Failed!",
      });
    }

    let user = await User.findOne({ where: { email: email } });

    if (user) {
      return res
        .status(409)
        .send({ field: "sg_email", message: "Email already registered!" });
    }

    delete req.body.cpassword;

    req.body.name = escape(req.body.name);

    user = await User.create(req.body);

    res.status(201).send({
      success: true,
      message: "Signup Successful!",
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Something went wrong!",
    });
  }
});

module.exports = router;
