-- Active: 1677797151222@@127.0.0.1@3306@infoworld
CREATE DATABASE IF NOT EXISTS infoWorld;
USE infoWorld;
CREATE TABLE IF NOT EXISTS `role` (
	`name` VARCHAR(255),
	PRIMARY KEY(`name`)
);
CREATE TABLE IF NOT EXISTS `media` (
	`id` INT AUTO_INCREMENT,
	`path` VARCHAR(255) NOT NULL,
	`date` DATE NOT NULL,
	PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `user` (
	`id` INT AUTO_INCREMENT,
	`username` VARCHAR(255),
	`password` CHAR(64), -- use sha256 for password encryption
	`email` VARCHAR(255) NOT NULL,
	`isGoogle` BOOLEAN NOT NULL DEFAULT 0,
	`birth` DATE NOT NULL,
	`role` VARCHAR(255) NOT NULL DEFAULT 'rookie',
	`level` INT NOT NULL DEFAULT 0,
	`phone` VARCHAR(255),
	`twoStepAuth` BOOLEAN DEFAULT FALSE,
	`profilePicture` INT NOT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`role`) REFERENCES `role`(`name`),
	FOREIGN KEY(`profilePicture`) REFERENCES `media`(`id`)
);

CREATE TABLE IF NOT EXISTS `category` (
	`name` VARCHAR(255),
	PRIMARY KEY(`name`)
);

CREATE TABLE IF NOT EXISTS `userCategory` (
	`user` INT,
	`category` VARCHAR(255),
	PRIMARY KEY (`user`, `category`),
	FOREIGN KEY (`user`) REFERENCES `user`(`id`),
	FOREIGN KEY (`category`) REFERENCES `category`(`name`)
);

CREATE TABLE IF NOT EXISTS `article` (
	`id` INT AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL,
	`subTitle` VARCHAR(255) NOT NULL,
	`date` DATE NOT NULL,
	`user` INT NOT NULL,
	`path` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`user`) REFERENCES `user`(`id`)
);

CREATE TABLE IF NOT EXISTS `articleCategory` (
	`article` INT,
	`category` VARCHAR(255),
	PRIMARY KEY(`article`, `category`),
	FOREIGN KEY(`article`) REFERENCES `article`(`id`),
	FOREIGN KEY(`category`) REFERENCES `category`(`name`)
);

CREATE TABLE IF NOT EXISTS `permission` (
	`name` VARCHAR(255),
	PRIMARY KEY(`name`)
);
CREATE TABLE IF NOT EXISTS `rolePermission` (
	`role` VARCHAR(255),
	`permission` VARCHAR(255),
	PRIMARY KEY(`role`, `permission`),
	FOREIGN KEY(`role`) REFERENCES `role`(`name`),
	FOREIGN KEY(`permission`) REFERENCES `permission`(`name`)
);

CREATE TABLE IF NOT EXISTS `session` (
	`id` INT AUTO_INCREMENT,
	`sessionSecret` CHAR(64) NOT NULL,
	`user` INT NOT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`user`) REFERENCES `user`(`id`)
);

CREATE TABLE IF NOT EXISTS `pendingRegistration` (
	`id` INT AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL,
	`isGoogle` BOOLEAN NOT NULL,
	`pendingSecret` CHAR(64) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `paragragh` (
	`id` INT AUTO_INCREMENT,
	`article` INT NOT NULL,
	`textAlignment` ENUM ('center', 'left', 'right', 'justify') DEFAULT 'left',
	`textPosition` ENUM ('left', 'right') DEFAULT 'left',
	`text` VARCHAR(6800),
	`imagePosition` ENUM ('center', 'left', 'right') DEFAULT 'right',
	`image` INT,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`article`) REFERENCES `article`(`id`),
	FOREIGN KEY (`image`) REFERENCES `media`(`id`)
);