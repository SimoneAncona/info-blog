import { sendQuery } from "./dbHandler";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as path from "path";
import * as auth from "./auth";
import * as bodyParser from "body-parser";
import { TokenPayload } from "google-auth-library";
import { error, isError } from "./commonErrorHandler";
import { ErrorObject, ErrorType, User } from "./interfaces";
import { RowDataPacket } from "mysql2";
import * as fs from "fs";
import { checkBirth, checkEmail, checkUsername } from "./inputCheck";
import { setMedia } from "./mediaHandler";
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

	private resolvePage(str: string): string {
		const p = path.join(__dirname, str);
		if (fs.existsSync(p)) return p;
		else return path.join(__dirname, "../client/pages/error404.html");
	}

	// ---------------------- PAGES ----------------------
	private pageRequest() {
		app.get("/", (req, res) => {
			res.sendFile(this.resolvePath("../client/pages/index.html"));
		});

		app.get("/signin/", async (req, res) => {
			let email = req.query.email as string;
			if (email === undefined) {
				res.sendFile(this.resolvePath("../client/pages/signin.html"));
				return;
			}
			let dbResponse;
			try {
				dbResponse = await sendQuery("SELECT * FROM `pendingRegistration` WHERE `email` = ?", [email])
			} catch (e) {
				res.send(e);
				return;
			}
			if ((<Array<RowDataPacket>>dbResponse).length === 0) {
				res.sendFile(this.resolvePath("../client/pages/error.html"));
				return;
			}

			// if it's not registered need to register
			let r;
			try {
				r = await sendQuery("SELECT * FROM `pendingRegistration` WHERE email = ?", [email]);
			} catch (e) {
				res.send(e as ErrorObject);
				return;
			}

			if ((<Array<RowDataPacket>>r).length != 0) {
				for (let row of (<Array<RowDataPacket>>r)) {
					if (row.email === email && row.pendingSecret === req.cookies.googleSecret) {
						res.sendFile(this.resolvePath("../client/pages/google-signin.html"));
						return;
					}
				}
				res.sendFile(this.resolvePath("../client/pages/error.html"));
				return;
			}
			res.sendFile(this.resolvePath("../client/pages/google-signin.html"));
		})

		app.get("/:page/", (req, res) => {
			res.sendFile(this.resolvePage((`../client/pages/${req.params.page}.html`)));
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

		// get profile picture
		app.post("/resources/avatar", async (req, res) => {
			let dbResponse;
			let url;
			try {
				dbResponse = ((await sendQuery("SELECT * FROM `user` WHERE username = ?", [req.body.username]))as Array<RowDataPacket>)[0].profilePicture;
				url = ((await sendQuery("SELECT * FROM `media` WHERE id = ?", [dbResponse]))as Array<RowDataPacket>)[0].path as string;
				if (url.startsWith("http")) {
					res.send({url: url});
					return;
				}
				res.send({url: "/resources/media?id=" + dbResponse});
				return;
			} catch (e) {
				res.send(e);
				return;
			}
		});

		app.get("/resources/media", async (req, res) => {
			let dbResponse;
			try {
				dbResponse = ((await sendQuery("SELECT * FROM `media` WHERE id = ?", [req.query.id]))as Array<RowDataPacket>)[0].path as string;

				if (dbResponse.startsWith("http")) {
					res.sendFile(dbResponse);
					return;
				}
				res.sendFile(dbResponse);
			} catch(e) {
				res.send(e);
			}
		})
	}

	// ---------------------- AUTHENTICATION ----------------------
	private authRequest() {
		// login with google
		app.post("/auth/login/google", async (req, res) => {
			const session = await auth.handleAutoLoginWithSessions(req.cookies);
			if (isError(session)) {
				res.send(session);
				return;
			}
			if (session !== undefined) {
				res.send(session);
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

			if (
				payload === undefined ||
				payload.email === undefined ||
				payload.name === undefined ||
				payload.picture === undefined
			) {
				res.send(error("authentication", "An error occurred while authenticating with google"));
				return;
			}

			// check if exists in database
			const user = await auth.getUser(payload.email);
			if (isError(user)) {
				res.send(user as ErrorObject);
				return;
			}

			let googleSecret: string;
			if (!("googleSecret" in req.cookies)) {
				googleSecret = auth.casualSecret();
				res.cookie("googleSecret", googleSecret, { expires: auth.expiresSession().toDate() });
			} else {
				googleSecret = req.cookies.googleSecret;
			}

			// check if it is registered
			if (user === undefined || (user as User).username === "") {
				// if it's not registered need to register
				let dbRes;
				try {
					dbRes = await sendQuery("SELECT * FROM `pendingRegistration` WHERE email = ? AND pendingSecret", [payload.email, googleSecret]);
				} catch (e) {
					res.send(e);
					return;
				}

				if ((dbRes as Array<RowDataPacket>).length === 0) {
					try {
						await sendQuery("INSERT INTO `pendingRegistration`(`email`, `isGoogle`, `pendingSecret`) VALUES (?, TRUE, ?)", [payload.email, googleSecret]);
					} catch (e) {
						res.send(e as ErrorObject);
						return;
					}
				}

				if (user === undefined) {
					let photo = await setMedia(payload.picture);
					if (isError(photo)) {
						res.send(photo);
						return;
					}
					const u = {
						username: "",
						password: "",
						email: payload.email,
						isGoogle: true,
						birth: "",
						role: "rookie",
						level: 0,
						phone: "",
						twoStepAuth: false,
						profilePicture: photo
					};
					let r = await auth.setUser(u as User);
					if (isError(r)) {
						res.send(r);
						return;
					}
				}

				res.send(error("registrationRequired", "You must sign in", false, { email: payload.email }));
				return;
			}

			const secret = auth.casualSecret();
			const expires = auth.expiresSession();

			try {
				await sendQuery("INSERT INTO session (sessionSecret, user) VALUES (?, ?)", [secret, (user as User).id]);
			} catch (e) {
				res.send(e as ErrorObject);
				return;
			}

			res.cookie("sessionSecret", secret, { expires: expires.toDate() });
			res.cookie("username", (user as User).username, { expires: expires.toDate() });

			res.send(user as User);
		});

		app.post("/auth/confirm/google", async (req, res) => {
			let dbResponse;
			try {
				dbResponse = await sendQuery("SELECT * FROM pendingRegistration WHERE email = ? AND pendingSecret = ?", [req.body.email, req.cookies.googleSecret]);
			} catch (e) {
				res.send(e);
				return;
			}

			if ((dbResponse as Array<RowDataPacket>).length === 0) {
				res.send(error("authentication", "Cannot confirm email"));
				return;
			}

			let checkUser = await checkUsername(req.body.username);
			if (checkUser != null) {
				res.send(checkUser);
				return;
			}

			let checkBir = checkBirth(req.body.birth);
			if (checkBir != null) {
				res.send(checkBir);
				return;
			}
			let r;

			let photo
			try {
				photo = ((await sendQuery("SELECT * FROM `user` WHERE email = ?", [req.body.email]))as Array<RowDataPacket>)[0].profilePicture;
			} catch (e) {
				res.send(e);
				return;
			}

			const u = {
				username: req.body.username,
				password: "",
				email: req.body.email,
				isGoogle: true,
				birth: req.body.birth,
				role: "rookie",
				level: 0,
				phone: req.body.phone,
				twoStepAuth: false,
				profilePicture: photo 
			};
			r = await auth.setUser(u as User);
			if (isError(r)) {
				res.send(r);
				return;
			}

			const secret = auth.casualSecret();
			const expires = auth.expiresSession();

			try {
				await sendQuery("INSERT INTO session (sessionSecret, user) VALUES (?, ?)", [secret, (r as User).id]);
			} catch (e) {
				res.send(e as ErrorObject);
				return;
			}

			res.cookie("sessionSecret", secret, { expires: expires.toDate() });
			res.cookie("username", (r as User).username, { expires: expires.toDate() });

			res.send(r as User);
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
			let dbResponse;
			try {
				dbResponse = await sendQuery(queryString, [req.body.username, req.body.password]);
			} catch (e) {
				res.send(e);
				return;
			}

			if ((dbResponse as Array<RowDataPacket>).length === 0) {
				res.send(error("incorrectCredentials", "Credentials are incorrect", false));
			}
		});

		app.post("/auth/signin", async (req, res) => {
			let checkUser = await checkUsername(req.body.username);
			if (checkUser != null) {
				res.send(checkUser);
				return;
			}

			let checkBir = checkBirth(req.body.birth);
			if (checkBir != null) {
				res.send(checkBir);
				return;
			}

			let checkMail = await checkEmail(req.body.email);
			if (checkMail != null) {
				res.send(checkMail);
				return;
			}

			const u = {
				username: req.body.username,
				password: req.body.password,
				email: req.body.email,
				isGoogle: false,
				birth: req.body.birth,
				role: "rookie",
				level: 0,
				phone: req.body.phone,
				twoStepAuth: false,
				profilePicture: await setMedia(this.resolvePath("../media/default/default_icon_" + Math.round(Math.random() * 4 + 1) + ".png")) 
			};

			console.log(u);

			let r = await auth.setUser(u as User);
			if (isError(r)) {
				res.send(r);
				return;
			}

			const secret = auth.casualSecret();
			const expires = auth.expiresSession();

			try {
				await sendQuery("INSERT INTO session (sessionSecret, user) VALUES (?, ?)", [secret, (r as User).id]);
			} catch (e) {
				res.send(e as ErrorObject);
				return;
			}

			res.cookie("sessionSecret", secret, { expires: expires.toDate() });
			res.cookie("username", (r as User).username, { expires: expires.toDate() });

			res.send(r as User);
		});

		app.post("/auth/check-username", async (req, res) => {
			const queryString = "SELECT * FROM `user` WHERE username = ?";
			let dbResponse;

			try {
				dbResponse = await sendQuery(queryString, [req.body.username]);
			} catch (e) {
				res.send(e);
				return;
			}


			res.send({ exists: (dbResponse as Array<RowDataPacket>).length != 0 });

		});

		app.post("/auth/check-email", async (req, res) => {
			const queryString = "SELECT * FROM `user` WHERE email = ?";
			let dbResponse;

			try {
				dbResponse = await sendQuery(queryString, [req.body.email]);
			} catch (e) {
				res.send(e);
				return;
			}


			res.send({ exists: (dbResponse as Array<RowDataPacket>).length != 0 });

		});
	}

	listen() {
		app.listen(this.port, () => {
			console.log("listening on port %d", this.port);
		});
	}
}