import { RowDataPacket } from "mysql2";
import { sendQuery } from "./dbHandler";
import { ErrorObject, NewsCover } from "./interfaces";

export async function getLatestNews(count: number): Promise<NewsCover[] | ErrorObject> {
	let res;
	try {
		res = await sendQuery("SELECT `article`.`id`, `title`, `subTitle`, `date`, `username` AS `user`, `profilePicture` AS `userPicture` FROM `article`, `user` WHERE `article`.`user` = `user`.`id` ORDER BY(`date`) LIMIT ?", [count]);
	} catch (e) {
		return e as ErrorObject;
	}
	return res as NewsCover[];
}

export async function getNewsCover(id: number): Promise<NewsCover | ErrorObject> {
	let res;
	try {
		res = await sendQuery("SELECT `article`.`id`, `title`, `subTitle`, `date`, `username` AS `user`, `profilePicture` AS `userPicture` FROM `article`, `user` WHERE `article`.`user` = `user`.`id` AND `article`.`id` = ?", [id]);
	} catch (e) {
		return e as ErrorObject;
	}
	return (res as Array<RowDataPacket>)[0] as NewsCover;
}