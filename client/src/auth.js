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

async function handleGoogleLogin(response) {
	let res;
	try {
		res = await post("/auth/login/google", { credential: response.credential });
	} catch {
		return;
	}
	window.location.replace("/");
}

async function handleGoogleSignin(response) {
	let res;
	try {
		res = await post("/auth/login/google", { credential: response.credential });
	} catch {
		return;
	}
	window.location.replace("/");
}

window.addEventListener("load", async () => {
	let res;
	try {
		res = await post("/auth/login/google");
	} catch {
		return;
	}

	document.getElementById("login-button").remove();
	document.getElementsByTagName("nav")[0].innerHTML += `
	<img alt='${res.username} profile picture' src='/media/${res.profilePicture}' class='avatar' onclick=''>
	`
})