import { OAuth2Client, TokenPayload } from "google-auth-library";
import { sendQuery } from "./dbHandler";
import * as dotenv from "dotenv";
import { error, isError } from "./commonErrorHandler";
import { ErrorObject, User } from "./interfaces";
import { RowDataPacket } from "mysql2";
import * as moment from "moment";
import { CookieOptions } from "express";

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
	return moment().add(3, "month");
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

export { googleVerify };