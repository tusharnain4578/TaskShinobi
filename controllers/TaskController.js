const path = require("path");
const fs = require("fs");
const { escape } = require("lodash");
const Task = require("../models/Task");
const { saveTaskImage, deleteTaskImage } = require("../models/FileUpload");

//* Task Controller

const taskValidate = (task) => {
  const isInvalid = !task || task.trim().length == 0;
  if (isInvalid) {
    return false;
  }

  return true;
};
const imageValidate = (file) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const maxSizeInBytes = 500 * 1024; // 500KB file size limit

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) return false;

  if (file.size > maxSizeInBytes) return false;

  return true;
};

const getTask = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (isNaN(taskId)) {
      return res.status(400).send({
        error: true,
        message: "Bad Request!",
      });
    }

    const task = await Task.findByPk(taskId);

    if (task && task.userId == req.user.id) {
      return res.status(201).send({
        success: true,
        message: "Task Fetched!",
        task: task,
      });
    }

    return res
      .status(400)
      .send({ error: true, message: "Resource not found!" });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Something went wrong!",
    });
  }
};

const addTask = async (req, res) => {
  try {
    let { task, isImportant, isUpdate, taskId } = req.body;
    console.log(req.body);
    if (!taskValidate(task) || (req.file && !imageValidate(req.file))) {
      return res.status(400).send({
        error: true,
        message: "Bad Request! Validation Failed!",
      });
    }

    let _task = null;

    if (isUpdate && taskId) {
      const condition = { userId: req.user.id, id: taskId };
      _task = await Task.findOne({ where: condition });

      if (!_task) {
        return res
          .status(400)
          .send({ error: true, message: "Resource not found!" });
      }
    } else {
      _task = new Task();
    }

    //handling image upload
    if (req.file) {
      _task.image = saveTaskImage(req.file, _task);
    }

    _task.task = escape(task);

    _task.isImportant = isImportant == 1 ? true : false;

    if (!isUpdate) {
      _task.status = "pending";
      _task.userId = req.user.id;
    }

    await _task.save();

    return res.status(201).send({
      success: true,
      message: isUpdate
        ? "Task Updated Successfully!"
        : "Task Added Successfully",
      task: _task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: true,
      message: "Something went wrong!",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (isNaN(taskId)) {
      return res.status(400).send({
        error: true,
        message: "Bad Request!",
      });
    }

    const condition = { userId: req.user.id, id: taskId };

    const task = await Task.findOne({ where: condition });

    if (!task) {
      return res
        .status(400)
        .send({ error: true, message: "Resource not found!" });
    }

    await task.destroy();

    if (task.image) deleteTaskImage(task.image);

    return res.status(201).send({
      success: true,
      message: "Task Deleted!",
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Something went wrong!",
    });
  }
};

const changeTaskStatus = async (req, res) => {
  try {
    const { taskId, check } = req.body;

    if (isNaN(taskId)) {
      return res.status(400).send({
        error: true,
        message: "Bad Request!",
      });
    }

    const condition = { userId: req.user.id, id: taskId };

    const task = await Task.findOne({ where: condition });

    if (!task) {
      return res
        .status(400)
        .send({ error: true, message: "Resource not found!" });
    }

    task.status = check ? "complete" : "pending";

    await task.save();

    return res.status(201).send({
      success: true,
      message: check ? "Task Completed!" : "Task Unchecked!",
      task: task,
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Something went wrong!",
    });
  }
};

const getTaskImage = async (req, res) => {
  const { image } = req.params;

  if (image) {
    const condition = { userId: req.user.id, image: image };

    const userTask = await Task.findOne({ where: condition });

    if (userTask) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "tasks",
        userTask.image
      );

      return res.status(200).sendFile(imagePath);
    }
  }

  return res.status(404).json({ error: 404 });
};

module.exports = {
  getTask,
  addTask,
  deleteTask,
  changeTaskStatus,
  getTaskImage,
};
