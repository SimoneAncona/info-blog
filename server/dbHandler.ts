import * as mysql from "mysql2";
import * as dotenv from "dotenv";
import { ErrorObject } from "./commonErrorHandler";
import * as err from "./commonErrorHandler";

dotenv.config();

const connectionData: mysql.ConnectionOptions = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	port: Number.parseInt(<string>process.env.MYSQL_PORT),
	database: process.env.MYSQL_DATABASE
}

export function sendQuery(queryString: string, values: Array<any>): Promise<Array<mysql.RowDataPacket> | ErrorObject> {
	let connection = mysql.createConnection(connectionData);
	let promise: Promise<Array<mysql.RowDataPacket> | ErrorObject>;
	promise = new Promise((resolve, rejects) => {
		connection.query(
			queryString,
			values,
			(error, result) => {
				if (error) rejects(err.error(err.ErrorType.DATABASE_QUERY_ERROR, error.message));
				resolve(<Array<mysql.RowDataPacket>>result);
			}
		);
	});

	return promise;
}