window.addEventListener("load", async () => {
    let id = window.location.pathname.replace("/news/", "");
    let main = document.getElementsByTagName("main")[0];
    main.innerHTML = await get("/news/content/" + id)
});