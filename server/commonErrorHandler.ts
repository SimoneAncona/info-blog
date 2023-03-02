import * as dotenv from "dotenv";
import { ErrorObject, ErrorType } from "./interfaces";
dotenv.config();

export function error(etype: ErrorType, msg: string, showTrace = true) {
	let errorObject: ErrorObject;
	errorObject = {
		type: etype,
		message: msg,
		trace: showTrace ? Error(msg).stack : undefined
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