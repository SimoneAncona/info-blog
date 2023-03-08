async function getMedia(mediaId) {
	try {
		return await get("/resources/media?id=" + mediaId);
	} catch {
		return null;
	}
}