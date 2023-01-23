window.addEventListener("scroll", () => {
    let header = document.getElementsByTagName("header")[0];
    if (window.scrollY > 150) {
        header.classList.add("bottom-shadow");
    } else {
        header.classList.remove("bottom-shadow");
    }
});