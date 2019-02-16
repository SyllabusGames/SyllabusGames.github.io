//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
//		set sledder rotation by this:	http://jsfiddle.net/johndavies91/xwMYY/		if possible
var defaultSledx = 0;
var defaultSledy = 0;

//		sled transform
var tempZ = 0;
var tempX = 0;

var sledderSvg = new Image;

//		called every time you win, lose, or reset
function resetSledder(){
	checkInputFields("all");//		update line. (useful if the player types something while the simulation is running)
	dropTime = 0;//		delete
	if(!simulating && equation(apx) > apy + 0.01){//		trying to start level but sled is below line
		showMessage = true;//		see CoSineRider.html
		messageTime = 0;
		messageText = "SLED IS BELOW LINE";
		return;
	}
	simulating = !simulating;
	//		reset sled's position everywhere it is recorded
	apx = defaultSledx;
	pxapx = defaultSledx;
	pxLastx = defaultSledx;
	apy = defaultSledy;
	pxapy = defaultSledy;
	pxLasty = defaultSledy;
	pxRot = 0;
	pxLastRot = 0;
	
	sledLastX = apx;//		reset positions for SVG collisions
	sledLastY = apy;
	spx = apx*screenScale;
	spy = -apy*screenScale;//		negative because the Y axis is measured from the top by the canvas
	av = 0;
	vx = 0;
	vy = 0;
	
	if(accelerationLimit){
		lastvx = 0;
		lastvy = 0;
		maxAcceleration = 0;
	}
			
	rotation = 0;
	if(simulating)
		buttonPause();
	else
		buttonPlay();
	
	//		checkpoint levels never animate the camera
	if(useScreenLimit)
		camLocked = false;
	
	if(camLocked){
		screenFollowSledder();//		reset screen position
		dragScreenScale = screenScale;
	}
	rotPointx = Math.cos(-rotation)*sledWidth;
	rotPointy = Math.sin(-rotation)*sledWidth;

	//		rotate sled to start lined up with the line
	if((-equation(apx + rotPointx) < (-apy + rotPointy))		||		(-equation(apx - rotPointx) < (-apy - rotPointy))){//		one of the sled's ends is below the line
		for(i = 0 ; i < 6 ; i++){
			rotPointx = Math.cos(-rotation)*sledWidth;
			rotPointy = Math.sin(-rotation)*sledWidth;
			pxRot += -((equation(apx - rotPointx) - (apy + rotPointy)) - (equation(apx + rotPointx) - (apy - rotPointy)))*0.4;
		}
	}
}

//		----------------------------------------------------		[   Move/Scale Screen   ]		----------------------------------------------------
function screenFollowSledder(){
	if(usePolar){
		//		set the screen scale based on the sled's distance from the center (apy) so the screen should always show about 1/4 of the arc
		screenScale = Math.max(Math.min(screenHeight/apy , 50) , 8);
		
		//		screen position is set to be the sled's world position (apy*math.cos(apx) , apy*math.sin(apx)) then offset half a screen size (in absolute coordinates) up and left
		screenx = apy*math.cos(apx)-screenWidth/2/screenScale;
		screeny = apy*math.sin(apx)+screenHeight/2/screenScale;
	}else{
		//		dist = distance between track point/goal and sled
		var dx = apx-trackPointx;
		var dy = (apy-trackPointy)*screenWidth/screenHeight;//		multiply y by Screen ratio so the target does not go off the top of the screen
		var dist = Math.sqrt(dx*dx + dy*dy);
		var weight = Math.max(Math.min(Math.log(Math.max(dist-5,0)/Math.max(151-dist,0))*0.05+0.5 , 1) , 0);//	Logit curve.	//	y = log(max(x-5,0)/max(150-x,0))*0.05+0.5
	//		weight is set to 0 (view is based only on target/goal position) when the sled is < 5m from the target
	//		weight is set to 1 (view is based only on sled position) when the sled is > 45m from the target
	//		any value between these two, the view is based on both object's positions
	//		weight is set by the S curve equation y=1/(1+2.7^(6-x/4)) (replace y=1 with y=10 for a clearer picture)

		//		set a max zoom of 12 pixels per meter and a minimum of 50 pixels per meter
		screenScale = Math.max(Math.min(screenWidth*0.85/dist , 50) , 12);//		scale screen so the space between the sleder and target/goal takes up 0.85 (85%) of the screen
		
		//		screen position is set by the weighted average of sled and trackPoint/goal positions
		screenx = apx*weight + trackPointx*(1-weight) - screenWidth/2/screenScale;
		screeny = apy*weight + trackPointy*(1-weight) + screenHeight/2/screenScale;
	}
}