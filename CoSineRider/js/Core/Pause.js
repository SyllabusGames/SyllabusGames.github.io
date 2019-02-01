//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
//		Handle the pause menu and Losing and gaining focus



//		stop audio when someone switches tabs
window.addEventListener("blur",  function(){
	paused = true;
	pauseEquationTheme();
});

//		resume audio when someone switches back to the game
window.addEventListener("focus", function(){
	if(!menuOpen && themeEqu != null){//		do not un-pause if it is paused because a menu is open
		paused = false;
		themeEqu.play();
		themeEqu.volume = 0.6;
	}
});