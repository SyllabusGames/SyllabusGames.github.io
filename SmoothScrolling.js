//	-----	[  This is free and unencumbered software released into the public domain  ]	-----	(Nic Rule - Syllabus Games)

var scrolling = false;
var dy = 0;
var dydt = 0;
var direction = 1;
var fadeIn = 0;

document.addEventListener('wheel', function (e){
	e.preventDefault();
	dy -= Math.sign(e.deltaY)*250;
	direction = Math.sign(dy);
	if(!scrolling){//		not currently scrolling
		fadeIn = 0;//		slow start for scrolling
		smoothScroll();
	}
});
function smoothScroll(){
	//		change in screen position each frame calculated by y=log(abs(x/10)+1)*4+abs(x/25)+0.1 where x = differential between destination and current scroll position
	dydt = -Math.sign(dy) * (Math.log(Math.abs(dy / 10) + 1) * 4 + Math.abs(dy/25)+ 0.1);
	fadeIn = Math.min(fadeIn + 0.07, 1);
	dydt *= fadeIn;//		slow ramp up when scrolling first starts
	dy = Math.round(dy + dydt);
	if(direction != Math.sign(dy)){//		you have scrolled too far and are about to reverse direction
		dy = 0;
	}
	window.scrollBy(0, dydt);
	scrolling = !(dy == 0);
	if(scrolling){//		still scrolling
		window.requestAnimationFrame(smoothScroll);
	}
}