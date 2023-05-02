async function getMedia(mediaId) {
	try {
		return await get("/resources/media?id=" + mediaId);
	} catch {
		return null;
	}
}

async function getAvatar(username) {
	return await post("/resources/avatar", {username: username})
}