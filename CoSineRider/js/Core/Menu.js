<<<<<<< HEAD
﻿var menuTime = -25;

// var menuIndex = 0;
//		button manipulation variables
var menuArrowKeys = false;
var currentButton = -1;
var mouseCurrentButton = -1;
var mouseLastButton = -1;//		used to check when the mouse switches buttons which will turn off keyboard menu navigation
//		[X , Y , Text , function call , close menu?]
var menuButtons = [];
var menuShowButtons = true;

				
var menuShowText = true;
var menuText ; [];

var menuScreenx;
var menuScreeny;
var menuScreenScale;

var menuLevel = 0;
/*
	0 - Title Screen
	1 - Supported Operations
*/

//		called from KeyboardMouseInput.js
function menuInitialize(){
	menuScreenx = screenx;
	menuScreeny = screeny;
	menuScreenScale = screenScale;
	
	ctx.textAlign = "center";
	//		pause the music
	pauseEquationTheme();
	menuTime = -25;//		25=line length
	showSVGPoints = true;
	//		hide the 2d view
	xyzc.style.display = "none";
	xyz2c.style.display = "none";
	
	document.addEventListener('keydown', menuKeyDown);
	document.addEventListener('mousedown', menuMouseDown);
	
	meunMain();
}

function meunMain(){
	menuLevel = 0;
	menuShowText = false;
	menuButtons = [[0.5 , 0.3 , "Skip Level" , levelCleared , true],
				[0.5 , 0.5 , "Instructions" , menuSupportedOpperations , false],
				[0.5 , 0.7 , "Nothing" , levelCleared , true],
				[0.125 , 0.1 , "Close" , menuClose]];
}

//		called from KeyboardMouseInput.js
function menuClose(){
	document.removeEventListener('keydown', menuKeyDown);
	document.removeEventListener('mousedown', menuMouseDown);
	
	showHideInputs("block");
	menuOpen = false;
	paused = false;
	
	//		restore screen position
	screenx = menuScreenx;
	screeny = menuScreeny;
	screenScale = menuScreenScale;
}

function menuMouseDown(e){
	var evt = e==null ? event : e;//		firefox compatibility	
	
	if(evt.which == 1 && !menuArrowKeys){//		Left Click and not using keyboard
		if(currentButton != -1){
			if(menuButtons[currentButton][4])
				menuClose();
			menuButtons[currentButton][3]();
		}
	}
}

	//		get keycodes from here: https://css-tricks.com/snippets/javascript/javascript-keycodes/
function menuKeyDown(e){
	if(e.keyCode == 13 && menuArrowKeys){//		Enter
		e.preventDefault();
		if(currentButton != -1){
			if(menuButtons[currentButton][4])
				menuClose();
			menuButtons[currentButton][3]();
		}
	}
	if(e.keyCode == 38 || e.keyCode == 87){//		Up Arrow or W key
		menuArrowKeys = true;
		currentButton--;
		if(currentButton < 0)//		loop to last button
			currentButton = menuButtons.length-1;
	}
	if(e.keyCode == 40 || e.keyCode == 83){//		Down Arrow or S key
		menuArrowKeys = true;
		currentButton++;
		if(currentButton > menuButtons.length-1)
			currentButton = 0;
	}
}

	//		-----------------------------------------------------------------------		[   Update (every frame)   ]		-----------------------------------------------------------------------
function menuUpdate(){
	ctx.clearRect(0 , 0 , screenWidth , screenHeight);
	
	
	ctx.strokeStyle = "#EEEEEE";
	ctx.font = "26px Arial";
	screenx = -screenWidth*0.5/screenScale;//		center of screen
	screeny = screenHeight*0.95/screenScale;//		95% down the screen
	screenScale = 50;
	// gridScale = 1;
	drawPolarGrid();
	
	switch (menuLevel){
		case 0://		Main Menu
			ctx.textAlign = "center";
			ctx.fillStyle = _gridTextColor;
			ctx.font = math.round(screenWidth/16) + "px Arial";
			ctx.fillText( "Cosine Rider" , screenWidth/2-25 , screenHeight/6);
			ctx.font = math.round(screenWidth/32) + "px ArialBlack";
			ctx.fillText( "A Game of Learning Curves" , screenWidth/2+50 , screenHeight/6+50);

			menuTime += 0.2;
			ctx.lineWidth = 8;
			ctx.strokeStyle = _lineColor;
			ctx.beginPath();
			ctx.moveTo(20*menuTime , Math.max(-5 , -20*(-menuTime/(menuTime/8+0.3)-menuTime/12+Math.sin(menuTime/15)*2-screenHeight/40)));//		-x/(x/8+0.5)-x/8+sin(x/15)	//		20=screen scale
			for(dtmp = 0 ; dtmp < 25 ; dtmp += 0.5){//	25/0.5 verticies in line	//		25=line length
				ftmp = (menuTime + dtmp);
				ctx.lineTo(20*ftmp , Math.max(-5 , -20*(-ftmp/(ftmp/8+0.3)-ftmp/12+Math.sin(ftmp/15)*2-screenHeight/40)));//		20=screen scale
			}
			ctx.stroke();
			if(menuTime*20-25 > screenWidth){//		20=screen scale	//		25=line length
				menuTime = -25;//		20=screen scale
			}
			break;
		case 1://		Supported Operations
			ctx.font = math.round(screenWidth/40) + "px Arial";
			ctx.textAlign = "center";
			break;
	}
	
	
	
	if(menuShowText){
		for(i = menuText.length - 1 ; i > -1 ; i--){
			ctx.fillText(menuText[i][2] , screenWidth*menuText[i][0] , screenHeight*menuText[i][1] + 15);//		center text (y = center + half text height)
		}
	}
	
	
	//		Draw menu buttons last since they set the font size which will erase the font size set in the switch statment
	menuDrawMenuButtons();
}

function menuDrawMenuButtons(){
	ctx.lineWidth = "6";
	ctx.font = math.round(screenWidth/30) + "px Arial";
	ctx.strokeStyle = _menuButtonColor;
	
	if(!menuArrowKeys)
		currentButton = -1;
	else
		mouseLastButton = mouseCurrentButton;
	
	mouseCurrentButton = -1;
	
	for(i = menuButtons.length - 1 ; i > -1 ; i--){
		
		//		mouseX set in KeyboardMouseInput.js
		if(math.abs(mouseX - screenWidth*menuButtons[i][0]) < screenWidth/10 && math.abs(mouseY - screenHeight*menuButtons[i][1]) < screenWidth/40){//		mouse is over current button
			mouseCurrentButton = i;
		}
		
		//		selecting button with keyboard
		if(menuArrowKeys){
			if(currentButton == i){
				ctx.fillStyle = _menuButtonHighlightColor;
			}else{
				ctx.fillStyle = _menuButtonFillColor;
			}
		}else{//	selecting button with mouse
			if(mouseCurrentButton == i){
				currentButton = i;
				ctx.fillStyle = _menuButtonHighlightColor;
			}else{
				ctx.fillStyle = _menuButtonFillColor;
			}
		}
		
		
		ctx.beginPath();
		ctx.rect(screenWidth * menuButtons[i][0] - screenWidth/10, screenHeight * menuButtons[i][1] - screenWidth/40 , screenWidth/5 , screenWidth/20);
		ctx.stroke();
		
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		ctx.fillStyle = _menuText;
		
		ctx.fillText(menuButtons[i][2] , screenWidth*menuButtons[i][0] , screenHeight*menuButtons[i][1] + screenWidth/128);//		center text (y = center + half text height)
	}
	
	if(menuArrowKeys && mouseLastButton != mouseCurrentButton){//		Mouse moved over or out of a button. Turn off keyboard controlls
		menuArrowKeys = false;
	}
}

function menuSupportedOpperations(){
	menuLevel = 1;
	menuShowText = true;
	menuText = [[0.5 , 0.2 , "Input fields support the following mathematical operators in addition to variables"],
	[0.5 , 0.3 , "# is a stand in. For example (max(#, #) → max(1, x/4-1))"],
	[0.5 , 0.5 , "+  -  *  /  ^  %  log(#)  sqrt(#)"],
	[0.5 , 0.6 , "tan(#)  sin(#)  cos(#)  acos(#)  asin(#)  atan(#)  atan2(#,#)"],
	[0.5 , 0.7 , "ceil(#)  floor(#)  round(#)  max(#,#)  min(#,#)"],
	[0.5 , 0.8 , "|#|  OR  abs(#)"],
	[0.5 , 0.9 , "e  pi"]];
	menuButtons = [[0.125 , 0.1 , "Back" , meunMain]]
}



=======
﻿var menuTime = -25;

// var menuIndex = 0;
//		button manipulation variables
var menuArrowKeys = false;
var currentButton = -1;
var mouseCurrentButton = -1;
var mouseLastButton = -1;//		used to check when the mouse switches buttons which will turn off keyboard menu navigation
//		[X , Y , Text , function call , close menu?]
var menuButtons = [];
var menuShowButtons = true;

				
var menuShowText = true;
var menuText ; [];

var menuScreenx;
var menuScreeny;
var menuScreenScale;

var menuLevel = 0;
/*
	0 - Title Screen
	1 - Supported Operations
*/

//		called from KeyboardMouseInput.js
function menuInitialize(){
	menuScreenx = screenx;
	menuScreeny = screeny;
	menuScreenScale = screenScale;
	
	ctx.textAlign = "center";
	//		pause the music
	pauseEquationTheme();
	menuTime = -25;//		25=line length
	showSVGPoints = true;
	//		hide the 2d view
	xyzc.style.display = "none";
	xyz2c.style.display = "none";
	
	document.addEventListener('keydown', menuKeyDown);
	document.addEventListener('mousedown', menuMouseDown);
	
	meunMain();
}

function meunMain(){
	menuLevel = 0;
	menuShowText = false;
	menuButtons = [[0.5 , 0.3 , "Skip Level" , levelCleared , true],
				[0.5 , 0.5 , "Instructions" , menuSupportedOpperations , false],
				[0.5 , 0.7 , "Nothing" , levelCleared , true],
				[0.125 , 0.1 , "Close" , menuClose]];
}

//		called from KeyboardMouseInput.js
function menuClose(){
	document.removeEventListener('keydown', menuKeyDown);
	document.removeEventListener('mousedown', menuMouseDown);
	
	showHideInputs("block");
	menuOpen = false;
	paused = false;
	
	//		restore screen position
	screenx = menuScreenx;
	screeny = menuScreeny;
	screenScale = menuScreenScale;
}

function menuMouseDown(e){
	var evt = e==null ? event : e;//		firefox compatibility	
	
	if(evt.which == 1 && !menuArrowKeys){//		Left Click and not using keyboard
		if(currentButton != -1){
			if(menuButtons[currentButton][4])
				menuClose();
			menuButtons[currentButton][3]();
		}
	}
}

	//		get keycodes from here: https://css-tricks.com/snippets/javascript/javascript-keycodes/
function menuKeyDown(e){
	if(e.keyCode == 13 && menuArrowKeys){//		Enter
		e.preventDefault();
		if(currentButton != -1){
			if(menuButtons[currentButton][4])
				menuClose();
			menuButtons[currentButton][3]();
		}
	}
	if(e.keyCode == 38 || e.keyCode == 87){//		Up Arrow or W key
		menuArrowKeys = true;
		currentButton--;
		if(currentButton < 0)//		loop to last button
			currentButton = menuButtons.length-1;
	}
	if(e.keyCode == 40 || e.keyCode == 83){//		Down Arrow or S key
		menuArrowKeys = true;
		currentButton++;
		if(currentButton > menuButtons.length-1)
			currentButton = 0;
	}
}

	//		-----------------------------------------------------------------------		[   Update (every frame)   ]		-----------------------------------------------------------------------
function menuUpdate(){
	ctx.clearRect(0 , 0 , screenWidth , screenHeight);
	
	
	ctx.strokeStyle = "#EEEEEE";
	ctx.font = "26px Arial";
	screenx = -screenWidth*0.5/screenScale;//		center of screen
	screeny = screenHeight*0.95/screenScale;//		95% down the screen
	screenScale = 50;
	// gridScale = 1;
	drawPolarGrid();
	
	switch (menuLevel){
		case 0://		Main Menu
			ctx.textAlign = "center";
			ctx.fillStyle = _gridTextColor;
			ctx.font = math.round(screenWidth/16) + "px Arial";
			ctx.fillText( "Cosine Rider" , screenWidth/2-25 , screenHeight/6);
			ctx.font = math.round(screenWidth/32) + "px ArialBlack";
			ctx.fillText( "A Game of Learning Curves" , screenWidth/2+50 , screenHeight/6+50);

			menuTime += 0.2;
			ctx.lineWidth = 8;
			ctx.strokeStyle = _lineColor;
			ctx.beginPath();
			ctx.moveTo(20*menuTime , Math.max(-5 , -20*(-menuTime/(menuTime/8+0.3)-menuTime/12+Math.sin(menuTime/15)*2-screenHeight/40)));//		-x/(x/8+0.5)-x/8+sin(x/15)	//		20=screen scale
			for(dtmp = 0 ; dtmp < 25 ; dtmp += 0.5){//	25/0.5 verticies in line	//		25=line length
				ftmp = (menuTime + dtmp);
				ctx.lineTo(20*ftmp , Math.max(-5 , -20*(-ftmp/(ftmp/8+0.3)-ftmp/12+Math.sin(ftmp/15)*2-screenHeight/40)));//		20=screen scale
			}
			ctx.stroke();
			if(menuTime*20-25 > screenWidth){//		20=screen scale	//		25=line length
				menuTime = -25;//		20=screen scale
			}
			break;
		case 1://		Supported Operations
			ctx.font = math.round(screenWidth/40) + "px Arial";
			ctx.textAlign = "center";
			break;
	}
	
	
	
	if(menuShowText){
		for(i = menuText.length - 1 ; i > -1 ; i--){
			ctx.fillText(menuText[i][2] , screenWidth*menuText[i][0] , screenHeight*menuText[i][1] + 15);//		center text (y = center + half text height)
		}
	}
	
	
	//		Draw menu buttons last since they set the font size which will erase the font size set in the switch statment
	menuDrawMenuButtons();
}

function menuDrawMenuButtons(){
	ctx.lineWidth = "6";
	ctx.font = math.round(screenWidth/30) + "px Arial";
	ctx.strokeStyle = _menuButtonColor;
	
	if(!menuArrowKeys)
		currentButton = -1;
	else
		mouseLastButton = mouseCurrentButton;
	
	mouseCurrentButton = -1;
	
	for(i = menuButtons.length - 1 ; i > -1 ; i--){
		
		//		mouseX set in KeyboardMouseInput.js
		if(math.abs(mouseX - screenWidth*menuButtons[i][0]) < screenWidth/10 && math.abs(mouseY - screenHeight*menuButtons[i][1]) < screenWidth/40){//		mouse is over current button
			mouseCurrentButton = i;
		}
		
		//		selecting button with keyboard
		if(menuArrowKeys){
			if(currentButton == i){
				ctx.fillStyle = _menuButtonHighlightColor;
			}else{
				ctx.fillStyle = _menuButtonFillColor;
			}
		}else{//	selecting button with mouse
			if(mouseCurrentButton == i){
				currentButton = i;
				ctx.fillStyle = _menuButtonHighlightColor;
			}else{
				ctx.fillStyle = _menuButtonFillColor;
			}
		}
		
		
		ctx.beginPath();
		ctx.rect(screenWidth * menuButtons[i][0] - screenWidth/10, screenHeight * menuButtons[i][1] - screenWidth/40 , screenWidth/5 , screenWidth/20);
		ctx.stroke();
		
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		ctx.fillStyle = _menuText;
		
		ctx.fillText(menuButtons[i][2] , screenWidth*menuButtons[i][0] , screenHeight*menuButtons[i][1] + screenWidth/128);//		center text (y = center + half text height)
	}
	
	if(menuArrowKeys && mouseLastButton != mouseCurrentButton){//		Mouse moved over or out of a button. Turn off keyboard controlls
		menuArrowKeys = false;
	}
}

function menuSupportedOpperations(){
	menuLevel = 1;
	menuShowText = true;
	menuText = [[0.5 , 0.2 , "Input fields support the following mathematical operators in addition to variables"],
	[0.5 , 0.3 , "# is a stand in. For example (max(#, #) → max(1, x/4-1))"],
	[0.5 , 0.5 , "+  -  *  /  ^  %  log(#)  sqrt(#)"],
	[0.5 , 0.6 , "tan(#)  sin(#)  cos(#)  acos(#)  asin(#)  atan(#)  atan2(#,#)"],
	[0.5 , 0.7 , "ceil(#)  floor(#)  round(#)  max(#,#)  min(#,#)"],
	[0.5 , 0.8 , "|#|  OR  abs(#)"],
	[0.5 , 0.9 , "e  pi"]];
	menuButtons = [[0.125 , 0.1 , "Back" , meunMain]]
}



>>>>>>> a3503f6d8084bec8645c5c94b584ec9e6b4120a9
