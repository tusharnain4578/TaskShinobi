const fs = require("fs");
const path = require("path");

const TaskImageDir = path.join(__dirname, "..", "uploads", "tasks");

const saveTaskImage = (file, task = null) => {
  if (!fs.existsSync(TaskImageDir)) {
    fs.mkdirSync(TaskImageDir, { recursive: true });
  }

  const fileName = generateUniqueFilename() + path.extname(file.originalname);

  const filePath = path.join(TaskImageDir, fileName);

  fs.writeFileSync(filePath, file.buffer);

  if (task.image) deleteTaskImage(task.image);

  return fileName;
};

const deleteTaskImage = (fileName) => {
  const filePath = path.join(TaskImageDir, fileName);

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

//
//
//
// helpers

const generateUniqueFilename = () => {
  let str = "";

  let i = 0;

  while (i++ < 3) str += Math.random().toString(36).substring(2, 15);

  return str;
};

module.exports = { saveTaskImage, deleteTaskImage };
