import * as dotenv from "dotenv";
import { ErrorObject, ErrorType } from "./interfaces.js";
dotenv.config();

export function error(etype: ErrorType, msg: string, showTrace = true, other = {}) {
	let errorObject: ErrorObject;
	errorObject = {
		type: etype,
		message: msg,
		trace: showTrace ? Error(msg).stack : undefined,
		other: other
	}

	if (process.env.TEST) {
		console.error(errorObject);
	}

	return errorObject;
}

export function isError(error: any) {
	if (typeof error !== "object") return false;
	return "type" in error && "message" in error && "trace" in error;
}