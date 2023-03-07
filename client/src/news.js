window.addEventListener("load", async () => {
	await post("/news/latest");
});

function buildNewsCover(cover) {
	return `
	<div class="card">
	</div>
	`
}