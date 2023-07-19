const { escape } = require("lodash");
const Task = require("../models/Task");

//* Task Controller

const taskValidate = (task) => {
  const isInvalid = !task || task.trim().length == 0;
  if (isInvalid) {
    return false;
  }

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

    if (!taskValidate(task)) {
      return res.status(400).send({
        error: true,
        message: "Bad Request! Validation Failed!",
      });
    }

    let _task = null;
    if (isUpdate && taskId) {
      _task = await Task.findByPk(taskId);

      if (!_task) {
        return res
          .status(400)
          .send({ error: true, message: "Resource not found!" });
      }
    } else {
      _task = new Task();
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

    const task = await Task.findByPk(taskId);

    if (!task) {
      return res
        .status(400)
        .send({ error: true, message: "Resource not found!" });
    }

    await task.destroy();

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

    const task = await Task.findByPk(taskId);

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

module.exports = { getTask, addTask, deleteTask, changeTaskStatus };
