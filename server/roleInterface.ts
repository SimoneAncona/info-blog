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