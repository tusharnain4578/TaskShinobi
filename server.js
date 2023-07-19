const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const dbConn = require("./db/connection");
require("dotenv").config();

//Importing Models //1 by 1 in order
const User = require("./models/User");
const Task = require("./models/Task");
const Session = require("./models/Session");

//Importing Controllers
const SignupController = require("./controllers/SignupController");
const LoginController = require("./controllers/LoginController");
const LogoutController = require("./controllers/LogoutController");
const AuthStatusController = require("./controllers/AuthStatusController");

const {
  getTask,
  addTask,
  deleteTask,
  changeTaskStatus,
} = require("./controllers/TaskController");

//Importing Middlewares
const isAuthenticated = require("./middlewares/Auth");

const app = express();
app.use(cookieParser());

const sessionStore = new SequelizeStore({
  db: dbConn,
  table: "Session",
  checkExpirationInterval: Number(
    process.env.CHECK_SESSION_EXPIRATION_INTERVAL
  ),
  expiration: Number(process.env.SESSION_EXPIRE),
});

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    name: process.env.SESSION_COOKIE_NAME,
    store: sessionStore,
    cookie: {
      secure: process.env.SESSION_COOKIE_SECURE == "true" ? true : false,
      httpOnly: process.env.SESSION_COOKIE_HTTP_ONLY == "true" ? true : false,
      maxAge: Number(process.env.SESSION_EXPIRE),
      sameSite: process.env.SESSION_COOKIE_SAMESITE,
    },
  })
);

app.use(express.json());

app.use(express.static("public"));

app.get("/test", isAuthenticated, async (req, res) => {
  const tasks = await Task.getAllTasks(1, 5);
  return res.send({ tasks: tasks });
});

//auth api
app.use("/api/signup", SignupController);
app.use("/api/login", LoginController);

app.use("/api/logout", isAuthenticated, LogoutController);

app.use("/api/is-authenticated", isAuthenticated, AuthStatusController);

// _todo api
app.post("/api/task/get", isAuthenticated, getTask);
app.post("/api/task/add", isAuthenticated, addTask);
app.post("/api/task/update", isAuthenticated, addTask);
app.post("/api/task/complete", isAuthenticated, changeTaskStatus);
app.post("/api/task/delete", isAuthenticated, deleteTask);

//syncing database and starting server
dbConn.sync().then(() => {
  console.log("Database Synced");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is up on port ${process.env.PORT}`);
});
