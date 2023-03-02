INSERT INTO `user` (username, `password`, email, birth, `role`)
VALUES (
	"admin",
	"4487226b996ad661726e7d4afa86d79d0df7c64bddeb28b3f4c42c5abf2a4f6f", -- result of sha256 encryption of ADMIN_PASSWORD + SHA256_SALT (check .env)
	"simone.ancona00@gmail.com",
	"2004-07-20",
	"admin"
)