var menuTime = -25;

// var menuIndex = 0;
//		button manipulation variables
var menuArrowKeys = false;
var currentCheckBox = -1;
var currentButton = -1;
var mouseCurrentButton = -1;
var mouseLastButton = -1;//		used to check when the mouse switches buttons which will turn off keyboard menu navigation
//		[X , Y , Text , function call , close menu?]
var menuButtons = [];
var menuShowButtons = true;

				
var menuShowText = true;
var menuText ; [];
var menuCheckboxes = [];

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
	
	localStorage.setItem("NoneTypedLoaded" , "False");//		Asside from 
	
	meunMain();
}

function meunMain(){
	menuLevel = 0;
	menuShowText = false;
	menuButtons = [[0.5 , 0.3 , "Play Game" , levelCleared , true],
				[0.5 , 0.425 , "Instructions" , menuBasicControls , false],
				[0.5 , 0.55 , "Join Class" , levelCleared , true],
				[0.5 , 0.675 , "Free Graph" , menuNoneLevels , false],
				[0.5 , 0.8 , "Level Builder" , menuNoneLevels , true],
				[0.5 , 0.925 , "Custom Levels" , menuNoneLevels , false],
				[0.1375 , 0.075 , "Close" , menuClose]];
}

//		called from KeyboardMouseInput.js
function menuClose(){
	document.removeEventListener('keydown', menuKeyDown);
	document.removeEventListener('mousedown', menuMouseDown);
	ctx.textAlign = "left";
	
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
		if(currentCheckBox != -1){//		invert the selected checkbox
			menuCheckboxes[currentCheckBox][2] = !menuCheckboxes[currentCheckBox][2];
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
	ctx.strokeStyle = _gridSecondaryColor;
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
		case 1://		Buttons only
			ctx.font = math.round(screenWidth/40) + "px Arial";
			ctx.textAlign = "center";
			break;
		case 2://		Buttons and check boxes
			ctx.font = math.round(screenWidth/40) + "px Arial";
			ctx.textAlign = "left";
			currentCheckBox = -1
			drawCheckBox(0);
			drawCheckBox(1);
			drawCheckBox(2);
			drawCheckBox(3);
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
	ctx.lineWidth = 6;
	ctx.font = math.round(screenWidth/30) + "px Arial";
	ctx.strokeStyle = _menuButtonColor;
	
	if(!menuArrowKeys)
		currentButton = -1;
	else
		mouseLastButton = mouseCurrentButton;
	
	mouseCurrentButton = -1;
	
	for(i = menuButtons.length - 1 ; i > -1 ; i--){
		
		//		mouseX set in KeyboardMouseInput.js
		if(math.abs(mouseX - screenWidth*menuButtons[i][0]) < screenWidth*0.125 && math.abs(mouseY - screenHeight*menuButtons[i][1]) < screenWidth/40){//		mouse is over current button
			mouseCurrentButton = i;
		}
		
		//		selecting button with keyboard
		if(menuArrowKeys){
			if(currentButton == i){
				ctx.fillStyle = _menuButtonHighlightColor;
			}else{
				ctx.fillStyle = _backgroundColor;
			}
		}else{//	selecting button with mouse
			if(mouseCurrentButton == i){
				currentButton = i;
				ctx.fillStyle = _menuButtonHighlightColor;
			}else{
				ctx.fillStyle = _backgroundColor;
			}
		}
		
		
		ctx.beginPath();
		ctx.rect(screenWidth * menuButtons[i][0] - screenWidth*0.125, screenHeight * menuButtons[i][1] - screenWidth/40 , screenWidth*0.25 , screenWidth/20);
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


function menuBasicControls(){
	menuLevel = 1;
	menuShowText = true;
				
	menuText = [[0.5 , 0.1 , "Basic Controls"],
	[0.5 , 0.2 , "Pan: Hold middle mouse button or Home and move mouse"],
	[0.5 , 0.3 , "Zoom in: Scroll mouse wheel up or PageUp button"],
	[0.5 , 0.4 , "Zoom out: Scroll mouse wheel down or PageDown button"],
	[0.5 , 0.5 , "Click in the input field to type an equation"]];
	
	menuButtons = [[0.2 , 0.75 , "Basic Controls" , menuBasicControls , false],
				[0.2 , 0.9 , "Advanced Controls" , menuAdvancedControls , false],
				[0.8 , 0.75 , "Supported Operations" , menuSupportedOperations , false],
				[0.8 , 0.9 , "Level Builder" , menuLevelBuilderInstructions , false],
				[0.1375 , 0.075 , "Back" , meunMain]];
}

function menuAdvancedControls(){
	menuLevel = 1;
	menuShowText = true;
	menuText = [[0.5 , 0.1 , "Advanced Controls"],
	[0.5 , 0.2 , "Hold shift to read points on the line or incrament slower"],
	[0.5 , 0.3 , "Zoom n"],
	[0.5 , 0.4 , "Zoom outbutton"],
	[0.5 , 0.5 , "Click inuation"]];
}

function menuSupportedOperations(){
	menuLevel = 1;
	menuShowText = true;
	menuText = [[0.5 , 0.05 , "Supported Opperations"],
	[0.5 , 0.2 , "Input fields support the following mathematical operators in addition to variables"],
	[0.5 , 0.28 , "# represents any equation. For example (max(#, #) is used as max(5, x/4-1))"],
	[0.5 , 0.4 , "+  -  *  /  ^  %  log(#)  sqrt(#)"],
	[0.5 , 0.48 , "tan(#)  sin(#)  cos(#)  acos(#)  asin(#)  atan(#)  atan2(#,#)"],
	[0.5 , 0.56 , "ceil(#)  floor(#)  round(#)  max(#,#)  min(#,#)"],
	[0.5 , 0.64 , "|#|  OR  abs(#)"],
	[0.5 , 0.72 , "e  pi"]];
}

function menuLevelBuilderInstructions(){
	menuLevel = 1;
	menuShowText = true;
	menuText = [[0.5 , 0.1 , "Level Builder Controls"],
	[0.5 , 0.2 , "Hold er"],
	[0.5 , 0.3 , "Zoom n"],
	[0.5 , 0.4 , "Zbutton"],
	[0.5 , 0.5 , "Clicon"]];
}

function menuNoneLevels(){
	menuLevel = 2;
	menuShowText = true;
	menuText = [[0.5 , 0.05 , "Free-graph Levels"]];
	if(menuCheckboxes.length != 4){
		menuCheckboxes = [	[0.7 , 0.2 , false , "Show t=0 line"],
							[0.7 , 0.4 , false , "Use Z variable"],
							[0.7 , 0.6 , false , "Graph Derivative"],
							[0.7 , 0.8 , false , "Polar Coordinates"]];
	}
	menuButtons = [[0.5 , 0.15 , "Typed" , menuLoadNoneType , true],
				[0.5 , 0.3 , "Piecewise" , menuLoadNonePie , true],
				[0.5 , 0.45 , "Multi-Typed" , menuLoadNoneMulti , true],
				[0.5 , 0.6 , "Proxy Variable" , menuLoadNoneProxyVar , true],
				[0.5 , 0.75 , "Proxy Function" , menuLoadNoneProxyFunction , true],
				[0.5 , 0.9 , "Programming" , menuLoadNoneProgramming , true],
				[0.1375 , 0.075 , "Back" , meunMain]];
}

function drawCheckBox(index){
	//		set tmpx and tmpy to be the center of the check box
	tmpx = menuCheckboxes[index][0]*screenWidth;
	tmpy = menuCheckboxes[index][1]*screenHeight;
	//		mouseX set in KeyboardMouseInput.js. Check if the cursor is over this checkbox
	if(math.abs(mouseX - tmpx) < 20 && math.abs(mouseY - tmpy) < 20){
		currentCheckBox = index;
		ctx.fillStyle = _menuButtonHighlightColor;//		fill grey when hovered over
	}else{
		
		ctx.fillStyle = _backgroundColor;
	}
	//		set tmpx and tmpy to be the upper left corner of the check box to make it easier to draw.
	tmpx -= 20;
	tmpy -= 20;
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	ctx.rect( tmpx , tmpy , 40 , 40);
	ctx.fill();
	ctx.stroke();
	
	ctx.fillStyle = "#000000";
	ctx.fillText( menuCheckboxes[index][3] , tmpx + 50 , tmpy + 15 + screenWidth/80);
	
	//		draw check if box is checked
	if(menuCheckboxes[index][2]){
		ctx.lineWidth = 8;
		ctx.strokeStyle = "#00AA00";
		ctx.beginPath();
		ctx.moveTo(tmpx + 5 , tmpy + 8);
		ctx.lineTo(tmpx + 20 , tmpy + 23);
		ctx.lineTo(tmpx + 43 , tmpy - 5);
		ctx.stroke();
	}
	
}

function menuLoadNoneType(){
	currentLevelCode = "NoneTyped";
	localStorage.setItem("NoneTypedLoaded" , "True");
	localStorage.setItem("NoneTyped" , `Title not shown
TY
-10,0
x
` + menuLevelOptions() + 
`10,0
none
End`);
	loadLevel();
}


function menuLoadNonePie(){
	currentLevelCode = "NonePie";
	localStorage.setItem("NonePieLoaded" , "True");
	localStorage.setItem("NonePie" , `Title not shown
PW
-10,0
5
-999,10,-x/2+t*1.5
10,20,t*1.5-10
20,30,x/5-16+t*1
30,40,x/8-16+t*0.5
40,200,x/10-16+t*2
` + menuLevelOptions() + 
	`10,0
none
End`);
	loadLevel();
}


function menuLoadNoneMulti(){
	currentLevelCode = "NoneMulti";
	localStorage.setItem("NoneMultiLoaded" , "True");
	localStorage.setItem("NoneMulti" , `Title not shown
MT
-10,0
hideMax
5
x/1
x/2
x/3
x/4
x/5
` + menuLevelOptions() + 
	`10,0
none
End`);
	loadLevel();
}


function menuLoadNoneProxyVar(){
	currentLevelCode = "NoneProxyVar";
	localStorage.setItem("NoneProxyVarLoaded" , "True");
	localStorage.setItem("NoneProxyVar" , `Title not shown
PV
-10,0
y=A+B+C+D
A=x+t
B=x+t
C=x+t
D=x+t
` + menuLevelOptions() + 
	`10,0
none
End`);
	loadLevel();
}


function menuLoadNoneProxyFunction(){
	currentLevelCode = "NoneProxyFunction";
	localStorage.setItem("NoneProxyFunctionLoaded" , "True");
	localStorage.setItem("NoneProxyFunction" , `Title not shown
PF
-10,0
y=f[x]+g[x]+h[x]+k[x]
f=a/1
g=a/2
h=a/3
k=a/4
` + menuLevelOptions() + 
	`10,0
none
End`);
	loadLevel();
}


function menuLoadNoneProgramming(){
	currentLevelCode = "NoneProgramming";
	localStorage.setItem("NoneProgrammingLoaded" , "True");
	localStorage.setItem("NoneProgramming" , `Title not shown
TY
-10,0
x
` + menuLevelOptions() + 
	`10,0
none
End`);
	loadLevel();
}


function menuLevelOptions(){
	stmp = "";
	if(menuCheckboxes[0][2])
		stmp += "showt0\n";
	if(menuCheckboxes[1][2])
		stmp += "useZ\n";
	
	stmp += "useNone\n";
	
	if(menuCheckboxes[2][2])
		stmp += "useDerivative\n";
	if(menuCheckboxes[3][2])
		stmp += "usePolar\n";
	return stmp;
}


	

	


	
	