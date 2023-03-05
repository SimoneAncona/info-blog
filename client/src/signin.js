window.addEventListener("load", function () {
	if (getCookie("username") != null)
		window.location.href = "/";
	google.accounts.id.initialize({
		client_id: "972668876196-u12ssita5n65732shp04c8bfngmlcvhe.apps.googleusercontent.com",
		callback: handleGoogleLogin
	});
	google.accounts.id.renderButton(
		document.getElementById("google-signin"),
		{ theme: "outline", size: "large" }  // customization attributes
	);
});

async function signin() {
	if (checkInput(false)) {
		let res;
		try {
			res = await post("/auth/signin", 
				{
					username: username.value,
					password: await sha256salty(password.value),
					email: email.value,
					birth: document.getElementById("birth-date").value,
					phone: document.getElementById("phone").value
				}
			);
			window.location.href = "/";
		} catch {
			return;
		}
	}
}