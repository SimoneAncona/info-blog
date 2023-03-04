import * as mysql from "mysql2";
import * as dotenv from "dotenv";
import { ErrorObject } from "./interfaces";
import * as err from "./commonErrorHandler";

dotenv.config();

const connectionData: mysql.ConnectionOptions = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	port: Number.parseInt(<string>process.env.MYSQL_PORT),
	database: process.env.MYSQL_DATABASE
}

let connection = mysql.createConnection(connectionData);

export function sendQuery(queryString: string, values: Array<any> = []): Promise<Array<mysql.RowDataPacket> | ErrorObject> {
	let promise: Promise<Array<mysql.RowDataPacket>>;
	promise = new Promise((resolve, rejects) => {
		connection.query(
			queryString,
			values,
			(error, result) => {
				if (error) {
					let commonError = err.error("databaseQueryError", error.message, true, {
						onQuery: queryString
					});
					rejects(commonError);
				}
				resolve(<Array<mysql.RowDataPacket>>result);
			}
		);
	});

	return promise;
}