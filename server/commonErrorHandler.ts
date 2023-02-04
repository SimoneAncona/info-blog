import * as dotenv from "dotenv";
dotenv.config();

export enum ErrorType {
	AUTHENTICATION,

}

interface ErrorObject {
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