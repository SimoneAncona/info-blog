function handleCredentialResponse(response) {
	// HTTP REQUEST TO SERVER
}

window.addEventListener("load", function () {
	google.accounts.id.initialize({
		client_id: "972668876196-u12ssita5n65732shp04c8bfngmlcvhe.apps.googleusercontent.com",
		callback: handleCredentialResponse
	});
	google.accounts.id.renderButton(
		document.getElementById("google_login"),
		{ theme: "outline", size: "large" }  // customization attributes
	);
});