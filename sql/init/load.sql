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