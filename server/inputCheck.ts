import { sendQuery } from "./dbHandler.js";
import { ErrorObject } from "./interfaces.js";
import { error } from "./commonErrorHandler.js";
import { RowDataPacket } from "mysql2";

export async function checkUsername(username: string): Promise<null | ErrorObject> {
	if (!/^[\w.-]+$/.test(username)) return error("clientInputFormatError", "Username accept only alphanumeric chars or _ . -");
	if ((await sendQuery("SELECT * FROM `user` WHERE `username` = ?", [username]) as Array<RowDataPacket>).length !== 0)
		return error("clientInputFormatError", "This username has been alredy taken");
	return null
}

export function checkBirth(birth: string): null | ErrorObject {
	if (isNaN(Date.parse(birth))) return error("clientInputFormatError", "Error birth date format");

	if (Date.now() - Date.parse(birth) < 0) return error("clientInputFormatError", "Error birth date format");

	if ((Date.now() - Date.parse(birth)) / 31556952000 < 16) {
		return error("clientInputFormatError", "Error birth date format");
	}

	if ((Date.now() - Date.parse(birth)) / 31556952000 > 120) {
		return error("clientInputFormatError", "Error birth date format");
	}
	return null;
}

export async function checkEmail(email: string): Promise<null | ErrorObject> {
	if (!email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	)) return error("clientInputFormatError", "Invalid email format");
	

	if ((await sendQuery("SELECT * FROM `user` WHERE `email` = ?", [email]) as Array<RowDataPacket>).length !== 0)
		return error("clientInputFormatError", "A user with this email already exists");
	return null;
}