-- Active: 1677797151222@@127.0.0.1@3306@infoworld
CREATE DATABASE infoWorld;
USE infoWorld;
CREATE TABLE `role` (
	`name` VARCHAR(255),
	PRIMARY KEY(`name`)
);
CREATE TABLE `media` (
	`id` INT AUTO_INCREMENT,
	`path` VARCHAR(255) NOT NULL,
	`date` DATE NOT NULL,
	PRIMARY KEY(`id`)
);
CREATE TABLE `user` (
	`id` INT AUTO_INCREMENT,
	`username` VARCHAR(255),
	`password` CHAR(64), -- use sha256 for password encryption
	`email` VARCHAR(255) NOT NULL,
	`isGoogle` BOOLEAN NOT NULL DEFAULT 0,
	`birth` DATE NOT NULL,
	`role` VARCHAR(255) NOT NULL DEFAULT "rookie",
	`level` INT NOT NULL DEFAULT 0,
	`phone` VARCHAR(255),
	`twoStepAuth` BOOLEAN DEFAULT FALSE,
	`profilePicture` INT NOT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`role`) REFERENCES `role`(`name`),
	FOREIGN KEY(`profilePicture`) REFERENCES `media`(`id`)
);
CREATE TABLE `article` (
	`id` INT AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL,
	`subtitle` VARCHAR(255) NOT NULL,
	`user` INT NOT NULL,
	`path` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`user`) REFERENCES `user`(`id`)
);
CREATE TABLE `permission` (
	`name` VARCHAR(255),
	PRIMARY KEY(`name`)
);
CREATE TABLE `rolePermission` (
	`role` VARCHAR(255),
	`permission` VARCHAR(255),
	PRIMARY KEY(`role`, `permission`),
	FOREIGN KEY(`role`) REFERENCES `role`(`name`),
	FOREIGN KEY(`permission`) REFERENCES `permission`(`name`)
);

CREATE TABLE `session` (
	`id` INT AUTO_INCREMENT,
	`sessionSecret` CHAR(64) NOT NULL,
	`user` INT NOT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`user`) REFERENCES `user`(`id`)
);

CREATE TABLE `pendingRegistration` (
	`id` INT AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL,
	`isGoogle` BOOLEAN NOT NULL,
	`pendingSecret` CHAR(64) NOT NULL,
	PRIMARY KEY(`id`)
);