import axios from "axios";

export async function ask(question: string): Promise<string> {
    const googleAnswer = await askGoogle(question);

    if (googleAnswer !== "") return googleAnswer;
    return "";
}

async function askGoogle(question: string): Promise<string> {
    try {
        const res = await axios.get("https://www.google.com/search?q=" + encodeURI(question));
        console.log(res.data);
        let match = res.data.match(/<span class="hgKElc">(.+)<\/span>/g);
        console.log(match);
        if (match !== null) {
            return match[1];
        }
        return "";
    } catch {
        return "";
    }
}