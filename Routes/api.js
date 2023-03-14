var express = require("express");
// V1
var authRouterV1 = require("./controllerRoute/auth");
var userRouterV1 = require("./controllerRoute/user");

// V2
var authRouterV2 = require("./apiContollersRoute/auth");
var userRouterV2 = require("./apiContollersRoute/user");

var app = express();

//Controllers Routes V1 
app.use("/v1/auth/", authRouterV1);
app.use("/v1/user/", userRouterV1);

//APIControllers Routes V2
app.use("/v2/auth/", authRouterV2);
app.use("/v2/user/", userRouterV2);

module.exports = app;
