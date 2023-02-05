window.addEventListener("load", () => {
	let username = document.getElementById("username");
	let email = document.getElementById("email");

	username.addEventListener("keyup", async () => {
		const res = await post("/auth/check-username", {
			username: username.value
		});
		if (res.exist) {
			createWarning("username", "Nome utente già in utilizzo", "left", "username-warning");
		} else {
			removeWarning("username-warning");
		}
	});

	email.addEventListener("focusout", () => {
		if (!validateEmail(email.value)) {
			createWarning("email", "Formato email non valido", "right", "email-warning");
		} else {
			removeWarning("email-warning");
		}
	})
});

window.addEventListener("load", function () {
	google.accounts.id.initialize({
		client_id: "972668876196-u12ssita5n65732shp04c8bfngmlcvhe.apps.googleusercontent.com",
		callback: handleCredentialResponse
	});
	google.accounts.id.renderButton(
		document.getElementById("google-signin"),
		{ theme: "outline", size: "large" }  // customization attributes
	);
});

function createWarning(elementId, msg, position, id) {
	let signin = document.querySelector("#warnings");
	signin.innerHTML += `
		<div class="inline-container dark-color bkg-red-color warning" id="${id}" style="opacity: 0; position: fixed">
			${position === "right" ? "<span class=\"material-symbols-outlined\">chevron_left</span>" : ""}
			<h2 class="smaller">${msg}</h2>
			${position === "left" ? "<span class=\"material-symbols-outlined\">chevron_right</span>" : ""}
		</div>
	`;

	let warning = document.getElementById(id);
	let element = document.getElementById(elementId);
	warning.style.setProperty("left", getCoords(element).left + "px");
	warning.style.setProperty("top", getCoords(element).top + "px");
	warning.style.setProperty("transform", (position === "left" ? "translateX(-120%)": "translateX(120%)") + " translateY(-30%)");
	fadeIn(warning);
}

function removeWarning(id) {
	fadeOut(document.getElementById(id));
}
