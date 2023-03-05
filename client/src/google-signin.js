window.addEventListener("load", () => {
	let username = document.getElementById("username");
	let email = document.getElementById("email");

	username.addEventListener("keyup", async () => {
		if (username.value.includes(" ")) {
			createWarning("username", "Il nome non può contenere spazi", "left", "username-warning");
			return;
		}

		if (!/^[\w.-]+$/.test(username.value)) {
			createWarning("username", "Il nome non può contenere " + username.value.match(/[^\w.-]+/)[0].replace("", " "), "left", "username-warning");
			return;
		}

		const res = await post("/auth/check-username", {
			username: username.value
		});
		if (res.exists) {
			createWarning("username", "Nome utente già in utilizzo", "left", "username-warning");
			return;
		}

		removeWarning("username-warning");
	});
});

async function signin() {
	if (checkInput(true)) {
		let params = new URLSearchParams(window.location.search);
		let res;
		try {
			res = await post("/auth/confirm/google", {
				email: params.get("email"),
				username: document.getElementById("username").value,
				birth: document.getElementById("birth-date").value,
				phone: document.getElementById("phone").value
			}
			);
		} catch {
			return;
		}

		window.location.href = "/";
	}
}