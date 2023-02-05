async function sha256salty(password) {
	const salt = await post("/auth/get-salt");
	const utf8 = new TextEncoder().encode(password + salt);
	const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((bytes) => bytes.toString(16).padStart(2, '0'))
		.join('');
	return hashHex;
}