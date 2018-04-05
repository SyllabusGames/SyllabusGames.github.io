//		set sledder rotation by this:	http://jsfiddle.net/johndavies91/xwMYY/		if possible
var defaultPosX = 0;
var defaultPosY = 0;

//		sled transform
var av = 0;//	angular velocity
var rotation = 0;
var boxx = 0;
var boxy = 0;
var apx = 150;//		position in global (absolute) space. This is used for physics and most calculations.
var apy = 50;
var apz = 0;
var tempZ = 0;
var spx = 150;//		position in screen space. Used for drawing the sledder.
var spy = 50;//			spy has the opposite sign as apy since the screen coordinate system has 0,0 in the upper right corner
var vx = 0;
var vy = 100;
var ay = -30;
		
//		called once when the gamescreen is loaded
function setUpSledder(){
	//		set up sledder
	img = new Image;
	img.src = "SineRiderSled.svg";
	apx = defaultPosX;
	apy = defaultPosY;
}

//		called every time you win, lose, or reset
function resetSledder(){
	dropTime = 0;//		delete
	simulating = !simulating;
	apx = defaultPosX;
	apy = defaultPosY;
	spx = apx*screenScale;
	spy = -apy*screenScale;//		negative because the Y axis is measured from the top by the canvas
	av = 0;
	vx = 0;
	vy = 0;
	rotation = 0;
	//		reset screen too. This should probably be moved somewhere else.
}

	//		-----------------------------------------------------------------------		[   UPDATE   ]		-----------------------------------------------------------------------
function moveSledder(){
	if(simulating){
		//		sledder kinematics
		//		while velocity and acceleration are calculated as raw math, when converting to world space, changes in position must be divided by screenScale
	//	ctx.fillText("Vy = " + Math.round(vy*10).toString(),10,150);
	//	ctx.fillText("Vx = " + Math.round(vx*10).toString(),10,50);
		
		apx += vx*dt*0.15;
		apy += vy*dt*0.15;

		spx = (apx)*screenScale - screenx*screenScale;
		spy = -(apy)*screenScale + screeny*screenScale;
		//		test curvV with y=-x*2+(x/10-5)^2+sin(x/5+t)*15+10-x-5
		//						y=sin(x/3+t*2)*3-x/2
		//						y=sin(t*4)*3-x/2
		vy += ay*dt;
		//		friction
		//vx *= 0.9999;
		//vy *= 0.9999;
		drawSledder();
	}else{
		//		set sledder screen position so the camera will move correctly before the level starts
		spx = (apx)*screenScale - screenx*screenScale;
		spy = -(apy)*screenScale + screeny*screenScale;
		//		draw sledder at default position and not moving
		ctx.translate( spx, spy );
		//		aspect ratio is 0.8
		ctx.drawImage( img, -0.875*screenScale , -1.8125*screenScale , 1.75*screenScale , 2.5*screenScale);//		position here is is local space and therefore is only usefuly to center the image on the sled
		ctx.translate( -spx, -spy );
	}

	//		----------------------------------------------------		[   Move Screen   ]		----------------------------------------------------
	ftmp = Math.sqrt((apx-trackPointx)*(apx-trackPointx) + (apy-trackPointy)*(apy-trackPointy));
	if(ftmp > 140){//		keep the sledder on screen
		if(screenx < apx - 1400/screenScale){//		< 200 pixels from right edge of screen
			screenx = apx - 1400/screenScale;
		}else if(screenx > apx - 200/screenScale){//	< 200 pixels from left edge of screen
			screenx = apx - 200/screenScale;
		}

		if(screeny < apy + 200/screenScale){//	< 200 pixels from top edge of screen
			screeny = apy + 200/screenScale;
		}else if(screeny > apy + 600/screenScale){//		< 200 pixels from bottom edge of screen
			screeny = apy + 600/screenScale;
		}
	}else{//		keep sledder and trackPoint on screen.
		screenx = (apx + trackPointx)/2 - 800/screenScale;
		screeny = (apy + trackPointy)/2 + 400/screenScale;
	//	ftmp = Math.abs(apx-trackPointx);
	//	if(Math.abs(apy-trackPointy) > ftmp)
	//		ftmp = Math.abs(apy-trackPointy);
		screenScale = 700/Math.max(ftmp , 14);//		set a max scale of 50. A minimum scale of 5 was set above by using < 140
	}
}
//		-----------------------------------------------------------------------		[   /UPDATE/   ]		-----------------------------------------------------------------------


function drawSledder(){
	rotation = rotation%(Math.PI*2);
	boxy = Math.sin(-rotation)*40;
	boxx = Math.cos(-rotation)*40;

	tempZ = apz;
	ftmp = equation(apx);//		Y position of line under sled

	//		----------------------------------------------------		[   Draw Sledder   ]		----------------------------------------------------
	ctx.translate( spx, spy );
	ctx.rotate( -rotation );//		rotation in radians
	//		aspect ratio is 0.8
	ctx.drawImage( img, -0.875*screenScale , -1.8125*screenScale , 1.75*screenScale , 2.5*screenScale);//		position here is is local space and therefore is only usefuly to center the image on the sled

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

		//		velocity is set by the derrivative of the graph at the contact point
		//vy = (equation((spx+1)/screenScale) - ftmp)/screenScale*40000*dt;
		//		get the tangent unit vector
		dy = (equation(apx+0.1) - ftmp);//		get vertical displacment 0.1 meter to the right. dx = 1.
		dx = 1/Math.sqrt(0.01 + dy*dy);//		divide dx by the length of the tangent line formed by [0.1 , dy]
		dy *= dx;//		multiply dy by dx so [dx , dy] will be 1 meter long after the next opperation (unit tangent vector)
		dx *= 0.1;//	dx was a multiplier for dy, now turn it back into dx (the x component of the tangent unit vector)
		fftemp = vx*dx + vy*dy;//		Dot Product of velocity and slope's tangent.		(Ammount of velocity along the graph)
			
		vx = dx*fftemp;//		new velocity along x set by amount of original velocity that was in the direction tangent to the equation line
		vy = dy*fftemp;


	//		----------------------------------------------------		[   Set Velocity by line movement   ]		----------------------------------------------------
		//		since the graph can only change allong Y so the change in Y is used as the full displacment vector.
		frameTime -= dt*2;//		I am not sure why the *2 is nessisary but it just is

		//		test (rotation)				-((x-22)*t*0.3-2)/5-5
		//		test (slightly slopped trampoline)	 -x/100+sin(t*1.5+1.5)*7
		//		test (neat)			-x/3-5+sin(-t+x/2)*2+((1+sin(t))*x/10-2)^2+sin(t)*4
		
		ltmp = equation(apx-1);//		y pos 1 frame ago 1 meter to the left of the sledder's current location
		rtmp = equation(apx+1);//		y pos 1 frame ago 1 meter to the right
		//	is ltmp closer to the current y position than rtmp (is the graph moving !left or !right)
		//		the difference between ftmp and ltmp/rtmp shows which direction and by how much the sled's current Y position has moved since the last frame
		if(Math.abs(ftmp - rtmp) > Math.abs(ftmp - ltmp)){//		ltmp is closer so the line is moving right so i will use ltmp to estimate the change in x (dxdt) this frame
			dxdt = (ftmp - ltmp);
		}else{//		the graph is moving left so i will use rtmp to estimate the change in x (dxdt) this frame
			dxdt = (ftmp - rtmp);
		}

		//		(y pos) - (y pos 1 frame ago)
		dydt = (ftmp - equation(apx));//		dydx is just the y component of the velocity vector.
		
		//		tmspx and tmspy are the x and y components of the velocity of the graph at [spx,spy]
		//		this will push the sled more left or right when the slope is steeper and more vertically when the slope is more level
		tmspx = dy * dxdt;
		tmspy = dx * dydt;

		if(tmspy < 0){//		The sled cannot be pulled by the ground, only pushed.
			vy += tmspy*0.5;//		devide by 2 to compensate for multiplying the change in time by 2
			vx += -tmspx*0.5;
		}
		//		test			min(-5,sin(t+x/4)*10)*max(5,sin(t+x/4)*10)
		//		square wave		max(-3,min(3,sin(-t+x/4)*100))-5

		/*		read the line's Y offset over time as normal change, then get the X component of that.
				curveVx = (line change in Y over time*Normal.x/(normal.x^2+normal.y^2))
				normal.x = -dy.		normal.y = dx.
				(ftmp - equation(spx/screenScale) is the graphs change on the Y axis which is how it is used in the curveVy equation, but in curveVx it is interpreted as the
				total displacment allong the line's normal. If it was actually interpreted as only the Y component and the X component was found using it, a square wave could
				accelerate the player to near infinte speeds while moving relativly slowly.
				While less accurate, this should be more stable.
		*/
		//		this should push the sled normal to the curve instead of just straight up
		frameTime += dt*2;
		av = 0;//		set angular velocity to 0 as it will be set below if the sled is not level on the track
	}
		
	//	ctx.fillText("Screen X = " + Math.round(screenx).toString(),10,50);
	//	ctx.fillText("Screen Y = " + Math.round(screeny).toString(),10,120);
	//	ctx.fillText("spx = " + Math.round(spx).toString(),10,180);
	//	ctx.fillText("spy = " + Math.round(spy).toString(),10,240);
	//	ctx.fillText("tmspy = " + Math.round(tmspy*10).toString(),10,280);
	//	ctx.fillText("dx = " + Math.round(dx*10).toString(),10,330);
	//	ctx.fillText("dy = " + Math.round(dy*10).toString(),10,400);
	//		----------------------------------------------------		[   Set Rotation   ]		----------------------------------------------------
	if((equation(apx + boxx) <  apy + boxy)		||		(equation(apx - boxx) <  apy - boxy)){//		one of the lower corners is below the line
	//if((equation((spx + boxx - boxy/4)/screenScale) <  spy + boxx - boxy/4)		||		(equation((spx - boxx - boxy/4)/screenScale) <  spy - boxx - boxy/4)){//		one of the lower corners is below the line
		av = ((equation(apx - boxx - boxy/4) - (apy - boxy - boxx/4)) - (equation(apx + boxx - boxy/4) - (apy + boxy - boxx/4)))*dt*0.08;
	}
	rotation += av;
	av *= 0.992;//		dampen rotation as it flies above the track so the sled eventually stopps spinning

	
	
}