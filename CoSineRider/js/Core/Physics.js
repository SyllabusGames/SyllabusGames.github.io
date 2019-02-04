//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
//		Goal points' position and radius
var goalx = 0;
var goaly = 0;
var goalr = 0;

//		Checkpoint variables
var checkx = [];
var checky = [];
var checkr = [];

var checkCurrent = -1;//		index of current starting checkpoint
//		view limits. [0]=left limit [1]=right limit. Both are in absolute coordinates
var checkScreenx = [];
var checkScreeny = [];

var groundPointsX;
var groundPointsY;

var allGroundPointsX = [];//new Array();
var allGroundPointsY = [];//new Array();
var allGroundBreaks = [];//new Array();

//		Conserved variables for physics simulation
var pxapx;//		sled position in global (absolute) space this physics step.
var pxapy;
// var pxRot;
var pxLastx = 0;//		sled position last physics step
var pxLasty = 0;
// var pxLastRot;
var pxt;//			current physics step time
var pxdt = 0.01666666666666;//		time between physics steps
var llineY = 0;
var rlineY = 0;


//		temporary variables for physics simulation
var pxLiney;
var pxDot;
var pxFrameTimeStore;
var pxSleddx;
// var rotPointx = 0;
// var rotPointy = 0;


var side = 1;
var segmentLength = 0;

var spx = 150;//		position in screen space. Used for drawing the sledder.
var spy = 50;//			spy has the opposite sign as apy since the screen coordinate system has 0,0 in the upper right corner
var vx = 0;//		sled velocity
var vy = 0;
var lastvx = 0;//	used for acceleration display
var lastvy = 0;
var maxAcceleration = 0;
var accelerationLimit = 500;
var ay = -30;//		vertical acceleration (30*0.15=4.5m/s^2)
var av = 0;//	angular velocity
var rotation = 0;//		sled current rotation in radians
var sledWidth = 0.6;
var rotPointx = 0;
var rotPointy = 0;
var apx = 150;//		position in global (absolute) space. This is used for physics and most calculations.
var apy = 50;//		sled position in global (absolute) space. This is used to store the location of the sled this frame.
var apz = 0;
var lastApz = 0;


var scaler;

/*		checking for collision with the .svg will
			take the sled's position
			use fpxLiney = Math.max( Math.min((apx+200)/20 , 19) , 0); to get the index of the relevant points
			use a for loop to parse all points in the arrays groundPointsX and ceilingPointsX to see if the sled is between them
			if it is, interpolate the find the Y value directly above/below the sled and use the sled's velocity to check if it is about to passed through the floor/ceiling
			each pass of the read in function will add more points to each array so it may look like this [(1) = point 1's position]
			   __--(6)------____
			(5)					(7)


	(0)-(1)--___   _______-------(3)--__	
				(2)						(4)

			As a result of this, every point in the relevant array must be checked (unless a line has been contacted and the sled moved)
				because being between (5) and (6) also places you between (1) and (2) or (2) and (3)
*/


//		Physics calculations are run every 1/60 of an in game second, no matter the game speed. This system ensures physics are framerate independent and completely consistent.
	//		-----------------------------------------------------------------------		[   UPDATE   ]		-----------------------------------------------------------------------
function runPhysics(){
	if(useNone || isCutscene)//		do not render or check for level collisions
		return;
	
	if(simulating){
		//		----------------------------------------------------		[   Loop through physics steps   ]		----------------------------------------------------
		while(frameTime > pxt){//		While game's visuals are in the future of the physics calculations, run the next physics step.
			//		The next physics step must be calculated. Record position from previous step as pxLast.
			pxLastx = pxapx;
			pxLasty = pxapy;
			
			//		record last frame's velocity averaged with the one before which was averaged with the one before that which...
			lastvx = (lastvx*3 + vx)/4;
			lastvy = (lastvy*3 + vy)/4;
			
			//		if this is a programming level, use the programming physics instead of normal calculations
			if(isProgramming){
				proPhysics();//		see inputProgramming.js
			}else{
				//		calculate next position using last step's velocities
				if(usePolar){
					pxapy += vy*pxdt*0.15;
					pxapx += vx*pxdt*0.15/pxapy;//		absolute position (in radians) divide by r (pxapy) so movement is faster closer to the origin
				}else{
					pxapx += vx*pxdt*0.15;//		absolute position (in meters)
					pxapy += vy*pxdt*0.15;
				}

				
				rotation = rotation%(Math.PI*2);//		keep rotation between 0 and 2pi

				tempZ = apz;//		set the Z coordinate used by equation() [tempZ] (see InputTyped.js) to the sled's Z coordinate 
				pxFrameTimeStore = frameTime;//		store frameTime for restoration later
				frameTime = pxt;//		set frameTime (used by equation()) to be the time for this physics step
				pxLiney = equation(pxapx);//		Y position of line under sled

				

				/*	The following is a diagram showing dx is the unitVector change in X position of the sled and
						dydt is the change in the line's y value from 2 physics steps ago.
					. is sledder position
					   \
						\.--dx--|				
						 \		|			
						  \		|				_________.___________Current Equation Line
			   Tangent=1m--\    dy		 _		 |
							\.  |		 /|		 | = dydt
							/\  |	   /		_|_ __ __ __ __ __ __Equation Line 2dt ago
						Sled  \ |	 /\		
							   \|  /   Normal Vector			
								\/			
								 \
				   Equation Line--\
				*/
				if(usePolar){
					//		polar coordinates use linear coordinates for most of the calculations, then just curve the result and loop at 0/2pi
					
					//		if pxapx goes outside the range of 0-2pi, it needs to be pulled back into that range, and while using a % operator
					//			would work, we also need to change pxLastx so the interpolation does not animate the sled going the wrong way arround
					//			the level to wrap from 0 to 2pi
					if(pxapx > _piTimes2){
						pxapx -= _piTimes2;
						pxLastx  -= _piTimes2;
					}else if(pxapx < 0){
						pxapx += _piTimes2;
						pxLastx  += _piTimes2;
					}
					//		----------------		[   Polar Physics   ]		----------------
					if(pxLiney > pxapy){//		Sled is below the line.
						pxapy = math.abs(pxLiney);//		avoid having a negative radius
						//		you fell into the origin, reset
						if(pxapy < 0.75){
							showMessage = true;//		see CoSineRider.html
							messageTime = 0;
							messageText = "FELL INTO GRAVITATIONAL SINGULARITY";
							resetSledder();
						}
						//		----------------		[   Get the tangent unit vector   ]		----------------
						dy = (equation((pxapx+_piTimes2+0.1/pxapy)%_piTimes2) - equation((pxapx-0.1/pxapy)%_piTimes2));
						scaler = 1/Math.sqrt(0.2/pxapy*0.2/pxapy + dy*dy);
						
						dy *= scaler;
						dx = 0.2/pxapy*scaler;
						
						pxDot = vx*dx + vy*dy;
						
						//		set velocity along line
						if((-dy*vx + -dx*-vy) < 0){
							vx = dx*pxDot;
							vy = dy*pxDot;
						}

						//		----------------		[   Line Movement   ]		----------------
						frameTime -= pxdt*2;
						
						dydt = pxLiney - equation(pxapx);
						if(dydt > 0.5){
							dydt = math.sign(dydt) * math.sqrt(dydt*2)/2;
						}
						dxdt = -dy * dydt;
						dydt = dx * dydt;
						
						if(dydt > 0){
							vy += dydt*0.5*60;
							vx += dxdt*0.5*60;
						}
						frameTime = pxt;
						
						// pxapy = equation(pxapx + vx*pxdt*0.15);
						av = 0;
					}
				}else{
					//		----------------		[   Linear Physics   ]		----------------
					//		All of this only runs if the sled is below (touching) the equation line. If it is above the line, it is in freefall.
					if(pxLiney > pxapy){//		Sled is below the line.
						//console.log(frameTime);//		used to calculate gravity
						pxapy = pxLiney;//		Jump to surface of equation line where the sled will be next frame so the sled is never below the line.
						
						//		if the sled is trying to jump up further than its velocity will allow, reverse direction
						// if(pxLiney - pxapy > math.abs(vx*0.15)){
							// vx = -vx;
						// }
						// console.log(vx*0.15);

						//		----------------		[   Get the tangent unit vector   ]		----------------
						dy = (equation(pxapx+0.1) - equation(pxapx-0.1));//		dy = vertical change in equation line from 0.05 meter to the left to 0.05m right. dx = 0.2
						scaler = 1/Math.sqrt(0.2*0.2 + dy*dy);//	↓
						/*	dx^2+dy^2=tangent^2 → sqrt(0.1^2+dy^2)=tangent
									[tangent must = 1 for this to be a unit vector]
									sqrt(0.1^2+dy^2)=1/scaler → scaler=1/sqrt(0.1^2+dy^2)
						*/
						
						dy *= scaler;//		multiply dy by scaler so [dx , dy] will be a unit vector tangent to the line below the sled
						dx = 0.2*scaler;//	dx = 0.1 (it's original value used to calculate dy and scaler) * scaler so [dx , dy] will be a unit vector
						
						pxDot = vx*dx + vy*dy;//		Dot Product of sled's velocity and the line's tangent.	(Amount of velocity in the direction of the equation line) Dot = a.x*b.x + a.y*b.y
						
						//		set velocity along line
						if((-dy*vx + -dx*-vy) < 0){//		if dot product of slope normal and velocity is negative, sled is trying to go through the line
							//		the new velocity is set to be the amount of original velocity that was in the direction tangent to the equation line
							vx = dx*pxDot;
							vy = dy*pxDot;
						}

						//		----------------		[   Line Movement   ]		----------------
						
						
						//		The biggest problem remaining in the physics engine is that when a square wave is used, the sled may jump to the top of the wave
						//		Square wave for testing y = round(x/10-t/8)%2*5
						//		Slanted Square wave cannon y = round(x/10-t/8)%2*16+x/4
						
						//		since the graph can only change along Y, the change in Y alone is used to calculate the displacement vector.
						frameTime -= pxdt*2;//		I am not sure why this calculation needs to jump back 2 timesteps, but it doesn't work otherwise
						
						dydt = pxLiney - equation(pxapx);//		change in equation line's y position at sled's current X position since 2 physics steps ago
						//		if the force is more than 1 (enough for sin(t*5)*10 to launch the sled to 100m) the player is probably using something stupid like a square wave so scale down dydt
						if(dydt > 0.5){
							dydt = math.sign(dydt) * math.sqrt(dydt*2)/2;
						}
						//		since the graph only actually moves along the Y axis, here, I assume it is moving in the direction of the line's normal vector
						//		dxdt and dydt are the x and y components of the velocity of the graph at [spx,spy]
						//		this will push the sled more left or right when the slope is steeper and more vertically when the slope is more level
						//		if vector = [x,y] normal vector = [-y,x]
						dxdt = -dy * dydt;
						dydt = dx * dydt;
						
						// console.log("dxdt=" + dxdt + " - dydt=" + dydt + " - vx=" + vx + " - vy=" + vy);
						
						//		sled is pushed by the line below it moving up
						if(dydt > 0){//		Curve is rising (the sled cannot be pulled by the ground, only pushed)
							vy += dydt*0.5*60;//		divide by 2 to compensate for multiplying the change in time by 2
							vx += dxdt*0.5*60;//		Not sure why I need to multiply by 60 here but it works
						}
						frameTime = pxt;//		restore the current physics step time
						
						// pxapy = equation(pxapx + vx*pxdt*0.15);//		Jump to surface of equation line where the sled will be next frame so the sled is never below the line.
						
						
						/*		read the line's Y offset over time as normal change, then get the X component of that.
								curveVx = (line change in Y over time*Normal.x/(normal.x^2+normal.y^2))
								normal.x = -dy.		normal.y = dx.
								(pxLiney - equation(spx/screenScale) is the graphs change on the Y axis which is how it is used in the curveVy equation, but in curveVx it is interpreted as the
								total displacment allong the line's normal. If it was actually interpreted as only the Y component and the X component was found using it, a square wave could
								accelerate the player to near infinte speeds while moving relativly slowly.
								While less accurate, this should be more stable.
						*/
						//		this should push the sled normal to the curve instead of just straight up
						av = 0;
					}//		----------------		[   End of Sled below line   ]		----------------
				}
			}
			//		----------------		[   Set Rotation   ]		----------------
			//		get the vector from the center to the end of the sled
			rotPointx = Math.cos(-rotation)*sledWidth;
			rotPointy = Math.sin(-rotation)*sledWidth;

			if((-equation(pxapx + rotPointx) < (-pxapy + rotPointy))		||		(-equation(pxapx - rotPointx) < (-pxapy - rotPointy))){//		one of the sled's ends is below the line
				av = -((equation(pxapx - rotPointx) - (pxapy + rotPointy)) - (equation(pxapx + rotPointx) - (pxapy - rotPointy)))*pxdt*20;
			}
			rotation += av;
			av = Math.max( Math.min( 0.992 * av , 0.4) , -0.4);//		dampen rotation as it flies above the track so the sled eventually stopps spinning. Also, limit the speed to 0.4 radians per frame
			
			
			if(usePolar){
				checkSvgCollidersPolar();
				//		----------------		[   Check Collision with Goals   ]		----------------
				theta = math.atan(goaly/goalx);
				if(goalx < 0){
					theta = Math.PI + theta;
				}else if(goaly < 0){
					theta = _piTimes2 + theta;
				}
				ftmp = math.sqrt(goalx*goalx + goaly*goaly);
				if( (Math.pow((pxapx-theta)*ftmp , 2) + Math.pow(pxapy-ftmp , 2)) < goalr*goalr ){
					levelCleared();
				}
			}else{
				checkSvgColliders();
				//		----------------		[   Check Collision with Goals   ]		----------------
				//		check for collision with the sledder. (sled.x-circle.x)^2 + (sled.y-circle.y)^2 < circle.radius^2
				if( (Math.pow(pxapx-goalx , 2) + Math.pow(pxapy-goaly , 2)) < goalr*goalr ){
					levelCleared();
				}
			}
			
			//		----------------		[   Check Collision with Checkpoints   ]		----------------
			if(useCheckpoints){
				for(i = checkx.length-1 ; i > -1 ; i--){
					//		not currently used checkpoint and sled is touching the checkpoint
					if(i != checkCurrent && (Math.pow(pxapx-checkx[i] , 2) + Math.pow(pxapy-checky[i] , 2)) < checkr[i]*checkr[i] ){
						//		set sled to start at the current checkpoint
						defaultSledx = checkx[i];
						defaultSledy = checky[i];
						//		don't collider with the checkpoint you start in
						checkCurrent = i;
						//		update screen pan/zoom limits to new checkpoints
						if(useScreenLimit)
							updateScreenLockPoints();
						
						//		go back to equation edit mode
						resetSledder();
						
						showMessage = true;//		see CoSineRider.html
						messageTime = 0;
						messageText = "CHECKPOINT!";
					}
				}
			}
			
			//		apply gravity
			vy += ay*pxdt;
			frameTime = pxFrameTimeStore;//		restore correct frame time
			pxt += pxdt;//		increment physics time one timestep
		}//		----------------------------------------------------		[   End while loop   ]		----------------------------------------------------
		//	current game time is now between the times when the sled was/will be at positions pxLastx and pxapx.
		

		
		//		interpolate the past and future sled positions to get the position for this frame
		apx = pxLastx + (pxapx - pxLastx) * (frameTime - (pxt - pxdt))/pxdt;//		(pxt - pxdt) is the time when pxLastx was the sled's position
		apy = pxLasty + (pxapy - pxLasty) * (frameTime - (pxt - pxdt))/pxdt;
		
		
	//	console.log((apx*1000)/1000 + "Time taken = " + tttt + "ms for " + count + " Game time = " + frameTime);
	//	console.log(pxapx + " - " + pxLastx + " - " + frameTime + " - " + (pxt-pxdt) + " - " + pxt + " - " + apx);
		if(usePolar){
			spx = (apy*math.cos(apx) - screenx)*screenScale;//		screen position (in pixels)
			spy = (apy*math.sin(-apx) + screeny)*screenScale;//		y is flipped since the top of the screen is 0
			// console.log(spx + " - " + spy);
			
			//		----------------------------------------------------		[   Draw Sledder   ]		----------------------------------------------------
			ctx.translate( spx, spy );
			ctx.rotate( -rotation - apx + 0.4 );//		rotation in radians

			ctx.drawImage( sledderSvg, -screenScale , -screenScale ,  2*screenScale , 2*screenScale);

			ctx.rotate( rotation + apx - 0.4 );
			ctx.translate( -spx, -spy );
		}else{
			spx = (apx - screenx)*screenScale;//		screen position (in pixels)
			spy = (-apy + screeny)*screenScale;//		y is flipped since the top of the screen is 0
			
			
			//		----------------------------------------------------		[   Draw Sledder   ]		----------------------------------------------------
			ctx.translate( spx, spy );
			ctx.rotate( -rotation );//		rotation in radians

			ctx.drawImage( sledderSvg, -screenScale , -screenScale ,  2*screenScale , 2*screenScale);

			ctx.rotate( rotation );
			ctx.translate( -spx, -spy );
		}
		
	}else{
		//		set sledder screen position so the camera will move correctly before the level starts
		if(usePolar){
			spx = (apy*math.cos(apx) - screenx)*screenScale;//		screen position (in pixels)
			spy = (apy*math.sin(-apx) + screeny)*screenScale;//		y is flipped since the top of the screen is 0
		}else{
			spx = (apx)*screenScale - screenx*screenScale;
			spy = -(apy)*screenScale + screeny*screenScale;
		}
		//		draw sledder without rotation
		ctx.drawImage( sledderSvg, spx-screenScale , spy-screenScale ,  2*screenScale , 2*screenScale);
	}
}
//		-----------------------------------------------------------------------		[   /UPDATE/   ]		-----------------------------------------------------------------------


function checkSvgColliders(){
	if(useNone || isCutscene)//		do not check for level collisions in levels with no svg colliders
		return;
	//		-----------------------------------------------------------------------		[   Collision with SVG   ]		-----------------------------------------------------------------------
	for(i = allGroundPointsX.length - 1 ; i > 0 ; i--){//		read all x points in .svg
		if(allGroundBreaks[i-1]){//		if the next point is not part of a different line (allGroundBreaks marks where the next point is a jump to the next line and so, does not represent a line itself)
			if(Math.sign(allGroundPointsX[i] - pxapx) != Math.sign(allGroundPointsX[i-1] - pxapx)){//		sled is between this point and the next
				dx = allGroundPointsX[i-1] - allGroundPointsX[i];//		change in x from one path point to the next
				dy = allGroundPointsY[i-1] - allGroundPointsY[i];

	//		-----------------------------------------------------------------------		[   Move Sled   ]		-----------------------------------------------------------------------
				pxSleddx = pxapx - allGroundPointsX[i];//		change in x from one path point to the sled
				rtmp = pxSleddx/dx;//		fraction of line from [i] to [i-1] that is from [i] to sled position
				pxLiney = -dy*rtmp - allGroundPointsY[i];//		pxLiney = y position on line at sled X coordinate
	//			console.log((apy+0.1).toString() +" pxLiney="+ pxLiney +" next apy="+ (apy+vy*dt*0.15).toString() + " dt=" + dt);
	
	
				if(Math.abs(pxLiney - pxapy) < 5){//		Sled is less than 1 meter from this line, run collision and rotation calculations. (this stops lines above and below the line the sled is on from effecting its rotation)
					//		circle the two verticies collided with
			/*		drawPoint(allGroundPointsX[i-1] , -allGroundPointsY[i-1] , "#AA0000");
					drawPoint(apx , pxLiney , "#FF0000");
					drawPoint(allGroundPointsX[i] , -allGroundPointsY[i] , "#0000FF");
*/
					//		get which side of the line the sled was on last frame
					//		the following line, vy*dt is multiplied by 0.15 because that is done in Sledder.js and it just works. The 1.2 is to give a margin for error/inconsistant dt values.
					if(Math.sign(allGroundPointsX[i] - pxLastx) != Math.sign(allGroundPointsX[i-1] - pxLastx)){//		sled was on this line last frame (Sled x is between i and i-1)
						//		side = change in sledY from last frame relative to the collision line. (posative number means the sled was above this line last frame. negative = below)
						side = (pxLasty - (-dy*(pxLastx - allGroundPointsX[i])/dx - allGroundPointsY[i]));
					}else{
						//		[i-1] is closer to the sled than [i]
						if(dx * (pxLastx - allGroundPointsX[i-1]) >= 0){//		[i-1] is right of [i] and sled is right of [i-1] (0*0) OR [i-1] is left of [i] and sled is left of [i-1].
							if(i > 1){//		if i = 1 or 0, the following will try to read from allGroundPointsX[i-1]
								side = (pxLasty - ((allGroundPointsY[i-1] - allGroundPointsY[i-2])*(pxLastx - allGroundPointsX[i-1])/(allGroundPointsX[i-2] - allGroundPointsX[i-1]) - allGroundPointsY[i-1]));
							}else{//		end of line. Expect strange behaviour
								continue;
							}
						}else{//		[i] is closer to the sled than [i-1]
							if(i < allGroundPointsY.length-1){//		don't read ground points that don't exist
								side = (pxLasty - ((allGroundPointsY[i+1] - allGroundPointsY[i])*(pxLastx - allGroundPointsX[i+1])/(allGroundPointsX[i] - allGroundPointsX[i+1]) - allGroundPointsY[i+1]));
							}else{//		end of line. Expect strange behaviour
								continue;
							}
						}
					}
					
					rotPointx = Math.cos(-rotation)*sledWidth;//		get x and y position of one end of the sled
					rotPointy = Math.sin(-rotation)*sledWidth;
					segmentLength = Math.sqrt(dx*dx+dy*dy);//		vector dx,dy magnitude
					/*
					//		SLED ROTATION USING BOTH ENDS OF THE SLED
					ltmp = 0;
					rtmp = 0;
			//		-----------------------------------------------------------------------		[   Rotate Sled   ]		-----------------------------------------------------------------------
					//						left end of sled		(Not the same side)		left line end
					if(Math.sign(allGroundPointsX[i] - apx - rotPointx) != Math.sign(allGroundPointsX[i-1])){//		sled in between allGroundPointsX[i] and [i-1]
					//	rtmp = change in Y between sled's right end y position and collision line at sled's right end's x position
						llineY = -allGroundPointsY[i-1] - (dx-pxSleddx-rotPointx)*dy/segmentLength;//	Y position on line directly below/above the right end of the sled
//							console.log(llineY + "  -  " + pxSleddx  + "  -  " + dx + "  -  " + dy + "  -  " + (dx-pxSleddx-rotPointx)/Math.sqrt(dx*dx+dy*dy));
						rtmp = -(dx - pxSleddx - rotPointx)/dx*dy - rotPointy;//apy + rotPointy - (-dy*(apx + rotPointx - allGroundPointsX[i])/dx - allGroundPointsY[i]);
						stmp = "#FF0000";
					}else{
						llineY = 50;
						//		[i-1] is closer to the sled than [i]
						if(dx * (apx + rotPointx - allGroundPointsX[i-1]) >= 0){//		[i-1] is right of [i] and sled is right of [i-1] (0*0) OR [i-1] is left of [i] and sled is left of [i-1].
							if(i > 1){//		if i = 1 or 0, the following will try to read from allGroundPointsX[-1]
								//rtmp = (dx - pxSleddx - rotPointx)*dy / segmentLength - rotPointy;
								rtmp = -((allGroundPointsX[i-2] - allGroundPointsX[i-1]) - (apx - allGroundPointsX[i-1]) - rotPointx) / //		(dx - pxSleddx - rotPointx)
										(allGroundPointsX[i-2] - allGroundPointsX[i-1]) * (allGroundPointsY[i-2] - allGroundPointsY[i-1])	//	/dx*dy
										- rotPointy;//	/segmentLength - rotPointy
								//rtmp = (apy + rotPointy - ((allGroundPointsY[i-1] - allGroundPointsY[i-2])*(apx + rotPointx - allGroundPointsX[i-1])/(allGroundPointsX[i-2] - allGroundPointsX[i-1]) - allGroundPointsY[i-1]));
							}else{//		last segment of line. Expect strange behaviour
								continue;
							}
							stmp = "#00FF00";
						}else{//		[i] is closer to the sled than [i-1]
							if(i < allGroundPointsY.length-1){//		don't read ground points that don't exist
								rtmp = -((allGroundPointsX[i] - allGroundPointsX[i+1]) - (apx - allGroundPointsX[i+1]) - rotPointx) / 
										(allGroundPointsX[i] - allGroundPointsX[i+1]) * (allGroundPointsY[i] - allGroundPointsY[i+1])
										- rotPointy;
							//	rtmp = (apy + rotPointy - ((allGroundPointsY[i+1] - allGroundPointsY[i])*(apx + rotPointx - allGroundPointsX[i+1])/(allGroundPointsX[i] - allGroundPointsX[i+1]) - allGroundPointsY[i+1]));
							}else{//		last segment of line. Expect strange behaviour
								continue;
							}
							stmp = "#0000FF";
						}
					}
					//		right end of sled is the same as left but using +rotPointx
					if(Math.sign(allGroundPointsX[i] - apx + rotPointx) != Math.sign(allGroundPointsX[i-1])){
						ltmp = -(dx - pxSleddx + rotPointx)/dx*dy + rotPointy;//(apy - rotPointy - (-dy*(apx - rotPointx - allGroundPointsX[i])/dx - allGroundPointsY[i]));
					}else{
						if(dx * (apx - rotPointx - allGroundPointsX[i-1]) >= 0){
							if(i > 1){
								ltmp = -((allGroundPointsX[i-2] - allGroundPointsX[i-1]) - (apx - allGroundPointsX[i-1]) + rotPointx) / 
										(allGroundPointsX[i-2] - allGroundPointsX[i-1]) * (allGroundPointsY[i-2] - allGroundPointsY[i-1])
										+ rotPointy;
							//	ltmp = (apy - rotPointy - ((allGroundPointsY[i-1] - allGroundPointsY[i-2])*(apx - rotPointx - allGroundPointsX[i-1])/(allGroundPointsX[i-2] - allGroundPointsX[i-1]) - allGroundPointsY[i-1]));
							}else{
								continue;
							}
						}else{
							if(i < allGroundPointsY.length-1){
								Ltmp = -((allGroundPointsX[i] - allGroundPointsX[i+1]) - (apx - allGroundPointsX[i+1]) + rotPointx) / 
										(allGroundPointsX[i] - allGroundPointsX[i+1]) * (allGroundPointsY[i] - allGroundPointsY[i+1])
										+ rotPointy;
							//	ltmp = (apy - rotPointy - ((allGroundPointsY[i+1] - allGroundPointsY[i])*(apx - rotPointx - allGroundPointsX[i+1])/(allGroundPointsX[i] - allGroundPointsX[i+1]) - allGroundPointsY[i+1]));
							}else{
								continue;
							}
						}
					}
					*/

					//		SLED ROTATION USING USING ONLY THE CENTER POINT OF THE SLED
					rtmp = -(dx - pxSleddx - rotPointx)/dx*dy - rotPointy;
					ltmp = -(dx - pxSleddx + rotPointx)/dx*dy + rotPointy;

	//			OVERHANG Z SHAPED LINES ARE STILL NOT WORKING RIGHT
	//			when passing between lines, check both?



					//	console.log(dydt + " _ " +  (apy - pxLiney));
					if((side * (pxapy - pxLiney)) < 0){//	Sled is not on the same side of this line as it was last frame
			//		if((apy < pxLiney && (pxLiney - apy) < 1) && (apy+vy*dt*1.2*0.15 < pxLiney)){//	Sled is under line by less than a meter OR next frame, the sled will be below line


						//		make [dx , dy] the unit vector of this segment's slope
						dx /= segmentLength;
						dy /= segmentLength;
						
						pxDot = vx*dx - vy*dy;//		Dot Product of velocity and slope's tangent.		(Ammount of velocity along the graph)
						vx =  pxDot * dx;//		new velocity along x set by amount of original velocity that was in the direction tangent to the equation line
						vy = -pxDot * dy;

						pxapy = pxLiney + Math.sign(side)*0.0005;//		snap sled to just above/below line
						if(pxapy + 0.5 < equation(apx)){
							showMessage = true;//		see CoSineRider.html
							messageTime = 0;
							messageText = "CRUSHED AGAINST CEILING";
							resetSledder();
						}
						//		rotate sled
//	av = -((leftEnd.y - (apy + rotPointy)) - rightEnd.y - (apy - rotPointy)))*dt*20;
//	av = -((equation(apx - rotPointx) - (apy + rotPointy)) - (equation(apx + rotPointx) - (apy - rotPointy)))*dt*20;
//			line.y - sled end.y - (line.y - sled end.y)
						/*drawPoint(apx-rotPointx , apy+rtmp , stmp);//		left
						drawPoint(apx+rotPointx , apy+ltmp , "#0000FF");

						drawPoint(apx+rotPointx , llineY , "#444444");
						
						console.log(ltmp + "  -  " + rtmp);
						*/
						av = (ltmp - rtmp)*pxdt*10;//		this should not be in this if statment but putting it elsewhare it will run too often.
					}
				}
			}
		}
	}
}


function checkSvgCollidersPolar(){
	if(useNone || isCutscene)//		do not check for level collisions in levels with no svg colliders
		return;
	//		-----------------------------------------------------------------------		[   Collision with SVG   ]		-----------------------------------------------------------------------
	for(i = allGroundPointsX.length - 1 ; i > 0 ; i--){//		read all x points in .svg
		if(allGroundBreaks[i-1]){//		if the next point is not part of a different line (allGroundBreaks marks where the next point is a jump to the next line and so, does not represent a line itself)
			if(Math.sign(allGroundPointsX[i] - pxapx) != Math.sign(allGroundPointsX[i-1] - pxapx)){//		sled is between this point and the next		
				dx = allGroundPointsX[i-1] - allGroundPointsX[i];//		change in x from one path point to the next
				dy = allGroundPointsY[i-1] - allGroundPointsY[i];

	//		-----------------------------------------------------------------------		[   Move Sled   ]		-----------------------------------------------------------------------
				pxSleddx = pxapx - allGroundPointsX[i];//		change in x from one path point to the sled
				rtmp = pxSleddx/dx;//		fraction of line from [i] to [i-1] that is from [i] to sled position
				pxLiney = -dy*rtmp - allGroundPointsY[i];//		pxLiney = y position on line at sled X coordinate
	
				console.log(pxLiney + " - " +  pxSleddx + " - " +  rtmp + " - " + dx  + " - " +  dy);
				if(Math.abs(pxLiney - pxapy) < 5){//		Sled is less than 1 meter from this line, run collision and rotation calculations. (this stops lines above and below the line the sled is on from effecting its rotation)
								console.log("between " + i + "and" + (i-1));
	
					//		get which side of the line the sled was on last frame
					//		the following line, vy*dt is multiplied by 0.15 because that is done in Sledder.js and it just works. The 1.2 is to give a margin for error/inconsistant dt values.
					if(Math.sign(allGroundPointsX[i] - pxLastx) != Math.sign(allGroundPointsX[i-1] - pxLastx)){//		sled was on this line last frame (Sled x is between i and i-1)
						//		side = change in sledY from last frame relative to the collision line. (posative number means the sled was above this line last frame. negative = below)
						side = (pxLasty - (-dy*(pxLastx - allGroundPointsX[i])/dx - allGroundPointsY[i]));
					}else{
						//		[i-1] is closer to the sled than [i]
						if(dx * (pxLastx - allGroundPointsX[i-1]) >= 0){//		[i-1] is right of [i] and sled is right of [i-1] (0*0) OR [i-1] is left of [i] and sled is left of [i-1].
							if(i > 1){//		if i = 1 or 0, the following will try to read from allGroundPointsX[i-1]
								side = (pxLasty - ((allGroundPointsY[i-1] - allGroundPointsY[i-2])*(pxLastx - allGroundPointsX[i-1])/(allGroundPointsX[i-2] - allGroundPointsX[i-1]) - allGroundPointsY[i-1]));
							}else{//		end of line. Expect strange behaviour
								continue;
							}
						}else{//		[i] is closer to the sled than [i-1]
							if(i < allGroundPointsY.length-1){//		don't read ground points that don't exist
								side = (pxLasty - ((allGroundPointsY[i+1] - allGroundPointsY[i])*(pxLastx - allGroundPointsX[i+1])/(allGroundPointsX[i] - allGroundPointsX[i+1]) - allGroundPointsY[i+1]));
							}else{//		end of line. Expect strange behaviour
								continue;
							}
						}
					}
					
					rotPointx = Math.cos(-rotation)*sledWidth;//		get x and y position of one end of the sled
					rotPointy = Math.sin(-rotation)*sledWidth;
					segmentLength = Math.sqrt(dx*dx+dy*dy);//		vector dx,dy magnitude

					rtmp = -(dx - pxSleddx - rotPointx)/dx*dy - rotPointy;
					ltmp = -(dx - pxSleddx + rotPointx)/dx*dy + rotPointy;

					if((side * (pxapy - pxLiney)) < 0){//	Sled is not on the same side of this line as it was last frame

						//		make [dx , dy] the unit vector of this segment's slope
						dx /= segmentLength;
						dy /= segmentLength;
						
						pxDot = vx*dx - vy*dy;//		Dot Product of velocity and slope's tangent.		(Ammount of velocity along the graph)
						vx =  pxDot * dx;//		new velocity along x set by amount of original velocity that was in the direction tangent to the equation line
						vy = -pxDot * dy;

						pxapy = pxLiney + Math.sign(side)*0.0005;//		snap sled to just above/below line
						if(pxapy + 0.5 < equation(apx)){
							showMessage = true;//		see CoSineRider.html
							messageTime = 0;
							messageText = "CRUSHED AGAINST CEILING";
							resetSledder();
						}
						av = (ltmp - rtmp)*pxdt*10;//		this should not be in this if statment but putting it elsewhare it will run too often.
					}
				}
			}
		}
	}
}