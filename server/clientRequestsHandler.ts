import { sendQuery } from "./dbHandler";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as path from "path";
import * as auth from "./auth";
import * as bodyParser from "body-parser";
import { TokenPayload } from "google-auth-library";
import { error, isError } from "./commonErrorHandler";
import { ErrorObject, ErrorType } from "./interfaces";
import { RowDataPacket } from "mysql2";
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

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
		// login with google
		app.post("/auth/login/google", async (req, res) => {
			const user = await auth.handleAutoLoginWithSessions(req.cookies);
			if (isError(user)) {
				res.send(user);
				return;
			}
			if (user !== undefined) {
				res.send(user);
				return;
			}
			if (!("credential" in req.body)) {
				return;
			}

			let payload;
			try {
				payload = await auth.googleVerify(req.body.credential);
			} catch {
				res.send(error("authentication", "An error occurred while logging in with google"));
				return;
			}
			res.send(auth.handleGoogleAuth(payload, req.cookies));
		});

		app.post("/auth/signin/google", async (req, res) => {

		})

		app.post("/auth/client-id/google", (req, res) => {
			res.send(process.env.GOOGLE_CLIENT_ID);
		});

		app.post("/auth/get-salt", (req, res) => {
			res.send(process.env.SHA256_SALT);
		});

		// normal login
		app.post("/auth/login", async (req, res) => {
			const queryString = "SELECT * FROM `user` WHERE username = ? AND `password` = ?";
			const dbResponse = await sendQuery(queryString, [req.body.username, req.body.password]);
			if (isError(dbResponse)) {
				res.send(dbResponse);
				return;
			}
			if ((dbResponse as Array<RowDataPacket>).length === 0) {
				res.send(error("incorrectCredentials", "Credentials are incorrect", false));
			}
		});

		app.post("/auth/check-username", async (req, res) => {
			const queryString = "SELECT * FROM `user` WHERE username = ?";
			const dbResponse = await sendQuery(queryString, [req.body.username, req.body.password]);
			if (isError(dbResponse)) {
				res.send(dbResponse);
				return;
			}
			if ((dbResponse as Array<RowDataPacket>).length === 0) {
				res.send(error("incorrectCredentials", "Credentials are incorrect", false));
			}
		})
	}

	listen() {
		app.listen(this.port, () => {
			console.log("listening on port %d", this.port);
		});
	}
}