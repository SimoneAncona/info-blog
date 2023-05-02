window.addEventListener("load", async () => {
    let id = window.location.pathname.replace("/news/", "");
    let content = document.getElementsByTagName("content")[0];
    let aside = document.getElementsByTagName("aside")[0];
    content.innerHTML = await get("/news/content/" + id);
    let asideContent = await get("/news/info/" + id);
    aside.innerHTML = `
    <div class="inline-container">
        <p>Scritto da ${asideContent.user}</p>
        <img src="${(await getAvatar(asideContent.user))}" class="circle">
        </div>
    <div class="inline-container">
        <p>Pubblicato il ${new Date(asideContent.date).toLocaleString().split(",")[0]}</p>
    </div>
    <div class="categories">
        ${getCategories(asideContent.categories)}
    <div>
    `;
});

function getCategories(strings) {
    let str = "";
    for (let s of strings) {
        str += "<div class='category'>s</div> ";
    }
}