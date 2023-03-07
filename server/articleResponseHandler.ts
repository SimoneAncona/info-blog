import { sendQuery } from "./dbHandler";
import { ErrorObject, NewsCover } from "./interfaces";

export async function getLatestNews(count: number): Promise<NewsCover[] | ErrorObject> {
	let res;
	try {
		res = await sendQuery("SELECT * FROM `article` ORDER BY(`date`) LIMIT 10");
	}
}

export async function getNewsCover(id: string): Promise<NewsCover> {

}