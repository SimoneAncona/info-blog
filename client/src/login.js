function handleCredentialResponse(response) {
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/auth/login/google");
	xhr.send(`{
		credential: ${response.credential}
	}`);
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			console.log(xhr.responseText);
		}
	}
}

window.addEventListener("load", function () {
	google.accounts.id.initialize({
		client_id: "972668876196-u12ssita5n65732shp04c8bfngmlcvhe.apps.googleusercontent.com",
		callback: handleCredentialResponse
	});
	google.accounts.id.renderButton(
		document.getElementById("google-login"),
		{ theme: "outline", size: "large" }  // customization attributes
	);
});