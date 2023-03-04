let checkUser = false;
let checkEmail = false;
let checkBirth = false;
let checkPasswd = false;

window.addEventListener("load", () => {
	let username = document.getElementById("username");
	let email = document.getElementById("email");

	if (username != null) {
		username.addEventListener("keyup", async () => {
			checkUser = false;
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
			checkUser = true;
		});
	}

	if (email != null) {
		email.addEventListener("focusout", () => {
			if (!validateEmail(email.value)) {
				createWarning("email", "Formato email non valido", "right", "email-warning");
				checkEmail = false;
			} else {
				removeWarning("email-warning");
				checkEmail = true;
			}
		});
	}

	let birth = document.getElementById("birth-date");
	if (birth != null) {
		birth.addEventListener("focusout", () => {
			let v = validateBirth(birth.value);
			if (v == 1) {
				createWarning("birth-date", "Data di nascita non valida", "right", "birth-warning");
				checkBirth = false;
				return;
			}
			if (v == 2) {
				createWarning("birth-date", "Vieni dal futuro?", "right", "birth-warning");
				checkBirth = false;
				return;
			}
			if (v == 3) {
				createWarning("birth-date", "E' necessario avere più di 16 anni", "right", "birth-warning");
				checkBirth = false;
				return;
			}
			if (v == 4) {
				createWarning("birth-date", "Vietato ai maggiori di 120 anni!", "right", "birth-warning");
				checkBirth = false;
				return;
			}
			removeWarning("birth-warning");
			checkBirth = true;

		})
	}

	let passwd = document.getElementById("password");
	let confPasswd = document.getElementById("confirm-password");
	if (passwd != null && confPasswd != null) {
		confPasswd.addEventListener("focusout", () => {
			if (passwd.value != confPasswd.value) {
				createWarning("confirm-password", "Le password non coincidono", "left", "passwd-warning");
				checkPasswd = false;
				return;
			}
			removeWarning("passwd-warning");
			checkPasswd = true;
		});
		passwd.addEventListener("focusout", () => {
			if (passwd.value != confPasswd.value) {
				createWarning("confirm-password", "Le password non coincidono", "left", "passwd-warning");
				checkPasswd = false;
				return;
			}
			removeWarning("passwd-warning");
			checkPasswd = true;
		})
	}
});

function validateBirth(birth) {
	if (isNaN(Date.parse(birth))) return 1;

	if (Date.now() - Date.parse(birth) < 0) return 2;

	if ((Date.now() - Date.parse(birth)) / 31556952000 < 16) {
		return 3
	}

	if ((Date.now() - Date.parse(birth)) / 31556952000 > 120) {
		return 4
	}
}

function createWarning(elementId, msg, position, id) {
	let signin = document.querySelector("#warnings");
	let warning = document.getElementById(id);
	let translation = 220 - msg.length * 3.4;
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
		warning.style.setProperty("transform", (position === "left" ? `translateX(-${translation}%)` : `translateX(${translation}%)`) + " translateY(-30%)");
		fadeIn(warning);
	} else {
		warning.innerHTML = `
		${position === "right" ? "<span class=\"material-symbols-outlined\">chevron_left</span>" : ""}
		<h2 class="smaller">${msg}</h2>
		${position === "left" ? "<span class=\"material-symbols-outlined\">chevron_right</span>" : ""}
		`;

		warning.style.setProperty("transform", (position === "left" ? `translateX(-${translation}%)` : `translateX(${translation}%)`) + " translateY(-30%)");
	}
}

async function removeWarning(id) {
	let el = document.getElementById(id);
	if (el !== null) {
		fadeOut(document.getElementById(id));
	}
}