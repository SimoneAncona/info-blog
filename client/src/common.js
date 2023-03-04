window.addEventListener('load', () => {
	let mainLogo = document.getElementsByClassName("main-logo")[0];
	mainLogo.addEventListener("click", () => {
		window.location.href = "/";
	});
	let materialIcons = document.getElementsByClassName("material-symbols-outlined");
	Array.from(materialIcons).forEach(icon => {
		icon.setAttribute("translate", "no");
	})
});


window.addEventListener("scroll", () => {
	let header = document.getElementsByTagName("header")[0];
	if (window.scrollY > 150) {
		header.classList.add("bottom-shadow");
	} else {
		header.classList.remove("bottom-shadow");
	}
});

window.addEventListener('scroll', () => {
	document.body.style.setProperty('--scroll', ((window.pageYOffset / (document.body.offsetHeight - window.innerHeight)) * 100) + "%");
}, false);

class ErrorObject {
	constructor(type, message) {
		this.type = type;
		this.message = message,
		this.trace = Error().stack;
	}
}

function isAnError(error) {
	if (typeof(error) != "object") return false;
	return "type" in error && "message" in error;
}

function showError(error) {
	let errorBanner;
	errorBanner = document.querySelector("#error-banner");

	const errorBannerMessage = `
		<h1 class="smaller">Si è verificato un errore</h1>
		<div onclick="hideError()" title="Chiudi finiestra" class="clickable">
			<span class="material-symbols-outlined red-color">
			close
			</span>
		</div>
	`;

	if (errorBanner === null) {
		document.body.innerHTML += `
			<div id="error-banner" style="opacity: 0">
				${errorBannerMessage}
			</div>
		`;
		errorBanner = document.querySelector("#error-banner");

	} else {
		errorBanner.innerHTML = errorBannerMessage;
	}

	fadeIn(errorBanner);

	console.error(error);
}

function validateEmail(email) {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
  };

function fadeIn(element) {
	return new Promise((resolve) => {
		let opacity = 0;
		let fadeIn = setInterval(() => {
			opacity += 0.1;
			element.style.setProperty("opacity", opacity);
			if (opacity >= 1) {
				clearInterval(fadeIn);
				resolve()
			}
		}, 10);
	});
}

function fadeOut(element) {
	return new Promise((resolve) => {
		let opacity = 1;
		let fadeOut = setInterval(() => {
			opacity -= 0.1;
			element.style.setProperty("opacity", opacity);
			if (opacity < -1) {
				clearInterval(fadeOut);
				element.remove();
				resolve();
			}
		}, 10);
	})
}

function hideError() {
	fadeOut(document.querySelector("#error-banner"));
}

function httpRequset(method, url, data, onerror) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(data));
		xhr.onerror = () => {
			let err = new ErrorObject("serverInteraction", "An error occurred while sending an HTTP POST request");
			onerror(err);
			reject(err);
		}
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				let response;
				try {
					response = JSON.parse(xhr.responseText);
				} catch {
					response = xhr.responseText;
				}
				if (isAnError(response)) {
					onerror(response);
					reject(response);
				}
				resolve(response);
			}
		}
	});
}

function post(url, data = {}, onerror = showError) {
	return httpRequset("POST", url, data, onerror);
}

function get(url, data = {}, onerror = showError) {
	return httpRequset("GET", url, data, onerror);
}

function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

function consentCookie() {
	let cookieBanner = document.getElementById("cookie-banner");
	cookieBanner.style.opacity = 0;
	setTimeout(() => {
		cookieBanner.remove();
	}, 1000);
	setCookie(technicalCookie, true, 1000);
}

function setCookie(name, value, expiredays) {
	const date = new Date();
	date.setTime(date.getTime() + (expiredays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + date.toUTCString();
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let ca = document.cookie.split(';');
	for(let i = 0; i < ca.length; i++) {
	  	let c = ca[i];
	  	while (c.charAt(0) == ' ') {
			c = c.substring(1);
	  	}
	  	if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
	  	}
	}
	return null;
}

function checkCookie(name) {
	return getCookie(name) != null;
}