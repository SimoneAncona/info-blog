import { sendQuery } from "./dbHandler";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as path from "path";
import * as auth from "./auth";
import * as bodyParser from "body-parser";
import { GoogleAuth } from "./auth";
import { error, isError } from "./commonErrorHandler";
import { ErrorObject, ErrorType, User } from "./interfaces";
import { RowDataPacket } from "mysql2";
import * as fs from "fs";
import { checkBirth, checkEmail, checkUsername } from "./inputCheck";
import { setMedia } from "./mediaHandler";
import { buildHtmlArticle, getLatestNews, getNewsInfo } from "./articleResponseHandler";
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

		this.pageRequests();
		this.resourcesRequests();
		this.authRequests();

		this.newsRequests();
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
	private pageRequests() {
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
		});

		app.get("/admin/", async (req, res) => {
			const guard = new auth.AuthGuard(req, res);
			if (!(await guard.isAdmin())) {
				res.status(403).sendFile(this.resolvePath("../client/pages/error403.html"));
				return;
			}
			res.sendFile(this.resolvePath("../client/pages/admin.html"));
		});

		app.get("/profile/", async (req, res) => {
			let user = await auth.handleAutoLoginWithSessions(req.cookies);
			if (user === undefined || isError(user)) {
				res.redirect("/login");
			}
			res.sendFile(this.resolvePath("../client/pages/profile.html"));
		});

		app.get("/:page/", (req, res) => {
			res.sendFile(this.resolvePage((`../client/pages/${req.params.page}.html`)));
		});
	}

	// ---------------------- CLIENT RESOURCES ----------------------
	private resourcesRequests() {
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
					res.send(url);
					return;
				}
				res.send("/resources/media?id=" + dbResponse);
				return;
			} catch (e) {
				res.status(500).send(e);
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
				res.status(500).send(e);
			}
		});
	}

	// ---------------------- AUTHENTICATION ----------------------
	private authRequests() {
		// login with google
		app.post("/auth/login/google", async (req, res) => {
			let googleAuth = new GoogleAuth(req, res);
			googleAuth.googleLogin();
		});

		app.post("/auth/confirm/google", async (req, res) => {
			let dbResponse;
			try {
				dbResponse = await sendQuery("SELECT * FROM pendingRegistration WHERE email = ? AND pendingSecret = ?", [req.body.email, req.cookies.googleSecret]);
			} catch (e) {
				res.status(500).send(e);
				return;
			}

			if ((dbResponse as Array<RowDataPacket>).length === 0) {
				res.status(500).send(error("authentication", "Cannot confirm email"));
				return;
			}

			let checkUser = await checkUsername(req.body.username);
			if (checkUser != null) {
				res.status(400).send(checkUser);
				return;
			}

			let checkBir = checkBirth(req.body.birth);
			if (checkBir != null) {
				res.status(400).send(checkBir);
				return;
			}
			let r;

			let photo
			try {
				photo = ((await sendQuery("SELECT * FROM `user` WHERE email = ?", [req.body.email]))as Array<RowDataPacket>)[0].profilePicture;
			} catch (e) {
				res.status(500).send(e);
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
				res.status(500).send(r);
				return;
			}

			if(!await auth.setupSession(res, r as User)) return;

			auth.removePendingRegistration((r as User).email);

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
				res.status(500).send(e);
				return;
			}

			if ((dbResponse as Array<RowDataPacket>).length === 0) {
				res.status(401).send(error("incorrectCredentials", "Credentials are incorrect", false));
				return;
			}

			let u = {
				id: (dbResponse as Array<RowDataPacket>)[0].id,
				username: (dbResponse as Array<RowDataPacket>)[0].username,
				password: (dbResponse as Array<RowDataPacket>)[0].password,
				email: (dbResponse as Array<RowDataPacket>)[0].email,
				isGoogle: (dbResponse as Array<RowDataPacket>)[0].isGoogle,
				birth: (dbResponse as Array<RowDataPacket>)[0].birth,
				role: (dbResponse as Array<RowDataPacket>)[0].role,
				twoStepAuth: (dbResponse as Array<RowDataPacket>)[0].twoStepAuth,
				profilePicture: (dbResponse as Array<RowDataPacket>)[0].profilePicture,
			} as User;

			if(!await auth.setupSession(res, u as User)) return;

			res.send(u);
		});

		app.post("/auth/signin", async (req, res) => {
			let checkUser = await checkUsername(req.body.username);
			if (checkUser != null) {
				res.status(400).send(checkUser);
				return;
			}

			let checkBir = checkBirth(req.body.birth);
			if (checkBir != null) {
				res.status(400).send(checkBir);
				return;
			}

			let checkMail = await checkEmail(req.body.email);
			if (checkMail != null) {
				res.status(400).send(checkMail);
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

			let r = await auth.setUser(u as User);
			if (isError(r)) {
				res.status(500).send(r);
				return;
			}

			if(!await auth.setupSession(res, r as User)) return;

			res.send(r as User);
		});

		app.post("/auth/check-username", async (req, res) => {
			const queryString = "SELECT * FROM `user` WHERE username = ?";
			let dbResponse;

			try {
				dbResponse = await sendQuery(queryString, [req.body.username]);
			} catch (e) {
				res.status(500).send(e);
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
				res.status(500).send(e);
				return;
			}


			res.send({ exists: (dbResponse as Array<RowDataPacket>).length != 0 });

		});
	}

	// ------ NEWS / ARTICLES ------
	private newsRequests() {
		app.get("/news/latest", async (req, res) => {
			let news = await getLatestNews(12);
			if (isError(news)) {
				res.send(news);
				return;
			}

			res.send(news);
		});

		app.get("/news/:id", (req, res) => {
			res.sendFile(this.resolvePath("../client/pages/article.html"));
		});

		app.get("/news/content/:id", async (req, res) => {
			let id = Number(req.params.id);
			if (Number.isNaN(id)) {
				res.status(400).send();
				return;
			}
			try {
				let html = await buildHtmlArticle(id);
				res.send(html);
			} catch (e) {
				res.status(500).send(e);
			}
		});

		app.get("/news/info/:id", async (req, res) => {
			let id = Number(req.params.id);
			if (Number.isNaN(id)) {
				res.status(400).send();
				return;
			}
			try {
				let html = await getNewsInfo(id);
				res.send(html);
			} catch (e) {
				res.status(500).send(e);
			}
		});
	}

	listen() {
		app.listen(this.port, () => {
			console.log("listening on port %d", this.port);
		});
	}
}