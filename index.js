"use strict";
exports.__esModule = true;
var express = require("express");
var dotenv = require("dotenv");
var path = require("path");
var app = express();
dotenv.config();
var port = process.env.PORT || 3000;
function sendQuery(query) {
    return new Promise(function (resolve, reject) { });
}
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./pages/index.html"));
});
app.get("/resources/css/", function (req, res) {
    res.sendFile(path.join(__dirname, "./style/main.css"));
});
app.listen(port, function () {
    console.log("listening on port %d", port);
});
