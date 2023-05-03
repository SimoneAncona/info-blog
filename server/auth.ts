import { OAuth2Client, TokenPayload } from "google-auth-library";
import { sendQuery } from "./dbHandler.js";
import dotenv from "dotenv";
import { error, isError } from "./commonErrorHandler.js";
import { ErrorObject, Permission, User } from "./interfaces.js";
import { RowDataPacket } from "mysql2";
import moment from "moment";
import { CookieOptions, Request, Response } from "express";
import { setMedia } from "./mediaHandler.js";

dotenv.config();

// -- Auth verify for Google --
async function googleVerify(token: string) {
	const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
	async function verify() {
		const ticket = await googleClient.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID
		});
		const payload = ticket.getPayload();
		return payload;
	}
	return verify();
}

export async function handleAutoLoginWithSessions(cookies: any): Promise<undefined | User | ErrorObject> {
	if (!("sessionSecret" in cookies && "username" in cookies)) return undefined;

	// check session secret
	let session;
	try {
		session = await sendQuery("SELECT * FROM user, session WHERE user.id = session.user AND user.username = ? AND session.sessionSecret = ?", [cookies.username, cookies.sessionSecret]);
	} catch (e) {
		return e as ErrorObject;
	}

	if ((session as Array<RowDataPacket>).length === 0) return undefined;

	return {
		id: (session as Array<RowDataPacket>)[0].id,
		username: (session as Array<RowDataPacket>)[0].username,
		password: (session as Array<RowDataPacket>)[0].password,
		email: (session as Array<RowDataPacket>)[0].email,
		isGoogle: (session as Array<RowDataPacket>)[0].isGoogle,
		birth: (session as Array<RowDataPacket>)[0].birth,
		role: (session as Array<RowDataPacket>)[0].role,
		level: (session as Array<RowDataPacket>)[0].level,
		phone: (session as Array<RowDataPacket>)[0].phone,
		twoStepAuth: (session as Array<RowDataPacket>)[0].twoStepAuth,
	} as User;
}

export function casualSecret(): string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let s = "";
	for (let i = 0; i < 64; i++) {
		s += chars[Math.round(Math.random() * (chars.length - 1))];
	}
	return s;
}

export function expiresSession(): moment.Moment {
	return moment().add(2, "month");
}

export async function getUser(email: string): Promise<User | ErrorObject | undefined> {
	let dbResponse;
	try {
		dbResponse = await sendQuery("SELECT * FROM `user` WHERE `email` = ?", [email]);
	} catch (e) {
		return e as ErrorObject;
	}
	return (dbResponse as Array<RowDataPacket>)[0] as User;
}

export async function setUser(user: User): Promise<ErrorObject | User> {
	let dbResponse;
	let newUser;
	try {
		dbResponse = await sendQuery("SELECT * FROM `user` WHERE email = ?", [user.email]);
		if ((dbResponse as Array<RowDataPacket>).length !== 0) {
			dbResponse = await sendQuery("DELETE FROM `user` WHERE email = ?", [user.email]);
		}
		dbResponse = await sendQuery("INSERT INTO `user`(`username`, `password`, `email`, `isGoogle`, `birth`, `role`, `level`, `phone`, `twoStepAuth`, `profilePicture`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
			user.username,
			user.password,
			user.email,
			user.isGoogle,
			user.birth,
			user.role,
			user.level,
			user.phone,
			user.twoStepAuth,
			user.profilePicture
		]);
		newUser = await sendQuery("SELECT * FROM `user` WHERE email = ?", [user.email]);
	} catch (e) {
		return e as ErrorObject;
	}
	return (newUser as Array<RowDataPacket>)[0] as User;
}

export async function removePendingRegistration(email: string) {
	await sendQuery("DELETE FROM `pendingRegistration` WHERE email = ?", [email]);
}

export class AuthGuard {

	res: Response;
	req: Request;

	constructor(req: Request, res: Response) {
		this.res = res;
		this.req = req;
	}

	async checkPermissions(permissions: Permission[]) {
		let user = await handleAutoLoginWithSessions(this.req.cookies);
		if (user === undefined || isError(user)) return false;
		let userPermissions = await this._getUserPermissions(
			(user as User).username
		);
		if (userPermissions === null) return false;
		for (let permission of permissions) {
			if (!userPermissions.includes(permission)) return false;
		}
		return true;
	}

	async isAdmin() {
		let user = await handleAutoLoginWithSessions(this.req.cookies);
		if (user === undefined || isError(user)) return false;

		return (user as User).role === "admin";
	}

	async _getUserPermissions(username: string) {
		try {
			let permissions = await sendQuery("SELECT permission FROM rolepermission WHERE role = (SELECT role FROM `user` WHERE `username` = ?)", [username]) as unknown as Permission[];
			return permissions;
		} catch (e) {
			this.res.status(500).send();
			return null;
		}
	}
}

export async function setupSession(res: Response, user: User) {
	const secret = casualSecret();
			const expires = expiresSession();

			try {
				await sendQuery("INSERT INTO session (sessionSecret, user) VALUES (?, ?)", [secret, user.id]);
			} catch (e) {
				res.status(500).send(e as ErrorObject);
				return false;
			}

			res.cookie("sessionSecret", secret, { expires: expires.toDate() });
			res.cookie("username", user.username, { expires: expires.toDate() });

			return true;
}

export class GoogleAuth {

	res: Response;
	req: Request;

	constructor(req: Request, res: Response) {
		this.req = req;
		this.res = res;
	}

	async googleLogin() {
		const session = await handleAutoLoginWithSessions(this.req.cookies);
			if (isError(session)) {
				this.res.send(session);
				return;
			}
			if (session !== undefined) {
				this.res.send(session);
				return;
			}
			if (!("credential" in this.req.body)) {
				return;
			}

			let payload;
			try {
				payload = await googleVerify(this.req.body.credential);
			} catch {
				this.res.status(500).send(error("authentication", "An error occurred while logging in with google"));
				return;
			}

			if (
				payload === undefined ||
				payload.email === undefined ||
				payload.name === undefined ||
				payload.picture === undefined
			) {
				this.res.status(500).send(error("authentication", "An error occurred while authenticating with google"));
				return;
			}

			// check if exists in database
			const user = await getUser(payload.email);
			if (isError(user)) {
				this.res.status(500).send(user as ErrorObject);
				return;
			}

			let googleSecret: string;
			if (!("googleSecret" in this.req.cookies)) {
				googleSecret = casualSecret();
				this.res.cookie("googleSecret", googleSecret, { expires: expiresSession().toDate() });
			} else {
				googleSecret = this.req.cookies.googleSecret;
			}

			// check if it is registered
			if (user === undefined || (user as User).username === "") {
				// if it's not registered need to register
				let dbRes;
				try {
					dbRes = await sendQuery("SELECT * FROM `pendingRegistration` WHERE email = ? AND pendingSecret", [payload.email, googleSecret]);
				} catch (e) {
					this.res.status(500).send(e);
					return;
				}

				if ((dbRes as Array<RowDataPacket>).length === 0) {
					try {
						await sendQuery("INSERT INTO `pendingRegistration`(`email`, `isGoogle`, `pendingSecret`) VALUES (?, TRUE, ?)", [payload.email, googleSecret]);
					} catch (e) {
						this.res.status(500).send(e as ErrorObject);
						return;
					}
				}

				if (user === undefined) {
					let photo = await setMedia(payload.picture);
					if (isError(photo)) {
						this.res.status(500).send(photo);
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
					let r = await setUser(u as User);
					if (isError(r)) {
						this.res.status(500).send(r);
						return;
					}
				}

				this.res.status(401).send(error("registrationRequired", "You must sign in", false, { email: payload.email }));
				return;
			}

			if(!await setupSession(this.res, user as User)) return;

			this.res.send(user as User);
	}
}

export { googleVerify };