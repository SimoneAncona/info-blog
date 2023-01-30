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