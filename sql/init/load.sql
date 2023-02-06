-- Active: 1675672694253@@127.0.0.1@3306@info_world
USE info_world;
INSERT INTO `role`(`name`)
VALUES 
	("admin"),
	("superuser"),
	("advanced"),
	("normal"),
	("rookie");
INSERT INTO `permission`(`name`)
VALUES
	("publishArticles"),
	("publishTutorials"),
	("censorArticles"),
	("banUsers"),	
	("removeUsers"),	
	("comment"),
	("postQuestions"),
	("answerQuestions"),
	("createSandboxes");
INSERT INTO `role_permission` (`role`, `permission`)
VALUES
	("admin", "publishArticles"),
	("admin", "publishTutorials"),
	("admin", "censorArticles"),
	("admin", "banUsers"),	
	("admin", "removeUsers"),	
	("admin", "comment"),
	("admin", "postQuestions"),
	("admin", "answerQuestions"),
	("admin", "createSandboxes"),

	("superuser", "publishArticles"),
	("superuser", "publishTutorials"),
	("superuser", "censorArticles"),
	("superuser", "banUsers"),		
	("superuser", "comment"),
	("superuser", "postQuestions"),
	("superuser", "answerQuestions"),
	("superuser", "createSandboxes"),

	("advanced", "publishArticles"),
	("advanced", "publishTutorials"),		
	("advanced", "comment"),
	("advanced", "postQuestions"),
	("advanced", "answerQuestions"),
	("advanced", "createSandboxes"),
	
	("normal", "comment"),
	("normal", "postQuestions"),
	("normal", "answerQuestions"),
	("normal", "createSandboxes"),

	("rookie", "comment"),
	("rookie", "postQuestions"),
	("rookie", "answerQuestions");
INSERT INTO `user` (username, `password`, email, birth, `role`)
VALUES (
	"admin",
	"4487226b996ad661726e7d4afa86d79d0df7c64bddeb28b3f4c42c5abf2a4f6f", -- result of sha256 encryption of ADMIN_PASSWORD + SHA256_SALT (check .env)
	"simone.ancona00@gmail.com",
	"2004-07-20",
	"admin"
)