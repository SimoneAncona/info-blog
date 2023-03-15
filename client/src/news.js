window.addEventListener("load", async () => {
	let latest = await post("/news/latest");
	let latestSection = document.getElementById("latest");

	latestSection.innerHTML += `
	<div id="latest-row-1" class="inline-container"></div>
	<div id="latest-row-2" class="inline-container"></div>
	<div id="latest-row-3" class="inline-container"></div>
	`
	for (let i = 0; i < 3; i++) {
		let row = document.getElementById("latest-row-" + (i + 1));
		for (let j = 0; j < 4; j++) {
			row.innerHTML += await buildNewsCover(latest[0]);
			latest.splice(0, 1);
		}
	}
});

async function buildNewsCover(cover) {
	console.log(cover);
	return `
	<div class="card news-cover bkg-dark-color light-color">
		<h1 class="title">${cover.title}</h1>
		<br>
		<h2 class="smaller">${cover.subTitle}</h2>
		<div class="inline-container"> 
			<p>By ${cover.user}</p>
			<img src="${await post("/resources/avatar", {username: cover.user})}" class="smaller-circle" referrerpolicy="no-referrer">
		</div>
	</div>
	`
}