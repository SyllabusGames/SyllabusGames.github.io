//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
/*		File contains:
 *		ALL keyboard and mouse input listeners
 *		Player controlled screen movement and zoom
 *		
 *	get keycodes from here: https://css-tricks.com/snippets/javascript/javascript-keycodes/
*/
document.addEventListener('mousemove', updateMousePosition);

//		----------------------------------------------------		[   Keyboard   ]		----------------------------------------------------
document.addEventListener("keydown", function(e){
//	console.log("Pressed Key " + e.keyCode);
	if(e.keyCode == 17){//		Ctrl
		ctrlHeld = true;
	}
	if(e.keyCode == 20){//		CapsLock
		debugSkipFrame = true;
	}else if(e.keyCode == 16){//		Shift
		writeCursor = true;
	}
	console.log(writeCursor);
	if(e.keyCode == 13){//		enter.		This has to come after Shift
		if(!simulating)//		if not simulating (and about to start) lock the camera if shift is not held down.
			camLocked = !writeCursor;//		if you hold shift while pressing Enter, sim uses your camera, if not, it uses the standard "keep goal and sledder in frame" aniamtion
		resetSledder();
		checkInputFields();//		update line. (useful if the player types something while the simulation is running)
	console.log("Play");
	}
	if(e.keyCode == 90){//		Z
		debugSingleFrame = true;
	}

	//		-----------------------------------------------------------------------		[   MAIN MENU   ]		-----------------------------------------------------------------------
	if(e.keyCode == 192){//		`/~ key
		if(menuOpen){//		hide main menu
			showHideInputs(true);
			menuOpen = false;
			paused = false;
		}else{//		show main menu
			drawMainMenu();//		see Menu.js
			showHideInputs(false);//		see InputManager.js
			menuOpen = true;
			paused = true;
		}
	}

	if (e.keyCode == 32){//		SpaceBar
//		-----------------------------------------------------------------------		[   Toggle FullScreen   ]		-----------------------------------------------------------------------
		//		folowing code from		https://xparkmedia.com/blog/enter-fullscreen-mode-javascript/
		if((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
			//		switch to fullscreen
			screenWidth = window.screen.width * window.devicePixelRatio;
			screenHeight = window.screen.height * window.devicePixelRatio;
			if(document.documentElement.requestFullScreen) {
				document.documentElement.requestFullScreen();
			}else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			}else if (document.documentElement.webkitRequestFullScreen) {
				document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
			//		make sure the screen is always landscape
			if(screenHeight > screenWidth){
				k = screenHeight;
				screenHeight = screenWidth;
				screenWidth = k;
			}
		}else{//		exit fullscreen
			screenWidth = 1600;
			screenHeight = 800;
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			}else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			}else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
		//		keep 3D view in right corner of view
		console.log("fullscreen");
		xyzc.style.left = screenWidth-600 + "px";
		xyz2c.style.left = screenWidth-600 + "px";
		canvas.width = screenWidth;
		canvas.height = screenHeight;
		equInputField = piecInput[0].style;
		equInputField.left = Math.round(screenWidth * 0.05) + "px";
		equInputField.top = Math.round(screenHeight * 0.85) + "px";
		equInputField.width = Math.round(screenWidth * 0.9) + "px";
	}
});


document.addEventListener("keyup", function(e){
	//	console.log("Released Key " + e.keyCode);
	//		update the active input 
	if(usePiecewise){//		if multiple inputs and current input is not mainInput
		for(i = 0 ; i < piecSecCount ; i++){//		check all input fields and set whichever is avtive as mainInput
			if(piecInput[i] == document.activeElement){
				checkInputFields(i);
				break;
			}
		}
	}else{//		not piecewise. Use normal input (0)
		checkInputFields(0);//		see EquationLine.js
	}
	if(e.keyCode == 17){//		Ctrl
		ctrlHeld = false;
	}
	if(e.keyCode == 16){//		Shift
		writeCursor = false;
	}
	if(e.keyCode == 20){//		CapsLock
		debugSkipFrame = false;
	}
});

//		----------------------------------------------------		[   Mouse Down   ]		----------------------------------------------------
document.addEventListener('mousedown', function(e){
	var evt = e==null ? event : e;//		firefox compatibility	
	
	if( evt.which == 1 ){//		left click
		if(useZ){
			xyzMouseDown(evt.clientX , evt.clientY);//		see XYZView.js
		}
	}
	console.log("Cam Locked = " + camLocked);
	if(!simulating || !camLocked){//		run when camera is not locked
		if( evt.which == 2 ) {//		middle click
			evt.preventDefault();//		turn off page scrolling
			draggingScreen = true;
			if(dragScreenX == 0){//		the screen is currently in its default position
				dragScreenX = screenx + screenWidth/2/screenScale;
				dragScreenY = -screeny + screenHeight/2/screenScale;
			
				dragScreenScale = screenScale;
			}
		}

		if( evt.which == 3 ){//		right click
			writeCursor = true;
		}

		if( evt.which == 1 ){//		left click
			if(selectedPoint != -1)
				draggingPoint = true;
		
			if(writeCursor){//		add a point to be perminently labled
				graphingPoints = true;
				if(ctrlHeld)//		round x input
					graphPointXs.push(Math.round(evt.clientX/screenScale + screenx));
				else
					graphPointXs.push(evt.clientX/screenScale + screenx);
			}
		}
	}
});

//		----------------------------------------------------		[   Mouse Up   ]		----------------------------------------------------
document.addEventListener('mouseup', function(e){
	var evt = e==null ? event : e;//		firefox compatibility	

	if( evt.which == 2 ) {//		middle click
		draggingScreen = false;
	}
	
	if( evt.which == 1 ){//		left click
		draggingPoint = false;
	}
	
	if( evt.which == 3 ){//		right click
		writeCursor = false;
	}
});


//		----------------------------------------------------		[   Scroll Wheel (Screen Zoom)   ]		----------------------------------------------------
document.addEventListener('wheel', function(e){
	if(!simulating || !camLocked){//		run when camera is not locked
		ftmp = 0.24*Math.sign(e.deltaY) - 0.0286;//		makes scroll speed brouser independent.
			//		The first number (0.24) is the zoom speed / step size. (Larger number → faster zoom)
			//		The second number (-0.0286) is the offset so zooming in and out 1 step each puts the camera where it was before zooming. 0.0286 ≈ (0.24^2)/2
		dragScreenScale = Math.min(Math.max(dragScreenScale - ftmp*dragScreenScale , 0.15) , 17000);//		scale is non-linear so multiplying by dragScreenScale makes changes close to linear
		screenScale = dragScreenScale;
		screenx = dragScreenX - screenWidth/2/screenScale;
		screeny = -dragScreenY + screenHeight/2/screenScale;
		//				Zoom twards mouse so mouse does not move on screen (Comment out following 4 lines to zoom on screen center)
		dragScreenX -= ftmp*(mouseX - screenWidth/2)/screenScale;
		dragScreenY -= ftmp*(mouseY - screenHeight/2)/screenScale;
		screenx = dragScreenX - screenWidth/2/screenScale;
		screeny = -dragScreenY + screenHeight/2/screenScale;
	}
});