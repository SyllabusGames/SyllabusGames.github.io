//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
//		set sledder rotation by this:	http://jsfiddle.net/johndavies91/xwMYY/		if possible
var defaultPosX = 0;
var defaultPosY = 0;

//		sled transform
var av = 0;//	angular velocity
var rotation = 0;
var rotPointx = 0;
var rotPointy = 0;
var apx = 150;//		position in global (absolute) space. This is used for physics and most calculations.
var apy = 50;
var apz = 0;
var lastApz = 0;
var tempZ = 0;
var tempX = 0;
var spx = 150;//		position in screen space. Used for drawing the sledder.
var spy = 50;//			spy has the opposite sign as apy since the screen coordinate system has 0,0 in the upper right corner
var vx = 0;
var vy = 0;
var ay = -30;
		
//		called once when the gamescreen is loaded
function setUpSledder(){
	//		set up sledder
	sledderSvg = new Image;
	sledderSvg.src = "SineRiderSledOptimized.svg";
	apx = defaultPosX;
	apy = defaultPosY;
}

//		called every time you win, lose, or reset
function resetSledder(){
	console.log(equRaw);
	checkInputFields("all");//		update line. (useful if the player types something while the simulation is running)
	dropTime = 0;//		delete
	simulating = !simulating;
	apx = defaultPosX;
	apy = defaultPosY;
	sledLastX = apx;//		reset positions for SVG collisions
	sledLastY = apy;
	spx = apx*screenScale;
	spy = -apy*screenScale;//		negative because the Y axis is measured from the top by the canvas
	av = 0;
	vx = 0;
	vy = 0;
	rotation = 0;
	if(camLocked){
		screenFollowSledder();//		reset screen position
		dragScreenScale = screenScale;
	}
	rotPointx = Math.cos(-rotation)*0.6;
	rotPointy = Math.sin(-rotation)*0.6;

	//		rotate sled to start lined up with the line
	if((-equation(apx + rotPointx) < (-apy + rotPointy))		||		(-equation(apx - rotPointx) < (-apy - rotPointy))){//		one of the sled's ends is below the line
		for(i = 0 ; i < 6 ; i++){
			rotPointx = Math.cos(-rotation)*0.6;
			rotPointy = Math.sin(-rotation)*0.6;
			rotation += -((equation(apx - rotPointx) - (apy + rotPointy)) - (equation(apx + rotPointx) - (apy - rotPointy)))*0.4;
		}
	}
}

	//		-----------------------------------------------------------------------		[   UPDATE   ]		-----------------------------------------------------------------------
function moveSledder(){
	
	if(useNone)//		do not render or check for level collisions
		return;
	
	if(simulating){
		apx += vx*dt*0.15;//		absolute position (in meters)
		apy += vy*dt*0.15;

		spx = apx*screenScale - screenx*screenScale;//		screen position (in pixels)
		spy = -apy*screenScale + screeny*screenScale;//		y is flipped since the top of the screen is 0

		drawSledder();
		//		apply gravity
		vy += ay*dt;
	}else{
		//		set sledder screen position so the camera will move correctly before the level starts
		spx = (apx)*screenScale - screenx*screenScale;
		spy = -(apy)*screenScale + screeny*screenScale;
		//		draw sledder
		ctx.drawImage( sledderSvg, spx-screenScale , spy-screenScale ,  2*screenScale , 2*screenScale);
	}

	//		----------------------------------------------------		[   Move/Scale Screen   ]		----------------------------------------------------
	if(simulating && camLocked){
		screenFollowSledder();
	}
}
//		-----------------------------------------------------------------------		[   /UPDATE/   ]		-----------------------------------------------------------------------


//		----------------------------------------------------		[   Move/Scale Screen   ]		----------------------------------------------------
function screenFollowSledder(){
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

function drawSledder(){
	rotation = rotation%(Math.PI*2);

	tempZ = apz;
	ftmp = equation(apx);//		Y position of line under sled

	//		----------------------------------------------------		[   Draw Sledder   ]		----------------------------------------------------
	ctx.translate( spx, spy );
	ctx.rotate( -rotation );//		rotation in radians

	ctx.drawImage( sledderSvg, -screenScale , -screenScale ,  2*screenScale , 2*screenScale);

	ctx.rotate( rotation );
	ctx.translate( -spx, -spy );

	/*	. is sledder position
			\.--dx--|				
			 \		|			
			  \		|			_________.___________Current Equation Line
	Length=1m--\    dy			 |
			    \   |			 | = dydt
				 \  |			_|_ __ __ __ __ __ __Equation Line 2dt ago
				  \ |			
				   \|			
				    \			
	*/

	//		----------------------------------------------------		[   Set Position   ]		----------------------------------------------------
	if(ftmp > apy){//		touching line
		apy = ftmp;//		snap to surface of graph so you do not pass through it.
		tempZ = apz;//		set the Z coordiante to the sled's Z coordiante

		//		get the tangent unit vector
		dy = (equation(apx+0.1) - ftmp);//		get vertical displacment 0.1 meter to the right. dx = 1.
		dx = 1/Math.sqrt(0.01 + dy*dy);//		divide dx by the length of the tangent line formed by [0.1 , dy]
		dy *= dx;//		multiply dy by dx so [dx , dy] will be 1 meter long after the next opperation (unit tangent vector)
		dx *= 0.1;//	dx was a multiplier for dy, now turn it back into dx (the x component of the tangent unit vector)
		dtmp = vx*dx + vy*dy;//		Dot Product of velocity and slope's tangent.		(Ammount of velocity along the graph) Dot = a.x*b.x + a.y*b.y
		
		if((-dy*vx + -dx*-vy) < 0){//		if dot product of slope normal and velocity is negative, sled is trying to go through the line
			vx = dx*dtmp;//		new velocity along x set by amount of original velocity that was in the direction tangent to the equation line
			vy = dy*dtmp;
		}

	//		----------------------------------------------------		[   Set Velocity by line movement   ]		----------------------------------------------------
		//		since the graph can only change allong Y so the change in Y is used as the full displacment vector.
		frameTime -= dt*2;//		I am not sure why the *2 is nessisary but it just is
	//	dtmp = apz;
	//	apz = lastApz;//		use last frame's z value so if it changed, that will be incorporated into the sled's movement
		
		dxdt = ftmp - equation(apx);//		change in curve's y position under sled since 2 frames ago
		
		//		tmspx and tmspy are the x and y components of the velocity of the graph at [spx,spy]
		//		this will push the sled more left or right when the slope is steeper and more vertically when the slope is more level
		tmspx = dy * dxdt;
		tmspy = dx * dxdt;

		if(tmspy > 0){//		Curve is rising (the sled cannot be pulled by the ground, only pushed)
			vy += tmspy*0.5/dt;//		divide by 2 to compensate for multiplying the change in time by 2
			vx -= tmspx*0.5/dt;
		}
		frameTime += dt*2;
	//	apz = dtmp;//		restore the sled's z position

		/*		read the line's Y offset over time as normal change, then get the X component of that.
				curveVx = (line change in Y over time*Normal.x/(normal.x^2+normal.y^2))
				normal.x = -dy.		normal.y = dx.
				(ftmp - equation(spx/screenScale) is the graphs change on the Y axis which is how it is used in the curveVy equation, but in curveVx it is interpreted as the
				total displacment allong the line's normal. If it was actually interpreted as only the Y component and the X component was found using it, a square wave could
				accelerate the player to near infinte speeds while moving relativly slowly.
				While less accurate, this should be more stable.
		*/
		//		this should push the sled normal to the curve instead of just straight up
		av = 0;
	}
	
	//		----------------------------------------------------		[   Set Rotation   ]		----------------------------------------------------
	//		get the vector from the center to the end of the sled
	rotPointx = Math.cos(-rotation)*0.6;
	rotPointy = Math.sin(-rotation)*0.6;

	if((-equation(apx + rotPointx) < (-apy + rotPointy))		||		(-equation(apx - rotPointx) < (-apy - rotPointy))){//		one of the sled's ends is below the line
		av = -((equation(apx - rotPointx) - (apy + rotPointy)) - (equation(apx + rotPointx) - (apy - rotPointy)))*dt*20;
	}
	rotation += av;
	av = Math.max( Math.min( 0.992 * av , 0.4) , -0.4);//		dampen rotation as it flies above the track so the sled eventually stopps spinning. Also, limit the speed to 0.4 radians per frame
}