window.addEventListener("load", () => {
	let username = document.getElementById("username");
	let email = document.getElementById("email");

	if (username != null) {
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
	}

	if (email != null) {
		email.addEventListener("focusout", () => {
			if (!validateEmail(email.value)) {
				createWarning("email", "Formato email non valido", "right", "email-warning");
			} else {
				removeWarning("email-warning");
			}
		});
	}
});

function createWarning(elementId, msg, position, id) {
	let signin = document.querySelector("#warnings");
	let warning = document.getElementById(id);
	if (warning === null) {
		signin.innerHTML += `
			<div class="inline-container dark-color bkg-red-color warning" id="${id}" style="opacity: 0; position: fixed">
				${position === "right" ? "<span class=\"material-symbols-outlined\">chevron_left</span>" : ""}
				<h2 class="smaller">${msg}</h2>
				${position === "left" ? "<span class=\"material-symbols-outlined\">chevron_right</span>" : ""}
			</div>
		`;
		let element = document.getElementById(elementId);
		warning = document.getElementById(id);
		warning.style.setProperty("left", getCoords(element).left + "px");
		warning.style.setProperty("top", getCoords(element).top + "px");
		warning.style.setProperty("transform", (position === "left" ? "translateX(-120%)": "translateX(120%)") + " translateY(-30%)");
		fadeIn(warning);
	} else {
		warning.innerHTML = `
		${position === "right" ? "<span class=\"material-symbols-outlined\">chevron_left</span>" : ""}
		<h2 class="smaller">${msg}</h2>
		${position === "left" ? "<span class=\"material-symbols-outlined\">chevron_right</span>" : ""}
		`
	}
}

function createWarning(elementId, msg, position, id) {
	let signin = document.querySelector("#warnings");
	let warning = document.getElementById(id);
	if (warning === null) {
		signin.innerHTML += `
			<div class="inline-container dark-color bkg-red-color warning" id="${id}" style="opacity: 0; position: fixed">
				${position === "right" ? "<span class=\"material-symbols-outlined\">chevron_left</span>" : ""}
				<h2 class="smaller">${msg}</h2>
				${position === "left" ? "<span class=\"material-symbols-outlined\">chevron_right</span>" : ""}
			</div>
		`;
		let element = document.getElementById(elementId);
		warning = document.getElementById(id);
		warning.style.setProperty("left", getCoords(element).left + "px");
		warning.style.setProperty("top", getCoords(element).top + "px");
		warning.style.setProperty("transform", (position === "left" ? "translateX(-120%)": "translateX(120%)") + " translateY(-30%)");
		fadeIn(warning);
	} else {
		warning.innerHTML = `
		${position === "right" ? "<span class=\"material-symbols-outlined\">chevron_left</span>" : ""}
		<h2 class="smaller">${msg}</h2>
		${position === "left" ? "<span class=\"material-symbols-outlined\">chevron_right</span>" : ""}
		`
	}

}

async function removeWarning(id) {
	let el = document.getElementById(id);
	if (el !== null) {
		fadeOut(document.getElementById(id));
	}
}