import { RowDataPacket } from "mysql2";
import { sendQuery } from "./dbHandler";
import { ErrorObject, NewsCover, Paragraph } from "./interfaces";
import { isError } from "./commonErrorHandler";

export async function getLatestNews(count: number) {
	let res;
	try {
		res = await sendQuery("SELECT `article`.`id`, `title`, `subTitle`, `date`, `username` AS `user`, `profilePicture` AS `userPicture` FROM `article`, `user` WHERE `article`.`user` = `user`.`id` ORDER BY(`date`) LIMIT ?", [count]);
	} catch (e) {
		return e as ErrorObject;
	}
	return res as NewsCover[];
}

export async function getNewsCover(id: number) {
	let res;
	try {
		res = await sendQuery("SELECT `article`.`id`, `title`, `subTitle`, `date`, `username` AS `user`, `profilePicture` AS `userPicture` FROM `article`, `user` WHERE `article`.`user` = `user`.`id` AND `article`.`id` = ?", [id]);
	} catch (e) {
		return e as ErrorObject;
	}
	return (res as Array<RowDataPacket>)[0] as NewsCover;
}

export async function buildHtmlArticle(id: number) {
	let paragraphs;
	let articleInfo = await getNewsCover(id);
	if (isError(articleInfo)) return articleInfo as ErrorObject;
	try {
		paragraphs = await sendQuery("SELECT * FROM paragraph WHERE article = ? ORDER BY position", [id]) as unknown as Paragraph[];
	} catch (e) {
		return e as ErrorObject;
	}

	return `
	<div class="article">
		<h1>${(articleInfo as NewsCover).title}</h1>
		<h2>${(articleInfo as NewsCover).subTitle}</h2>
		${buildHtmlParagraphs(paragraphs)}
	</div>
	`;
}

function buildHtmlParagraphs(paragraphs: Paragraph[]) {
	let html = "";
	for (let p of paragraphs) {
		html += buildParagraph(p);
	}
	return html;
}

function buildParagraph(p: Paragraph) {
	return `
	<p>
		${p.text}
		${p.image !== null ? "<img src='/resorces/media?id=" + p.image + ">" : ""}
	</p>
	`;
}