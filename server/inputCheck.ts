import { sendQuery } from "./dbHandler";
import { ErrorObject } from "./interfaces";
import { error } from "./commonErrorHandler";

export function checkUsername(username: string): null | ErrorObject {
	if (!/^[\w.-]+$/.test(username)) return error("clientInputFormatError", "Username accept only alphanumeric chars or _ . -");
	return null
}

