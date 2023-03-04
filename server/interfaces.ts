import { RoleName } from "./roleInterface"

export type User = {
	username: string
	password: string
	email: string
	isGoogle: boolean
	birth: string
	role: RoleName
	level: number
	phone: string
	twoStepAuth: boolean
}

export type ErrorType = 
	"authentication" | 
	"databaseQueryError" |
	"databaseConnectionError" |
	"incorrectCredentials" |
	"registrationRequired" |
	"clientRequestError" |
	"clientInputFormatError";

export type ErrorObject = {
	type: ErrorType,
	message: string,
	trace: string | undefined
	other: any
}
