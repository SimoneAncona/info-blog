window.onload = () => {
	setTimeout(() => {
		let msg = "esplora un mondo";
		let i = 0;
		let element = document.getElementById("welcome-animation");
		let animation = setInterval(() => {
			element.innerHTML += msg[i];
			i++;
			if (i == msg.length) clearInterval(animation);
		}, Math.random() * 100 + 50);
	}, 800);

	let courseImages = Array.from(document.getElementsByClassName("course-image"));
	courseImages.forEach(e => {
		e.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
		e.style.margin = `${Math.random() * 20 + 15}px`;
		e.style.width = `${Math.random() * 20 + 50}`;
		e.style.opacity = 0;
	})
}

let tutorialShown = false;
let coursesShown = false;
window.addEventListener("scroll", showTutorial);
window.addEventListener("scroll", showCourses);

function showTutorial() {
	let tutorialSection = document.getElementById("tutorial-section");
	if(getCoords(tutorialSection).top < window.scrollY + 350 && !tutorialShown) {
		let tutorialExampleQuestion = document.getElementById("tutorial-example-question");
		let tutorialExampleAnswer = document.getElementById("tutorial-example-answer");
		let msg1 = "> Come faccio a centrare un div in CSS?";
		let msg2 = "> Per centrare un div in CSS ci sono diversi metodi...";
		tutorialShown = true;
		let i = 0;
		let animation = setInterval(() => {
			tutorialExampleQuestion.innerHTML += msg1[i];
			i++;
			if (i == msg1.length) {
				clearInterval(animation);
				i = 0;
				animation = setInterval(() => {
				tutorialExampleAnswer.innerHTML += msg2[i];
				i++;
				if (i == msg2.length) clearInterval(animation);
				}, Math.random() * 50 + 25);
			}
		}, Math.random() * 50 + 25);

		
	}
}

function showCourses() {
	let courseSection = document.getElementById("course-section");
	if(getCoords(courseSection).top < window.scrollY + 350 && !coursesShown) {
		let courseImages = Array.from(document.getElementsByClassName("course-image"));
		coursesShown = true;
		let i = 0;
		let opacity = 0;
		let animation;
		let time = 50;
		let animationCallback = () => {
			courseImages[i].style.opacity = opacity;
			opacity += 0.1;
			if (opacity >= 1) {
				clearInterval(animation);
				opacity = 0;
				i++;
				if (i < courseImages.length)
					animation = setInterval(animationCallback, time);
			}
		}
		animation = setInterval(animationCallback, time);

		
	}
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