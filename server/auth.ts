import { OAuth2Client, TokenPayload } from "google-auth-library";
import { sendQuery } from "./dbHandler";
import * as dotenv from "dotenv";
import { error, isError } from "./commonErrorHandler";
import { ErrorObject, User} from "./interfaces";
import { RowDataPacket } from "mysql2";
import * as moment from "moment";

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
	const session = await sendQuery("SELECT * FROM user, session WHERE user.username = session.user AND user.username = ? AND session.sessionSecret = ?", [cookies.username, cookies.sessionSecret]);
	if (isError(session)) return session as ErrorObject;

	if ((session as Array<RowDataPacket>).length === 0) return undefined;

	return {
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

export async function handleGoogleAuth(payload: TokenPayload | undefined, cookies: any): Promise<ErrorObject | User> {
	if (
		payload === undefined ||
		payload.email === undefined ||
		payload.name === undefined
	) 
	return error("authentication", "An error occurred while authenticating with google");
	// check if exists in database
	const user = await getUser(payload.email);
	if (isError(user)) return user as ErrorObject;

	// check if it is registered
	if (user === undefined) return error("registrationRequired", "You must sign in");
	setSession(user as User, cookies);
	return user as User;
}

async function setSession(user: User, cookies: any): Promise<ErrorObject | null> {
	const secret = casualSessionSecret();
	const expires = expiresSession();

	try {
		await sendQuery("INSERT INTO session ()")
	} catch(e) {
		return e as ErrorObject;
	}
	return null;
}

function casualSessionSecret(): string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let s = "";
	for (let i = 0; i < 64; i++) {
		s = chars[Math.round(Math.random() * chars.length - 1)];
	}
	return s;
}

function expiresSession(): moment.Moment {
	return moment().add(3, "month");
}

async function getUser(email: string): Promise<User | ErrorObject | undefined> {
	const dbResponse = await sendQuery("SELECT * FROM `user` WHERE `email` = ?", [email]);
	if (isError(dbResponse)) return dbResponse as ErrorObject;
	return (dbResponse as Array<RowDataPacket>)[0] as User;
}

export { googleVerify };