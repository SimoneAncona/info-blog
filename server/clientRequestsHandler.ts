import { DbHandler } from "./dbHandler";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as path from "path";
import * as auth from "./auth";

const app = express();

export class ClientRequestsHandler {
    port: number | string;

    constructor() {
        dotenv.config();
        this.port = process.env.PORT || 3000;  
        
        this.pageRequest();
        this.resourcesRequest();
        this.authRequest();
    }

    private resolvePath(str: string): string {
        return path.join(__dirname, str);
    }

    // ---------------------- PAGES ----------------------
    private pageRequest() {
        app.get("/", (req, res) => {
            res.sendFile(this.resolvePath(("../client/pages/index.html")));
        });

        app.get("/:page/", (req, res) => {
            res.sendFile(this.resolvePath((`../client/pages/${req.params.page}.html`)));
        });
    }

    // ---------------------- CLIENT RESOURCES ----------------------
    private resourcesRequest() {
        // get common css
        app.get("/resources/css/", (req, res) => {
            res.sendFile(this.resolvePath(("../client/style/common.css")));
        });

        // get home page css
        app.get("/resources/css/:file", (req, res) => {
            res.sendFile(this.resolvePath((`../client/style/${req.params.file}.css`)));
        });

        // get font
        app.get("/resources/font/", (req, res) => {
            res.sendFile(this.resolvePath(("../client/assets/Gotham-Font/GothamMedium.ttf")));
        });

        app.get("/resources/js/:file", (req, res) => {
            res.sendFile(this.resolvePath((`../client/src/${req.params.file}.js`)));
        });

        app.get("/resources/js", (req, res) => {
            res.sendFile(this.resolvePath(("../client/src/common.js")));
        });

        // send image
        app.get("/resources/images/:image", (req, res) => {
            res.sendFile(this.resolvePath((`../client/assets/images/${req.params.image}`)));
        });
    }

    // ---------------------- AUTHENTICATION ----------------------
    private authRequest() {
        app.post("auth/login/google", (req, res) => {
            auth.googleVerify(req.body.credential);
        })
    }

    listen() {
        app.listen(this.port, () => {
            console.log("listening on port %d", this.port);
        });
    }
}