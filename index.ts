import * as mysql from "mysql2";
import * as express from "express";
import * as cors from "cors";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as path from "path";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

function sendQuery(query: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {});
}

// page request
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/pages/index.html"));
});

app.get("/:page/", (req, res) => {
    res.sendFile(path.join(__dirname, `./client/pages/${req.params.page}.html`));
});

// ---------------------- CLIENT RESOURCES ----------------------
// get common css
app.get("/resources/css/", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/style/common.css"));
});

// get home page css
app.get("/resources/css/:file", (req, res) => {
    res.sendFile(path.join(__dirname, `./client/style/${req.params.file}.css`));
});

// get font
app.get("/resources/font/", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/assets/Gotham-Font/GothamMedium.ttf"));
});

app.get("/resources/js/:file", (req, res) => {
    res.sendFile(path.join(__dirname, `./client/src/${req.params.file}.js`));
});

app.get("/resources/js", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/src/common.js"));
});

// send image
app.get("/resources/images/:image", (req, res) => {
    res.sendFile(path.join(__dirname, `./client/assets/images/${req.params.image}`));
});

app.listen(port, () => {
    console.log("listening on port %d", port);
});