import { OAuth2Client, TokenPayload } from "google-auth-library";
import * as dotenv from "dotenv";
import { ErrorObject, error } from "./commonErrorHandler";
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

export function handleGoogleAuth(payload: TokenPayload | undefined, cookies: any): ErrorObject {
	if (payload === undefined) return error("authentication", "An error occurred while authenticating with google");
}

export { googleVerify };