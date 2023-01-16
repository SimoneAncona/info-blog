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
    res.sendFile(path.join(__dirname, "./pages/index.html"));
});

// get css
app.get("/resources/css/", (req, res) => {
    res.sendFile(path.join(__dirname, "./style/main.css"));
});

app.listen(port, () => {
    console.log("listening on port %d", port);
});