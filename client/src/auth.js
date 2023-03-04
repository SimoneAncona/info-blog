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
		res = await post("/auth/login/google", { credential: response.credential }, handleGoogleAuthErrors);
	} catch {
		return;
	}

	window.location.replace("/");
}

function handleGoogleAuthErrors(err) {
	if (err.type === "registrationRequired") {
		window.location.replace("/signin?email=" + err.other.email);
	} else {
		showError(err);
	}
}

window.addEventListener("load", async () => {
	let res;
	try {
		res = await post("/auth/login/google", (err) => {if (err.type != "registrationRequired") showError(err)});
	} catch {
		return;
	}

	document.getElementById("login-button").remove();
	document.getElementsByTagName("nav")[0].innerHTML += `
	<img alt='${res.username} profile picture' src='/media/${res.profilePicture}' class='avatar' onclick=''>
	`
})