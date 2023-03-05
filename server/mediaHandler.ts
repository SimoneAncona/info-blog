import moment = require("moment");
import { sendQuery } from "./dbHandler";
import { ErrorObject } from "./interfaces";
import { OkPacket } from "mysql2";

export async function setMedia(path: string): Promise<number | ErrorObject> {
	let dbResponse;
	try {
		dbResponse = await sendQuery("INSERT INTO `media` (`path`, `date`) VALUES (?, ?)", [path, moment().format("YYYY-MM-DD")]);
	} catch (e) {
		return e as ErrorObject;
	}
	return (dbResponse as OkPacket).insertId;
}