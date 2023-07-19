const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");

//* Login Controller

const lgValidate = (email, password) => {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isInvalid =
    !email ||
    !password ||
    email.trim().length == 0 ||
    !emailRegex.test(email) ||
    password.trim().length == 0;

  if (isInvalid) {
    return false;
  }

  return true;
};

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!lgValidate(email, password)) {
      return res.status(400).send({
        error: true,
        message: "Bad Request! Validation Failed!",
      });
    }

    let user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(400)
        .send({ field: "lg_email", message: "Email is not registered!" });
    }

    if (!(await user.verifyPassword(password))) {
      return res
        .status(400)
        .send({ field: "lg_password", message: "Wrong Password!" });
    }

    req.session.userLoggedIn = true;

    user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    req.session.user = user;

    const tasks = await Task.getAllTasks(user.id);

    res
      .status(200)
      .cookie("shortSession", true, { httpOnly: true })
      .send({
        success: true,
        user: user,
        tasks: tasks,
        // message: "Login Successful!",
        message: `Hi ${user.name}, Welcome to Task Shinobi`,
      });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Something went wrong!",
    });
  }
});

module.exports = router;
