window.addEventListener("load", function () {
	if (getCookie("username") != null)
		window.location.href = "/";
	google.accounts.id.initialize({
		client_id: "972668876196-u12ssita5n65732shp04c8bfngmlcvhe.apps.googleusercontent.com",
		callback: handleGoogleLogin
	});
	google.accounts.id.renderButton(
		document.getElementById("google-login"),
		{ theme: "outline", size: "large" }  // customization attributes
	);
});

async function login() {
	let userInfo = {
		username: username.value,
		password: await sha256salty(password.value)
	}
	const response = await post("/auth/login", userInfo, (err) => {
		if (err.type === "incorrectCredentials") {
			let login = document.getElementById("login-form");
			login.innerHTML = "<h2 class='smaller red-color' id='incorrect-credentials' style='margin-bottom: 2px; opacity: 0; position: absolute'>Credenziali errate. Riprova</h1>" + login.innerHTML;
			fadeIn(document.querySelector("#incorrect-credentials"));
			setTimeout(() => fadeOut(document.querySelector("#incorrect-credentials")), 2500);
		}
	});

	if (!isAnError(response)) window.location.href = "/";
}