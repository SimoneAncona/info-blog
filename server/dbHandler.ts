import * as mysql from "mysql2";
import * as dotenv from "dotenv";
dotenv.config();

const connectionData: mysql.ConnectionOptions = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	port: Number.parseInt(<string>process.env.MYSQL_PORT),
	database: process.env.MYSQL_DATABASE
}

export async function sendQuery(queryString: string) {

}