window.onload = () => {
	let msg = "esplora un mondo";
	let i = 0;
	let element = document.getElementById("welcome-animation");
	let animation = setInterval(() => {
		element.innerHTML += msg[i];
		i++;
		if (i == msg.length) clearInterval(animation);
	}, Math.random() * 100 + 50);
}