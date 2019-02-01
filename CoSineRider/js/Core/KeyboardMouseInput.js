<<<<<<< HEAD
﻿//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
/*		File contains:
 *		ALL keyboard and mouse input listeners (excluding XYZ view, mods, and menus)
 *		Player controlled screen movement and zoom
 *		
 *	get keycodes from here: https://css-tricks.com/snippets/javascript/javascript-keycodes/
*/

var mouseX = 0.0;
var mouseY = 0.0;

var shiftHeld = false;
var rmbHeld = false;//		right mouse button held

//		this is a function call called in Main.js so it doesn't load immediatly and let the user input keypresses before the game loads (it was causing error messages)
function setUpPlayerInputs(){
	if(paused)
		return;

	document.addEventListener('mousemove', updateMousePosition);
	document.addEventListener('touchmove', updateMousePosition);

	//		----------------------------------------------------		[   Key Down   ]		----------------------------------------------------
	document.addEventListener("keydown", function(e){
	//	console.log("Pressed Key " + e.keyCode);
		if(e.keyCode == 17){//		Ctrl
			e.preventDefault();
			ctrlHeld = true;
		}
		if(e.keyCode == 20){//		CapsLock
			e.preventDefault();
			slowMotion = true;
		//	draggingScreen = true;
		}
		if(e.keyCode == 18){//		Alt. Skip level
			e.preventDefault();
			levelCleared();
		}
		if(e.keyCode == 36){//		Home
			draggingScreen = true;
		}
		if(e.keyCode == 16){//		Shift
			e.preventDefault();
			shiftHeld = true;
			if(document.body.style.cursor == "auto")
				document.body.style.cursor = "crosshair";
		}
		if(e.keyCode == 90 && ctrlHeld){//		Ctrl Z (Equation undo)
			e.preventDefault();
			equExecutingUndo = true;//		set this so the equation you pull from the undo list is not then added to the undo list
			if(shiftHeld){//		Redo
				if(isPiecewise || isProxyVar || isProxyFunction)
					pieUndoRedo(false);
				else
					equUndoRedo(false);
			}else{//		Undo
				if(isPiecewise || isProxyVar || isProxyFunction)
					pieUndoRedo(true);
				else
					equUndoRedo(true);
			}
		}
		if(e.keyCode == 90 && shiftHeld){//		Shift Z (Point graph undo)
			e.preventDefault();
			undoGraphedPoints();
		}
		if(e.keyCode == 13){//		Enter.		(this has to come after Shift)
			e.preventDefault();//		don't type a newline character
			animCanProceed = true;
			if(isCutscene){
				cutAdvance();
				return;
			}
			if(useNone)
				return;
			if(!simulating){//		if not simulating (and about to start) lock the camera if shift is not held down.
				camLocked = !shiftHeld;//		if you hold shift while pressing Enter, sim uses your camera, if not, it uses the standard "keep goal and sledder in frame" aniamtion
				if(useRender){//	Cannot start sledding when rendering an inequality. Display error message.
					showMessage = true;//		see CoSineRider.html
					messageTime = 0;
					messageText = "REMOVE < > = FROM EQUATION";
					return;
				}
			}
			resetSledder();//		This is what Plays & Pauses the game
		}
		if(e.keyCode == 34){//		Pare Down
			zoomScreen(0.2114);
		}
		if(e.keyCode == 33){//		Page Up
			zoomScreen(-0.2686);
		}

		//		-----------------------------------------------------------------------		[   MAIN MENU   ]		-----------------------------------------------------------------------
		if(e.keyCode == 192){//		`/~ key
			e.preventDefault();//		don't type a `
			if(menuOpen){//		hide main menu
				menuClose();
			}else{//		show main menu
				menuInitialize();//		see Menu.js
				showHideInputs("none");//		see InputManager.js
				menuOpen = true;
				paused = true;
			}
		}

		if (e.keyCode == 32){//		SpaceBar or Escape key
			e.preventDefault();//		don't type a space
			//		-----------------------------------------------------------------------		[   Toggle FullScreen   ]		-----------------------------------------------------------------------
			//		folowing code from		https://xparkmedia.com/blog/enter-fullscreen-mode-javascript/
			if((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
				console.log("Enter fullscreen");
				//		switch to fullscreen
				screenWidth = window.screen.width * window.devicePixelRatio;//		set screenWidth and screenHeight to fullScreen size
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
			}
			else{//		exit fullscreen
				console.log("exit fullscreen");
				screenWidth = 1600;
				screenHeight = 800;
				if (document.cancelFullScreen) {
					document.cancelFullScreen();
				}else if(document.mozCancelFullScreen){
					document.mozCancelFullScreen();
				}else if(document.webkitCancelFullScreen){
					document.webkitCancelFullScreen();
				}
			}
		}
	});


	//		----------------------------------------------------		[   Key Up   ]		----------------------------------------------------
	document.addEventListener("keyup", function(e){
		//	console.log("Released Key " + e.keyCode);

		//		the console logs an error here if you refresh using the F5 key.
		//		update the active input 
		checkInputFields(document.activeElement);
		if(e.keyCode == 17){//		Ctrl
			e.preventDefault();
			ctrlHeld = false;
		}
		
		if(e.keyCode == 16){//		Shift
			e.preventDefault();
			shiftHeld = false;
			if(document.body.style.cursor == "crosshair")
				document.body.style.cursor = "auto";
		}
		if(e.keyCode == 20){//		CapsLock
			e.preventDefault();
			slowMotion = false;
		//	draggingScreen = false;
		}
		if(e.keyCode == 36){//		Home
			draggingScreen = false;
		}
	});



	//		from https://stackoverflow.com/questions/10706070/how-to-detect-when-a-page-exits-fullscreen
	document.addEventListener('webkitfullscreenchange', exitHandler, false);
	document.addEventListener('mozfullscreenchange', exitHandler, false);
	document.addEventListener('fullscreenchange', exitHandler, false);
	document.addEventListener('MSFullscreenChange', exitHandler, false);
	

	window.addEventListener("resize", screenSizeChanged);


	document.addEventListener('mousedown', mouseDown);
	document.addEventListener('touchstart', mouseDown);

	document.addEventListener('mouseup' , mouseUp);
	document.addEventListener('touchend' , mouseUp);

	//		----------------------------------------------------		[   Scroll Wheel (Screen Zoom)   ]		----------------------------------------------------
	document.addEventListener('wheel', function(e){
		e.preventDefault();//		holding ctrl will not zoom the screen
		if(paused)
			return;
		if(!simulating || !camLocked){//		run when camera is not locked
		var evt = e==null ? event : e;//		firefox compatibility	
			if(Math.abs(evt.clientY - (parseInt(mainInput.style.top) + 57)) > 32){//		do not scroll if the cursor is over (on the Y axis) an input field
				zoomScreen(0.24*Math.sign(e.deltaY) - 0.0286);//		makes scroll speed brouser independent.
					//		The first number (0.24) is the zoom speed / step size. (Larger number → faster zoom)
					//		The second number (-0.0286) is the offset so zooming in and out 1 step each puts the camera where it was before zooming. 0.0286 ≈ (0.24^2)/2
				if(useRender)
					renderCenter();//		see 2dRender.js
			}
		}
	});
}

//		this is here to move the screen elements back when Escape is used to exit fullscreen
function exitHandler(){
	if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)){
		console.log("Exited fullscreen with Esc key");
		screenSizeChanged();
	}else{
		screenSizeChanged();
	}
}
function screenSizeChanged(){
	screenWidth = document.documentElement.clientWidth * (window.devicePixelRatio || 1);
	screenHeight = document.documentElement.clientHeight *(window.devicePixelRatio || 1);
	window.scrollTo(0, 0);
	xyzc.style.left = screenWidth-500 + "px";
	xyz2c.style.left = screenWidth-500 + "px";
	canvas.width = screenWidth;
	canvas.height = screenHeight;
	//		move play/pause button to lower right corner of screen
	playPauseButton.style.left = (screenWidth-65) + "px";
	playPauseButton.style.top = (screenHeight-65) + "px";
//	console.log(isPiecewise + " - " + isDrag + " - " + isFillBlanks + " - " + isCutscene);
	if(isPiecewise)
		pieScreenResize();
	else if(isProxyVar)
		pVarScreenResize();
	else if(isProxyFunction)
		pFunScreenResize();
	else if(isDrag)
		dragScreenResize();
	else if(isFillBlanks)
		blankScreenResize();
	else if(isProgramming)
		proScreenResize();
	else if(isCutscene)
		cutScreenResize();
	else
		typeScreenResize();
	
	if(!menuOpen){
		paused = false;//		resizing the screen will not pause the game but won't unpause if the menu is open
	}
}

//		----------------------------------------------------		[   Mouse Down   ]		----------------------------------------------------
function mouseDown(e){
	if(paused)
		return;
	var evt = e==null ? event : e;//		firefox compatibility	
	
	if( evt.which == 1 ){//		left click Preliminary
		animCanProceed = true;
		/*if(useZ){
			xyzMouseDown(evt.clientX , evt.clientY);//		see XYZView.js
		}*/
	}
//	console.log("Cam Locked = " + camLocked);

	if(!simulating || !camLocked){//		run when camera is not locked
		if( evt.which == 2 ){//		middle click
			evt.preventDefault();//		turn off page scrolling
			draggingScreen = true;
			mouseX = evt.clientX;
			mouseY = evt.clientY;
			dragScreenX = screenx + screenWidth/2/screenScale;
			dragScreenY = -screeny + screenHeight/2/screenScale;
			dragScreenScale = screenScale;
		}

		if( evt.which == 3 ){//		right click
			rmbHeld = true;
			if(shiftHeld){//		delete marked points near the cursor
				removeGraphedPoint(evt.clientX);
			}
		}

		if( evt.which == 1 ){//		left click
			if(isDrag && !simulating){
				dragMouseDown(evt.clientX , evt.clientY);
				e.preventDefault();//		no dom element ever needs to be selected in drag mode so dissable regular click to minimize accidental graphic dragging
			}
			
			if(isCutscene)//		if in a cutscene, go to the next panel
				cutAdvance();
			
			if(selectedPoint != -1)
				draggingPoint = true;
		
			if(rmbHeld){//		left click while holding right click to clear points
				clearGraphedPoints();
			}else if(shiftHeld){//		add a point to be permanently labeled
				addGraphedPoint(evt.clientX);
			}
		}
	}
}

//		----------------------------------------------------		[   Mouse Up   ]		----------------------------------------------------
function mouseUp(e){
	if(paused)
		return;

	var evt = e==null ? event : e;//		firefox compatibility

	if( evt.which == 2 ) {//		middle click
		draggingScreen = false;
	}
	
	if( evt.which == 1 ){//		left click
		draggingPoint = false;
		if(isDrag){
			dragPointIndex = -1;
			dragUpdateEqu();//		update equation to reset coloring
		}
	}
	
	if( evt.which == 3 ){//		right click
		rmbHeld = false;
	}
}
=======
﻿//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
/*		File contains:
 *		ALL keyboard and mouse input listeners (excluding XYZ view, mods, and menus)
 *		Player controlled screen movement and zoom
 *		
 *	get keycodes from here: https://css-tricks.com/snippets/javascript/javascript-keycodes/
*/

var mouseX = 0.0;
var mouseY = 0.0;

var shiftHeld = false;
var rmbHeld = false;//		right mouse button held

//		this is a function call called in Main.js so it doesn't load immediatly and let the user input keypresses before the game loads (it was causing error messages)
function setUpPlayerInputs(){
	if(paused)
		return;

	document.addEventListener('mousemove', updateMousePosition);
	document.addEventListener('touchmove', updateMousePosition);

	//		----------------------------------------------------		[   Key Down   ]		----------------------------------------------------
	document.addEventListener("keydown", function(e){
	//	console.log("Pressed Key " + e.keyCode);
		if(e.keyCode == 17){//		Ctrl
			e.preventDefault();
			ctrlHeld = true;
		}
		if(e.keyCode == 20){//		CapsLock
			e.preventDefault();
			slowMotion = true;
		//	draggingScreen = true;
		}
		if(e.keyCode == 18){//		Alt. Skip level
			e.preventDefault();
			levelCleared();
		}
		if(e.keyCode == 36){//		Home
			draggingScreen = true;
		}
		if(e.keyCode == 16){//		Shift
			e.preventDefault();
			shiftHeld = true;
			if(document.body.style.cursor == "auto")
				document.body.style.cursor = "crosshair";
		}
		if(e.keyCode == 90 && ctrlHeld){//		Ctrl Z (Equation undo)
			e.preventDefault();
			equExecutingUndo = true;//		set this so the equation you pull from the undo list is not then added to the undo list
			if(shiftHeld){//		Redo
				if(isPiecewise || isProxyVar || isProxyFunction)
					pieUndoRedo(false);
				else
					equUndoRedo(false);
			}else{//		Undo
				if(isPiecewise || isProxyVar || isProxyFunction)
					pieUndoRedo(true);
				else
					equUndoRedo(true);
			}
		}
		if(e.keyCode == 90 && shiftHeld){//		Shift Z (Point graph undo)
			e.preventDefault();
			undoGraphedPoints();
		}
		if(e.keyCode == 13){//		Enter.		(this has to come after Shift)
			e.preventDefault();//		don't type a newline character
			animCanProceed = true;
			if(isCutscene){
				cutAdvance();
				return;
			}
			if(useNone)
				return;
			if(!simulating){//		if not simulating (and about to start) lock the camera if shift is not held down.
				camLocked = !shiftHeld;//		if you hold shift while pressing Enter, sim uses your camera, if not, it uses the standard "keep goal and sledder in frame" aniamtion
				if(useRender){//	Cannot start sledding when rendering an inequality. Display error message.
					showMessage = true;//		see CoSineRider.html
					messageTime = 0;
					messageText = "REMOVE < > = FROM EQUATION";
					return;
				}
			}
			resetSledder();//		This is what Plays & Pauses the game
		}
		if(e.keyCode == 34){//		Pare Down
			zoomScreen(0.2114);
		}
		if(e.keyCode == 33){//		Page Up
			zoomScreen(-0.2686);
		}

		//		-----------------------------------------------------------------------		[   MAIN MENU   ]		-----------------------------------------------------------------------
		if(e.keyCode == 192){//		`/~ key
			e.preventDefault();//		don't type a `
			if(menuOpen){//		hide main menu
				menuClose();
			}else{//		show main menu
				menuInitialize();//		see Menu.js
				showHideInputs("none");//		see InputManager.js
				menuOpen = true;
				paused = true;
			}
		}

		if (e.keyCode == 32){//		SpaceBar or Escape key
			e.preventDefault();//		don't type a space
			//		-----------------------------------------------------------------------		[   Toggle FullScreen   ]		-----------------------------------------------------------------------
			//		folowing code from		https://xparkmedia.com/blog/enter-fullscreen-mode-javascript/
			if((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
				console.log("Enter fullscreen");
				//		switch to fullscreen
				screenWidth = window.screen.width * window.devicePixelRatio;//		set screenWidth and screenHeight to fullScreen size
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
			}
			else{//		exit fullscreen
				console.log("exit fullscreen");
				screenWidth = 1600;
				screenHeight = 800;
				if (document.cancelFullScreen) {
					document.cancelFullScreen();
				}else if(document.mozCancelFullScreen){
					document.mozCancelFullScreen();
				}else if(document.webkitCancelFullScreen){
					document.webkitCancelFullScreen();
				}
			}
		}
	});


	//		----------------------------------------------------		[   Key Up   ]		----------------------------------------------------
	document.addEventListener("keyup", function(e){
		//	console.log("Released Key " + e.keyCode);

		//		the console logs an error here if you refresh using the F5 key.
		//		update the active input 
		checkInputFields(document.activeElement);
		if(e.keyCode == 17){//		Ctrl
			e.preventDefault();
			ctrlHeld = false;
		}
		
		if(e.keyCode == 16){//		Shift
			e.preventDefault();
			shiftHeld = false;
			if(document.body.style.cursor == "crosshair")
				document.body.style.cursor = "auto";
		}
		if(e.keyCode == 20){//		CapsLock
			e.preventDefault();
			slowMotion = false;
		//	draggingScreen = false;
		}
		if(e.keyCode == 36){//		Home
			draggingScreen = false;
		}
	});



	//		from https://stackoverflow.com/questions/10706070/how-to-detect-when-a-page-exits-fullscreen
	document.addEventListener('webkitfullscreenchange', exitHandler, false);
	document.addEventListener('mozfullscreenchange', exitHandler, false);
	document.addEventListener('fullscreenchange', exitHandler, false);
	document.addEventListener('MSFullscreenChange', exitHandler, false);
	

	window.addEventListener("resize", screenSizeChanged);


	document.addEventListener('mousedown', mouseDown);
	document.addEventListener('touchstart', mouseDown);

	document.addEventListener('mouseup' , mouseUp);
	document.addEventListener('touchend' , mouseUp);

	//		----------------------------------------------------		[   Scroll Wheel (Screen Zoom)   ]		----------------------------------------------------
	document.addEventListener('wheel', function(e){
		e.preventDefault();//		holding ctrl will not zoom the screen
		if(paused)
			return;
		if(!simulating || !camLocked){//		run when camera is not locked
		var evt = e==null ? event : e;//		firefox compatibility	
			if(Math.abs(evt.clientY - (parseInt(mainInput.style.top) + 57)) > 32){//		do not scroll if the cursor is over (on the Y axis) an input field
				zoomScreen(0.24*Math.sign(e.deltaY) - 0.0286);//		makes scroll speed brouser independent.
					//		The first number (0.24) is the zoom speed / step size. (Larger number → faster zoom)
					//		The second number (-0.0286) is the offset so zooming in and out 1 step each puts the camera where it was before zooming. 0.0286 ≈ (0.24^2)/2
				if(useRender)
					renderCenter();//		see 2dRender.js
			}
		}
	});
}

//		this is here to move the screen elements back when Escape is used to exit fullscreen
function exitHandler(){
	if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)){
		console.log("Exited fullscreen with Esc key");
		screenSizeChanged();
	}else{
		screenSizeChanged();
	}
}
function screenSizeChanged(){
	screenWidth = document.documentElement.clientWidth * (window.devicePixelRatio || 1);
	screenHeight = document.documentElement.clientHeight *(window.devicePixelRatio || 1);
	window.scrollTo(0, 0);
	xyzc.style.left = screenWidth-500 + "px";
	xyz2c.style.left = screenWidth-500 + "px";
	canvas.width = screenWidth;
	canvas.height = screenHeight;
	//		move play/pause button to lower right corner of screen
	playPauseButton.style.left = (screenWidth-65) + "px";
	playPauseButton.style.top = (screenHeight-65) + "px";
//	console.log(isPiecewise + " - " + isDrag + " - " + isFillBlanks + " - " + isCutscene);
	if(isPiecewise)
		pieScreenResize();
	else if(isProxyVar)
		pVarScreenResize();
	else if(isProxyFunction)
		pFunScreenResize();
	else if(isDrag)
		dragScreenResize();
	else if(isFillBlanks)
		blankScreenResize();
	else if(isProgramming)
		proScreenResize();
	else if(isCutscene)
		cutScreenResize();
	else
		typeScreenResize();
	
	if(!menuOpen){
		paused = false;//		resizing the screen will not pause the game but won't unpause if the menu is open
	}
}

//		----------------------------------------------------		[   Mouse Down   ]		----------------------------------------------------
function mouseDown(e){
	if(paused)
		return;
	var evt = e==null ? event : e;//		firefox compatibility	
	
	if( evt.which == 1 ){//		left click Preliminary
		animCanProceed = true;
		/*if(useZ){
			xyzMouseDown(evt.clientX , evt.clientY);//		see XYZView.js
		}*/
	}
//	console.log("Cam Locked = " + camLocked);

	if(!simulating || !camLocked){//		run when camera is not locked
		if( evt.which == 2 ){//		middle click
			evt.preventDefault();//		turn off page scrolling
			draggingScreen = true;
			mouseX = evt.clientX;
			mouseY = evt.clientY;
			dragScreenX = screenx + screenWidth/2/screenScale;
			dragScreenY = -screeny + screenHeight/2/screenScale;
			dragScreenScale = screenScale;
		}

		if( evt.which == 3 ){//		right click
			rmbHeld = true;
			if(shiftHeld){//		delete marked points near the cursor
				removeGraphedPoint(evt.clientX);
			}
		}

		if( evt.which == 1 ){//		left click
			if(isDrag && !simulating){
				dragMouseDown(evt.clientX , evt.clientY);
				e.preventDefault();//		no dom element ever needs to be selected in drag mode so dissable regular click to minimize accidental graphic dragging
			}
			
			if(isCutscene)//		if in a cutscene, go to the next panel
				cutAdvance();
			
			if(selectedPoint != -1)
				draggingPoint = true;
		
			if(rmbHeld){//		left click while holding right click to clear points
				clearGraphedPoints();
			}else if(shiftHeld){//		add a point to be permanently labeled
				addGraphedPoint(evt.clientX);
			}
		}
	}
}

//		----------------------------------------------------		[   Mouse Up   ]		----------------------------------------------------
function mouseUp(e){
	if(paused)
		return;

	var evt = e==null ? event : e;//		firefox compatibility

	if( evt.which == 2 ) {//		middle click
		draggingScreen = false;
	}
	
	if( evt.which == 1 ){//		left click
		draggingPoint = false;
		if(isDrag){
			dragPointIndex = -1;
			dragUpdateEqu();//		update equation to reset coloring
		}
	}
	
	if( evt.which == 3 ){//		right click
		rmbHeld = false;
	}
}
>>>>>>> a3503f6d8084bec8645c5c94b584ec9e6b4120a9
