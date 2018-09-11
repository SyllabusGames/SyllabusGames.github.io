//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
//var themeEqu = new Audio('../../../BackgroundOutside1.mp3');
//var themeEqu = new Audio('../../../InaSnowBoundLandRemix.m4a');
var themeEqu = new Audio('BackgroundOutside1.mp3');


//var themeSledding = new Audio('..../BackgroundOutside1.mp3');

function playEquationTheme(){
	if(themeEqu != null)
		themeEqu.play();
}



function pauseEquationTheme(){
	if(themeEqu != null)
		themeEqu.pause();
}

