import * as mysql from "mysql2";
import * as express from "express";
import * as cors from "cors";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

function sendQuery(query: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {});
}

// page request
app.get("/", (req, res) => {

});

// get css
app.get("/resources/css/", (req, res) => {

});