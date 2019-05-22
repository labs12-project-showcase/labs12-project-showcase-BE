const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const restricted = require("./middleware/restricted");

const adminRouter = require("./routes/admin");
const loginRouter = require("./routes/login");
const studentsRouter = require("./routes/students");
const projectsRouter = require("./routes/projects");

const server = express();

//Middleware
const middleware = [express.json(), helmet(), cors()];
server.use(middleware);

//Routes Middleware
server.use("/api/auth/login", loginRouter);
server.use("/api/students", studentsRouter);
server.use("/api/projects", projectsRouter);
server.use("/api/admin", restricted("staff"), adminRouter);

server.get("/", (req, res) => {
  res.send("Welcome, please refer to the GitHub docs to get started.");
});

module.exports = server;
