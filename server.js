const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const restricted = require("./middleware/restricted");

const accountsRouter = require("./routes/account");
const adminRouter = require("./routes/admin");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const studentsRouter = require("./routes/students");

const server = express();

//Middleware
const middleware = [express.json(), helmet(), cors()];
server.use(middleware);

//Routes Middleware
server.use("/api/auth/login", loginRouter);
server.use("/api/auth/register", registerRouter);
server.use("/api/students", studentsRouter);
server.use("/api/accounts", restricted(), accountsRouter);
server.use("/api/admin", restricted("staff"), adminRouter);

server.get("/", (req, res) => {
  res.send("Welcome, please refer to the GitHub docs to get started.");
});

module.exports = server;
