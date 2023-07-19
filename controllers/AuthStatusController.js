const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.post("/", async (req, res) => {
  try {
    const tasks = await Task.getAllTasks(req.user.id);

    let greet = null;
    if (!req.cookies.shortSession) {
      greet = `Hi ${req.user.name}, Welcome to Task Shinobi`;
      res.cookie("shortSession", true, { httpOnly: true });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
      tasks: tasks,
      message: greet,
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Something went wrong!",
    });
  }
});

module.exports = router;
