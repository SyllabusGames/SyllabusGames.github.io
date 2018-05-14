//		Handle the pause menu and Losing and gaining focus



//		stop audio when someone switches tabs
window.addEventListener("blur",  function(){
	paused = true;
	themeEqu.pause();
});

//		resume audio when someone switches back to the game
window.addEventListener("focus", function(){
	paused = false;
	themeEqu.play();
	themeEqu.volume = 0.4;
});