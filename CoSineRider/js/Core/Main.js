//		Ctrl+Shift+J	shows error log in Chrome
	
//		time
var frameTime = 0;//		time since level started (used as t in equations)
var lastTime = 0;
var dt = 0.01;//		change in time since last frame
//var lastTimeRaw = 0;

//		temporary variables (all of these are used in multiple places. This is to avoid the inefficiency of redeclaring i 10 times a frame)
//		all these variables should be assumed to be reset outside the context of a single function
var dx = 0;//	float
var dy = 0;//	float
var dydt = 0;//	float
var dxdt = 0;//	float
var i = 0;//	int
var k = 0;//	int
var stmp = "";//	string
var tmpx;
var tmpy;

//		these temporary variables need to be phased out at some point or made local
	var lyy = 0;//	float
	var ryy = 0;//	float
	var itmp = 0;//	int
	var ftmp = 0;//	float
	var dtmp = 0;//	float
	var ltmp = 0;//	float
	var rtmp = 0;//	float
	var tmspx;
	var tmspy;
	var tmspz;


//		should be deleted before launch
var lineResolution = 5;//		pixels per vertex (vertex every _ pixels)
var debugSkipFrame = false;
var debugSingleFrame = false;
var debugFramerateCount = 0;
var debugFramerateLast = 0;
var debugFramerateTime = 0;
var ctrlHeld = false;
var showMessage = false;
var messageTime = 10;
var messageText = "";

//		camera position and scale. These coordinates are the position of the upper left corner of the screen.
var screenWidth = 1600;
var screenHeight = 800;
var screenx = 0;
var screeny = 0;
var screenScale = 20;//		measured in pixels per meter
var trackPointx = 0;//		point the camera will try to keep on screen
var trackPointy = 0;

//		gameplay state
var simulating = false;//		game is running. Sled is moving.
var camLocked = false;
var paused = false;//		player has not paused and window is in focus
var menuOpen = false;//		game is paused because the menu is open
var shiftHeld = false;

//		canvas
var canvas;//		main canvas for 2D elements
var ctx;
var xyz;//		canvas for 3D elements
var xyzc;
var xyzWidth = 500;
var xyzHeight = 500;
var xyz2;//		duplicate of xyz offset down 1 pixel on the Y to fill in 1 pixel gaps caused by a low sample rate.
var xyz2c;

var activeInput;//		the currently selected text input field
var mainInput;//		the first (botom left) input field and the one that is used if only one is active
var pieEquInput = [];//new Array();

var background = new Image;
var drawBackground = true;
//var drawParallax = false;

var parenOpen = 0;

var timestamp;//		used only for running update()

window.onload = function(){
	canvas = document.getElementById('gc');

	ctx = canvas.getContext('2d');
	xyzc = document.getElementById('XYZ');
	xyz  = xyzc.getContext('2d');
	xyz2c = document.getElementById('XYZ2');
	xyz2  = xyz2c.getContext('2d');
	document.body.style.overflow = 'hidden';//		turn off page scrolling
	lastTime = performance.now()*0.001;
	document.body.style.cursor = "auto";//		the default is apparently "" in Chrome so I set it to auto so it is always either auto or a custom one depending on context

	//		create input field
	mainInput = document.createElement("p");
	mainInput.setAttribute("contentEditable" , "true");
	mainInput.style = "position:absolute;left:60px;top:720px;width:1480px;font-size:35px; font-family:'Arial'; background-color: #FFFFFFBB; border:1px solid #AAAAAA;";
	mainInput.innerHTML = "-x";
	mainInput.focus();//		not nessisary
	document.body.appendChild(mainInput);
	
//		Move ↓ to PiecwiseInput.js
	pieEquInput.push(mainInput);
	

	saveLevel();//		for testing
	buildLevelMap();//		for testing
	loadLevelMap();//		for testing
//			setUpAnim();
	ctx.textAlign="center";

	//ctx.save();
	setUpPlayerInputs();//		see KeyboardMouseInput.js
	
	setUpSledder();//		see Sledder.js
	window.requestAnimationFrame(update);

	//		-----------------------------------------------------------------------		[   Page Icon   ]		-----------------------------------------------------------------------
	var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = 'SineRiderSGLogo.png';
	document.getElementsByTagName('head')[0].appendChild(link);

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){//		load onScreenKeypad if on mobile
			
	}
	
	screenSizeChanged();//			set the canvas size to the window/screen size
	//		uncomment the following 2 lines if you ever decide automatically sizing to the window at the game's start is a bad idea.
//	window.scrollTo(0, 0);//		If the screen is windowed, it may be nessisary to reset the scroll position to 0,0
//	canvas.width = screenWidth;//		this fixes text positions not being updated until you toggle fullscreen. Not sure why.
}


	//		-----------------------------------------------------------------------		[   UPDATE   ]		-----------------------------------------------------------------------
function update(timestamp){
	window.requestAnimationFrame(update);
	if(paused){
		if(menuOpen){
			MMDrawLine();
		}
		return;
	}
	dt = Math.min(performance.now()*0.001 - lastTime , 0.125);//		no frame can skip more than 1/8 seconds. (if framerate is below 8, game will actually slow down)
	lastTime = performance.now()*0.001;
	if(useZ)
		drawXYZ();//		update the 3D view

	//		-----------------------------------------------------------------------		[   Debugging   ]		-----------------------------------------------------------------------
	//		incrament every frame. Reset at every second.
	if(lastTime - debugFramerateTime > 1){
		debugFramerateTime = lastTime;
		debugFramerateLast = debugFramerateCount;
		debugFramerateCount = 0;
		if(useZ){//		change the 3D view update frequency based on framerate
			if(debugFramerateLast < 30){
				if(debugFramerateLast < 20){
					scanStep = 2;
					lineResolution = 8;
				}else{
					scanStep = 6;
					lineResolution = 7;
				}
			}else{
				if(debugFramerateLast > 57){
					scanStep = 12;
					lineResolution = 3;
				}else{
					scanStep = 8;
					lineResolution = 5;
				}
			}
		}
	}else{
		debugFramerateCount++;
	}
		
	if(ctrlHeld){//		speed up game x5
		dt *= 5;
	}

	if(debugSkipFrame && !debugSingleFrame){
		//drawNumberLines();//		see 3B1BAnimations
		return;
	}
	debugSingleFrame = false;
	//				Debug pause and frame advance
//		-----------------------------------------------------------------------		[   /Debugging   ]		-----------------------------------------------------------------------
		
//		-----------------------------------------------------------------------		[   Draw Screen   ]		-----------------------------------------------------------------------
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawGrid();
//		-----------------------------------------------------------------------		[   Draw background .svg   ]		-----------------------------------------------------------------------
	if(drawBackground)
		ctx.drawImage( background , (-screenx - 200)* screenScale , (screeny - 200) * screenScale , 400*screenScale , 400*screenScale);

//		-----------------------------------------------------------------------		[   Draw y = next to equation input   ]		-----------------------------------------------------------------------

	//		write equation the line is using if the equation in the input box is invalid and therefore, is not being used
	if(usePiecewise){
		ctx.fillStyle = "black";
		ctx.fillText("y=", Math.round(screenWidth * 0.003) , screenHeight - 20 +22.5 - pieEquInputsUsed*22.5);
		ctx.font = 10+40*pieEquInputsUsed + "px Arial";
		ctx.fillText("{", Math.round(screenWidth * 0.003) + 25 , screenHeight + 26 - pieEquInputsUsed*22.5);
	}else{
		if(equInvalid){//		invalid equation, show y = old equation
			ctx.fillStyle = "#888888";
			ctx.fillText("y= " + equLast , Math.round(screenWidth * 0.01) , screenHeight - 60);
		}else{
			ctx.fillStyle = "black";
			ctx.fillText("y=", Math.round(screenWidth * 0.01) , screenHeight - 20);
			if(!containsVariables){//		if equation does not contain x, z, or t, (output is constant) show the answer next to the input line.
				ctx.fillText("y = " + equation(0).toString() , Math.round(screenWidth * 0.02) , screenHeight - 60);
			}
		}
	}
		
	if(simulating){
		frameTime += dt;
	}else{
		frameTime = 0;
	}

	drawLine();
	moveSledder();//		see sledder.js
		
	//		call a full screen render if render2d is used. Call only on renderFullTimer=0 so it is only called once
	if(useRender){
		renderFullTimer--;
		if(renderFullTimer == 0){
			renderx = screenWidth;
			renderPass();
		}
	}
		
	if(shiftHeld && (!simulating || !camLocked)){
		cursorPosition();//		see SvgEditor.js
	}
	if(graphingPoints)
		drawGraphedPoints();//		see SvgEditor.js
	drawColliders();//		see collisions.js
//	drawNumberLines();//		see 3B1BAnimations.js
//	numberLine(5,2,4);

//			animCore();

	if(useDrag)//		render drag points
		dragMain();

	if(showMessage){
		messageTime += dt;
		ctx.fillStyle = "#A00000" + Math.round(Math.max(Math.min(Math.min(messageTime*8-1,-messageTime+2)+1 , 1) *255, 17)).toString(16);//		font color for text overlay
		ctx.font = "bold 80px Arial";
		ctx.fillText(messageText , screenWidth/2 , screenHeight/5);
		if(messageTime > 3)
			showMessage = false;
	}
		
//	ctx.fillText( Math.round(debugFramerateLast).toString() + "fps" , Math.round(screenWidth * 0.8) , 40);
}
//		-----------------------------------------------------------------------		[   /UPDATE/   ]		-----------------------------------------------------------------------