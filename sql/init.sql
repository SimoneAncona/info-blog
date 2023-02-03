CREATE TABLE `Article` (

);
CREATE TABLE `User` (
	`Username` VARCHAR(255),
	`Password` CHAR(64), -- use sha256 for password encryption
	PRIMARY KEY(`Username`)
);
CREATE TABLE `Media` (

);