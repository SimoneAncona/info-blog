-- Active: 1675672694253@@127.0.0.1@3306@info_world
CREATE DATABASE info_world;
USE info_world;
CREATE TABLE `role` (
	`name` VARCHAR(255),
	PRIMARY KEY(`name`)
);
CREATE TABLE `user` (
	`username` VARCHAR(255),
	`password` CHAR(64), -- use sha256 for password encryption
	`email` VARCHAR(255) NOT NULL,
	`google` BOOLEAN NOT NULL DEFAULT 0,
	`birth` DATE NOT NULL,
	`role` VARCHAR(255) NOT NULL DEFAULT "rookie",
	`level` INT NOT NULL DEFAULT 0,
	`phone` VARCHAR(255),
	PRIMARY KEY(`username`),
	FOREIGN KEY(`role`) REFERENCES `role`(`name`)
);
CREATE TABLE `article` (
	`id` INT AUTO_INCREMENT,
	title VARCHAR(255) NOT NULL,
	subtitle VARCHAR(255) NOT NULL,
	`user` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`user`) REFERENCES `user`(username)
);
CREATE TABLE `permission` (
	`name` VARCHAR(255),
	PRIMARY KEY(`name`)
);
CREATE TABLE `role_permission` (
	`role` VARCHAR(255),
	`permission` VARCHAR(255),
	PRIMARY KEY(`role`, `permission`),
	FOREIGN KEY(`role`) REFERENCES `role`(`name`),
	FOREIGN KEY(`permission`) REFERENCES `permission`(`name`)
);
CREATE TABLE `media` (

);