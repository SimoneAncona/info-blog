export type RoleName = "admin" | "superuser" | "advanced" | "normal" | "rookie";
export type Permission = 
	"publishArticles" |		// can publish articles
	"publishTutorials" |	// can publish tutorials
	"censorArticles" | 		// can censor others articles
	"banUsers" | 			// can ban users
	"removeUsers" | 		// can remove users
	"comment" |				// can comment others articles/tutorials
	"postQuestions" |		// can post questions on forums
	"answerQuestions" |		// can answer questions on forums
	"createSandboxes";		// can create a sandbox
export interface Role {
	name: RoleName,
	permissions: Array<Permission>
};

export type User = {
	id?: number, 
	username: string
	password: string
	email: string
	isGoogle: boolean
	birth: string
	role: RoleName
	level: number
	phone: string
	twoStepAuth: boolean
	profilePicture: number
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

// /news/cover
export type NewsCover = {
	id: number,
	title: string,
	subTitle: string,
	date: string,
	user: string,
	userPicture: number,
}

type TextAlignment = "center" | "right" | "left" | "justify";
type TextPosition = "left" | "right";
type ImagePosition = "center" | "left" | "right";

export type Paragraph = {
	id: number,
	article: number,
	position: number,
	textAlignment: TextAlignment,
	textPosition: TextPosition,
	text: string | null,
	imagePosition: ImagePosition,
	image: number
}