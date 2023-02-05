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
}

function fadeIn(element) {
    let opacity = 0;
    let fadeIn = setInterval(() => {
        opacity += 0.1;
        element.style.setProperty("opacity", opacity);
        if (opacity >= 1) clearInterval(fadeIn);
    }, 10);
}

function fadeOut(element) {
    let opacity = 1;
    let fadeOut = setInterval(() => {
        opacity -= 0.1;
        element.style.setProperty("opacity", opacity);
        console.log(opacity);
        if (opacity < -1) {
            clearInterval(fadeOut);
            element.remove();
        }
    }, 10);
}

function hideError() {
    fadeOut(document.querySelector("#error-banner"));
}

function httpRequset(method, url, data, onerror) {
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
        xhr.onerror = () => {
            let err = new ErrorObject("serverInteraction", "An error occurred while sending an HTTP POST request");
            onerror(err);
            rejects(err);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                try {
                    let err = JSON.parse(xhr.responseText);
                    if (isAnError(err)) {
                        onerror(err);
                        rejects(err);
                    }
                } catch {
                    //
                }
                resolve(xhr.responseText);
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