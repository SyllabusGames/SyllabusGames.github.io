//	-----	[  This is free and unencumbered software released into the public domain  ]	-----	(Nic Rule - Syllabus Games)

/*
	Adds smooth start and stop to mouse wheel scrolling and turns PageUp and PageDown keys into a smooth jump. If Page__ key is held, the screen will pan slowly in that direction and a readable speed.

*/

var scrolling = false;
var dy = 0;
var dydt = 0;
var direction = 1;
var fadeIn = 0;
var ctrlHeld = false;
var pageUp = false;
var pageDown = false;

document.addEventListener('wheel', function (e){
	if(ctrlHeld)
		return;
	e.preventDefault();
	dy -= Math.sign(e.deltaY)*200;//		scroll distance per wheel notch
	direction = Math.sign(dy);
	if(!scrolling){//		not currently scrolling
		fadeIn = 0;//		slow start for scrolling
		smoothScroll();
	}
});

function smoothScroll(){
	//		change in screen position each frame calculated by equation below

//	----	S curve equation y=5/(1+3^(3-abs(x/20)))+abs(x/15)
	dydt = -Math.sign(dy) * (5/(1 + Math.pow(3 , 2 - Math.abs(dy/20))) + Math.abs(dy/10));

//	----	Logrithmic equation for steep falloff at end of scroll y=log(abs(x/10)+1)*4+abs(x/25)+0.1 where x = differential between destination and current scroll position
//	dydt = -Math.sign(dy) * (Math.log(Math.abs(dy / 10) + 1) * 4 + Math.abs(dy/25)+ 0.1);

//	console.log(dy + " - " + dydt);
//		timed fade in. At +0.07 a frame and 60fps, it takes 1/4 of a second to reach full scroll speed
	fadeIn = Math.min(fadeIn + 0.07, 1);
	dydt *= fadeIn;//		slow ramp up when scrolling first starts
	//		floor dy so it is  
	dy += dydt;
	if(direction != Math.sign(dy)){//		you have scrolled too far and are about to reverse direction
		dy = 0;
	}
	window.scrollBy(0, dydt);
	scrolling = Math.abs(dy) > 0.5;//		screen is not within 0.5 pixels of its end point. Keep scrolling the screen.
	if(scrolling){//		still scrolling
		window.requestAnimationFrame(smoothScroll);
	}
}

function linearScrollUp(){
	window.scrollBy(0, -10);
	if(pageUp)//		still scrolling
		window.requestAnimationFrame(linearScrollUp);
}


function linearScrollDown(){
	window.scrollBy(0, 10);
	if(pageDown)//		still scrolling
		window.requestAnimationFrame(linearScrollDown);
}

//		----------------------------------------------------		[   Dissable Scroll When Ctrl is Held   ]		----------------------------------------------------
document.addEventListener("keydown", function (e) {
	if (e.keyCode == 17) {//		Ctrl
		ctrlHeld = true;
	}
	if (e.keyCode == 33) {//		Page Up
		e.preventDefault();
		if(!pageUp){//		pressed this frame
			pageUp = true;
			linearScrollUp();
			//		jump when first pressed like normal Page Up key but with smooth scrolling applied
			dy = 250;
			direction = Math.sign(dy);
			smoothScroll();
		}
	}
	if (e.keyCode == 34) {//		Page Down
		e.preventDefault();
		if(!pageDown){//		pressed this frame
			pageDown = true;
			linearScrollDown();
			//		jump when first pressed like normal Page Up key but with smooth scrolling applied
			dy = -250;
			direction = Math.sign(dy);
			smoothScroll();
		}
	}
});

document.addEventListener("keyup", function (e) {
	if (e.keyCode == 17) {//		Ctrl
		ctrlHeld = false;
	}
	if (e.keyCode == 33) {//		Page Up
		pageUp = false;
	}
	if (e.keyCode == 34) {//		Page Down
		pageDown = false;
	}
});