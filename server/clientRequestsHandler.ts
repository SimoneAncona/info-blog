import { sendQuery } from "./dbHandler";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as path from "path";
import * as auth from "./auth";
import * as bodyParser from "body-parser";
import { TokenPayload } from "google-auth-library";
import { error } from "./commonErrorHandler";
import { ErrorType } from "./commonErrorHandler";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
        app.post("/auth/login/google", async (req, res) => {
            console.log(req.body);
            const payload = await auth.googleVerify(req.body.credential);
            if (payload === undefined) {
                res.send(this.handleGoogleAuthError());
                return;
            } 
            res.send(this.handleGoogleAuth(payload));
        });

        app.post("/auth/client-id/google", (req, res) => {
            res.send(process.env.GOOGLE_CLIENT_ID);
        });

        app.post("/auth/get-salt", (req, res) => {
            res.send(process.env.SHA256_SALT);
        })
    }

    private handleGoogleAuth(payload: TokenPayload) {

    }

    private handleGoogleAuthError() {
        return error(ErrorType.AUTHENTICATION, "An error occurred while authenticating with google");
    }

    listen() {
        app.listen(this.port, () => {
            console.log("listening on port %d", this.port);
        });
    }
}