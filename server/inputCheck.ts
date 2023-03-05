import { sendQuery } from "./dbHandler";
import { ErrorObject } from "./interfaces";
import { error } from "./commonErrorHandler";

export function checkUsername(username: string): null | ErrorObject {
	if (!/^[\w.-]+$/.test(username)) return error("clientInputFormatError", "Username accept only alphanumeric chars or _ . -");
	return null
}

export function checkBirth(birth: string) {
	if (isNaN(Date.parse(birth))) return error("clientInputFormatError", "Error birth date format");

	if (Date.now() - Date.parse(birth) < 0) return error("clientInputFormatError", "Error birth date format");

	if ((Date.now() - Date.parse(birth)) / 31556952000 < 16) {
		return error("clientInputFormatError", "Error birth date format");
	}

	if ((Date.now() - Date.parse(birth)) / 31556952000 > 120) {
		return error("clientInputFormatError", "Error birth date format");
	}
}