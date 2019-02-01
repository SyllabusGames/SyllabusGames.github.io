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
	setUpAllInputs();
	typeScreenResize();
	
	

	saveLevel();//		for testing
	buildLevelMap();//		for testing
	loadLevelMap();//		for testing
//			setUpAnim();
	ctx.textAlign="center";

	//ctx.save();
	setUpPlayerInputs();//		see KeyboardMouseInput.js
	
	//	import image for sledder
	sledderSvg.src = "SineRiderSledOptimized.svg";
	
	window.requestAnimationFrame(update);

	//		-----------------------------------------------------------------------		[   Page Icon   ]		-----------------------------------------------------------------------
	var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = 'SineRiderSGLogo.png';
	document.getElementsByTagName('head')[0].appendChild(link);

	
	screenSizeChanged();//			set the canvas size to the window/screen size
	
	
	// if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){//		load onScreenKeypad if on mobile
	// document.getElementById('onScreenKeypad').style.display = "block";
	// }
	//		uncomment the following 2 lines if you ever decide automatically sizing to the window at the game's start is a bad idea.
//	window.scrollTo(0, 0);//		If the screen is windowed, it may be nessisary to reset the scroll position to 0,0
//	canvas.width = screenWidth;//		this fixes text positions not being updated until you toggle fullscreen. Not sure why.
}






	//		-----------------------------------------------------------------------		[   UPDATE   ]		-----------------------------------------------------------------------
function update(){
	window.requestAnimationFrame(update);
	if(paused){
		if(menuOpen){
			menuUpdate();
		}
		return;
	}
	dt = Math.min(performance.now()*0.001 - lastTime , 0.125);//		no frame can skip more than 1/8 seconds. (if framerate is below 8, game will actually slow down)
	lastTime = performance.now()*0.001;
	if(useZ)
		drawXYZ();//		update the 3D view
	
	
	//		-----------------------------------------------------------------------		[   Framerate Monitor   ]		-----------------------------------------------------------------------
	//		increment every frame. Reset at every second.
	if(lastTime - performanceFramerateTime > 1){
		performanceFramerateTime = lastTime;
		performanceFramerateLast = performanceFramerateCount;
		performanceFramerateCount = 0;
		if(useZ){//		change the 3D view update frequency based on framerate
			if(performanceFramerateLast < 30){
				if(performanceFramerateLast < 20){
					scanStep = 2;
					lineResolution = 8;
				}else{
					scanStep = 6;
					lineResolution = 7;
				}
			}else{
				if(performanceFramerateLast > 55){
					scanStep = 12;
					lineResolution = 3;
				}else{
					scanStep = 8;
					lineResolution = 5;
				}
			}
		}
	}else{
		performanceFramerateCount++;
	}
	
//		-----------------------------------------------------------------------		[   Simulation Speed Changes   ]		-----------------------------------------------------------------------
	if(simulating){
		if(slowMotion){
			dt *= 0.05;
		}
		
		if(ctrlHeld){//		speed up game
			if(slowMotion){
				dt *= 120;
			}else
				dt *= 3;
		}
	}
		
		
//		-----------------------------------------------------------------------		[   CLEAR SCREEN   ]		-----------------------------------------------------------------------
	ctx.clearRect(0, 0, canvas.width, canvas.height);
//		----------------		[   Draw parallax background .svg   ]		----------------
	if(drawParallax)
		ctx.drawImage( parallaxBackground , (-screenx/2 - 200)* screenScale - (8000-200)*screenScale + screenWidth/4 , (screeny/2 - 200) * screenScale - (8000-200)*screenScale + screenHeight/4 , 16000*screenScale , 16000*screenScale);
	
	drawGrid();
//		----------------		[   Draw background .svg   ]		----------------
	if(drawBackground)
		ctx.drawImage( background , (-screenx - 200)* screenScale , (screeny - 200) * screenScale , 400*screenScale , 400*screenScale);
		
	if(simulating){
		frameTime += dt;
	}else{
		frameTime = 0;
		pxt = 0;
		
		//		Level is not running, display the name
		ctx.fillStyle = "black";//		font color for text overlay
		ctx.font = "40px Arial";
		ctx.fillText(levelName,10,40);
	}

	graphAllLines();
	runPhysics();//		see sledder.js

	//		----------------------------------------------------		[   Move/Scale Screen   ]		----------------------------------------------------
	if(simulating && camLocked){
		screenFollowSledder();
	}
		
	//		call a full screen render if render2d is used. Call only on renderFullTimer=0 so it is only called once
	if(useRender){
		renderFullTimer--;
		if(renderFullTimer == 0){
			renderx = screenWidth;
			renderPass();
		}
	}
	
//		write cursor position to screen	
	if(shiftHeld && (!simulating || !camLocked)){
		cursorPosition();//		see SvgEditor.js
	}
	
	if(graphingPoints)
		drawGraphedPoints();//		see SvgEditor.js
	
	if(!useNone && ! isCutscene)
		drawGoals();//		see DrawBackground.js
	
	if(showSVGPoints)
		drawSVGColliders();
	
//	drawNumberLines();//		see 3B1BAnimations.js
//	numberLine(5,2,4);

//			animCore();

	if(isDrag)//		render drag points
		dragMain();

//		-----------------------------------------------------------------------		[   Display messages in Big Red Text   ]		-----------------------------------------------------------------------
	if(showMessage){
		messageTime += dt;
		ctx.fillStyle = _displayErrorColor + Math.round(Math.max(Math.min(Math.min(messageTime*8-1,-messageTime+2)+1 , 1) *255, 17)).toString(16);//		font color for text overlay
		ctx.font = "bold 80px Arial";
		ctx.fillText(messageText , screenWidth/2 - ctx.measureText(messageText).width/2 , screenHeight/5);//		place text in the upper center of screen (measure text)
		if(messageTime > 3)
			showMessage = false;
	}
		
//	ctx.fillText( Math.round(performanceFramerateLast).toString() + "fps" , Math.round(screenWidth * 0.8) , 40);
}
//		-----------------------------------------------------------------------		[   /UPDATE/   ]		-----------------------------------------------------------------------