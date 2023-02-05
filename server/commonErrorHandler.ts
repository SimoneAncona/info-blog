import * as dotenv from "dotenv";
dotenv.config();

export type ErrorType = 
	"authentication" | 
	"databaseQueryError" |
	"databaseConnectionError" |
	"incorrectCredentials";

export interface ErrorObject {
	type: ErrorType,
	message: string,
	trace: string | undefined
}

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

export function displayError(error: ErrorObject) {
	console.error(error);
}