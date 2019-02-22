//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
function moveScreen(){
	dragScreenX -= (mouseX - mouseLastX)/screenScale;
	dragScreenY -= (mouseY - mouseLastY)/screenScale;

	if(useRender)
		renderCenter();//		see 2dRender.js
	
	if(useScreenLimit){
		//		lock the edges of the screen to within 40 meters horizontally, 60 vertically of the nearest 2 goals
		//									left limit									right limit
		dragScreenX = math.min(math.max(checkScreenx[0]-60 + screenWidth/2/screenScale , dragScreenX) , checkScreenx[1]+60 - screenWidth/2/screenScale);
		//									bottom limit									top limit
		dragScreenY = math.min(math.max(-checkScreeny[1]-40 + screenHeight/2/screenScale , dragScreenY) , -checkScreeny[0]+40 - screenHeight/2/screenScale);
		console.log(checkScreenx[0] + " - " + checkScreenx[1] + " ||| " + checkScreeny[0] + " - " + checkScreeny[1])
	}
	
	screenx = dragScreenX - screenWidth/2/screenScale;
	screeny = -dragScreenY + screenHeight/2/screenScale;
}


function zoomScreen(change){
	if(shiftHeld)
		change *= 0.2;
	//		scale is non-linear so multiplying by dragScreenScale makes changes close to linear
	dragScreenScale = Math.min(Math.max(dragScreenScale - change*dragScreenScale , 0.15) , 40000);
	
	if(useScreenLimit){//		clamp the screen to show only this checkpoint and the 2 closest in both directions
	console.log(screenWidth/(checkScreenx[1] - checkScreenx[0]));
	console.log(screenHeight/(checkScreeny[1] - checkScreeny[0]));
		//		don't let them zoom so the screen is wider or taler than the area they are allowed to see
		dragScreenScale = Math.max(dragScreenScale , screenWidth/(checkScreenx[1] - checkScreenx[0] + 120));
		dragScreenScale = Math.max(dragScreenScale , screenHeight/(checkScreeny[1] - checkScreeny[0] + 80));
		screenScale = dragScreenScale;
		//		activate so the edge of the screen does not go outside the box. mouseLast is set so the screen does not move based on mouse movement.
		mouseLastX = mouseX;
		mouseLastY = mouseY;
		moveScreen();
		console.log("Scale = "+dragScreenScale);
		
	}else{
		if(screenScale != dragScreenScale){//		if you are at max or min zoom, do not move the screen
			screenScale = dragScreenScale;
			screenx = dragScreenX - screenWidth/2/screenScale;
			screeny = -dragScreenY + screenHeight/2/screenScale;
			//				Zoom twards mouse so mouse does not move on screen (Comment out following 4 lines to zoom on screen center)
			dragScreenX -= change*(mouseX - screenWidth/2)/screenScale;
			dragScreenY -= change*(mouseY - screenHeight/2)/screenScale;
			screenx = dragScreenX - screenWidth/2/screenScale;
			screeny = -dragScreenY + screenHeight/2/screenScale;
		}else{
			screenScale = dragScreenScale;
		}
	}
}


function updateScreenLockPoints(){
	//		start with the most restrictive possible camera limits
	checkScreenx = [defaultSledx , defaultSledx];
	checkScreeny = [defaultSledy , defaultSledy];
	ltmp = 99999;//		checkScreen[0] to current checkpoint distance^2
	rtmp = 99999;//		checkScreen[1] to current checkpoint distance^2
	
	for(i = checkx.length-1 ; i > -1  ; i--){
		//		skip current checkpoint
		if(i == checkCurrent)
			continue;
		
		dx = checkx[i]-defaultSledx;
		dy = checky[i]-defaultSledy;
		ftmp = dx*dx + dy*dy;
		//		checkpoint is left of the sled's default position but is closer to that position than the current checkpoint
		//		set checkScreenx[0] to the checkpoint/goal closest on your left
		if(checkx[i] < defaultSledx){
			//		if this checkpoint is closer to the sledder than the last one
			if(ftmp < ltmp){
				ltmp = ftmp;
				checkScreenx[0] = checkx[i];
				checkScreeny[0] = checky[i];
			}
		}else{//		set checkScreenx[1] to the checkpoint/goal closest on your right
			//		if this checkpoint is closer to the sledder than the last one
			if(ftmp < rtmp){
				rtmp = ftmp;
				checkScreenx[1] = checkx[i];
				checkScreeny[1] = checky[i];
			}
		}
	}
	//		check goal
	dx = goalx - defaultSledx;
	dy = goaly - defaultSledy;
	ftmp = dx*dx + dy*dy;
	if(goalx < defaultSledx){
		if(ftmp < ltmp){
			ltmp = ftmp;
			checkScreenx[0] = goalx;
			checkScreeny[0] = goaly;
		}
	}else{
		if(ftmp < rtmp){
			rtmp = ftmp;
			checkScreenx[1] = goalx;
			checkScreeny[1] = goaly;
		}
	}
	
	//		make sure the sled's current position is within the view area
	checkScreenx[0] = math.min(checkScreenx[0] , defaultSledx);
	checkScreenx[1] = math.max(checkScreenx[1] , defaultSledx);
	checkScreeny[0] = math.min(checkScreeny[0] , defaultSledy);
	checkScreeny[1] = math.max(checkScreeny[1] , defaultSledy);
}