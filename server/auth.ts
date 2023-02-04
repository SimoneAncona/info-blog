import { OAuth2Client } from "google-auth-library";
import * as dotenv from "dotenv";
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

export { googleVerify };