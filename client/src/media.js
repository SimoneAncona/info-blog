async function getMedia(mediaId) {
	try {
		return get("/media/" + mediaId);
	} catch {
		return null;
	}
}