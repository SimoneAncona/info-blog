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
    res.sendFile(path.join(__dirname, "./client/pages/index.html"));
});
app.get("/resources/css/", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/style/common.css"));
});
app.get("/resources/css/:file", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/style/".concat(req.params.file, ".css")));
});
app.get("/resources/font/", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/assets/Gotham-Font/GothamMedium.ttf"));
});
app.get("/resources/js/:file", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/src/".concat(req.params.file, ".js")));
});
app.get("/resources/js", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/src/common.js"));
});
app.get("/resources/images/:image", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/assets/images/".concat(req.params.image)));
});
app.listen(port, function () {
    console.log("listening on port %d", port);
});
