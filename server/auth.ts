import { OAuth2Client } from "google-auth-library";
import * as dotenv from "dotenv";
dotenv.config();

// -- Auth verify for Google --
function googleVerify(token: string) {
	const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
	async function verify() {
		console.log("sadfasdf");
		const ticket = await googleClient.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID
		});
		const payload = ticket.getPayload();
		if (payload === undefined) return;
		const userid = payload['sub'];
		console.log(userid);
	}
	verify().catch(console.error);
}

export { googleVerify };