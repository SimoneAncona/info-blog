import * as dotenv from "dotenv";
dotenv.config();

export enum ErrorType {
	AUTHENTICATION,
	DATABASE_QUERY_ERROR,
	DATABASE_CONNECTION_ERROR
}

export interface ErrorObject {
	type: ErrorType,
	message: string,
	trace: string | undefined
}

export function error(etype: ErrorType, msg: string) {
	let errorObject: ErrorObject;
	errorObject = {
		type: etype,
		message: msg,
		trace: Error(msg).stack
	}

	if (process.env.TEST) {
		console.error(errorObject);
	}
	return errorObject;
}