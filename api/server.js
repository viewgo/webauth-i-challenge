const express = require("express");

const apiRouter = require("./api-router.js");
const middleware = require("./middleware.js");

const server = express();

middleware(server);

server.use("/api", apiRouter);

module.exports = server;
