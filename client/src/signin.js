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