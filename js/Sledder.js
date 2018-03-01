//		set sledder rotation by this:	http://jsfiddle.net/johndavies91/xwMYY/		if possible
var defaultPosX = 0;
var defaultPosY = 0;

//		sled transform
var av = 0;//	angular velocity
var rotation = 0;
var boxx = 0;
var boxy = 0;
var px = 150;//		position in screen space
var py = 50;
var vx = 0;
var vy = 100;
var curveVy = 0;
var curveVx = 0;
var ax = 0;
var ay = 30;
		
function setUpSledder(){
	//		set up sledder
	img = new Image;
	img.src = "SineRiderSled.svg";
}

function resetSledder(){
	dropTime = 0;//		delete
	simulating = !simulating;
	px = defaultPosX*screenScale;
	py = -defaultPosY*screenScale;//		negative because the Y axis is measured from the top by the canvas
	av = 0;
	vx = 0;
	vy = 0;
	curveVx = 0;
	curveVy = 0;
	rotation = 0;
	//		reset screen too. This should probably be moved somewhere else.
	screenx = 0;
	screeny = 0;
}

	//		-----------------------------------------------------------------------		[   UPDATE   ]		-----------------------------------------------------------------------
function moveSledder(){
	//curveVy = Math.min(curveVy + ay*dt , 0);//		limit curveVy to being negative so it can only push the sledder up.
	//curveVy += ay*dt;//		gravity is applied through curveVy

	if(simulating){
		//		sledder kinematics
		//		while velocity and acceleration are calculated as raw math, when converting to world space, changes in position must be divided by screenScale
		ctx.fillText("Vy = " + Math.round(vy*10).toString(),10,150);
		ctx.fillText("Vx = " + Math.round(vx*10).toString(),10,50);
		

		px += vx*dt*screenScale*0.15;
		py += vy*dt*screenScale*0.15;
		//		test curvV with y=-x*2+(x/10-5)^2+sin(x/5+t)*15+10-x-5
		//						y=sin(x/3+t*2)*3-x/2
		//						y=sin(t*4)*3-x/2
		vx += ax*dt;
		vy += ay*dt;
		//		friction
		//vx *= 0.9999;
		//vy *= 0.9999;
		drawSledder();
	}else{
		//		draw sledder at default position and not moving
		ctx.translate( px, py );
		//		aspect ratio is 0.8
		ctx.drawImage( img, -0.875*screenScale , -1.8125*screenScale , 1.75*screenScale , 2.5*screenScale);//		position here is is local space and therefore is only usefuly to center the image on the sled
		ctx.translate( -px, -py );
	}
}
//		-----------------------------------------------------------------------		[   /UPDATE/   ]		-----------------------------------------------------------------------


function drawSledder(){
	rotation = rotation%(Math.PI*2);
	boxy = Math.sin(-rotation)*40;
	boxx = Math.cos(-rotation)*40;

	ftmp = equation(px/screenScale);//		Y position of line under sled

	//		----------------------------------------------------		[   Draw Sledder   ]		----------------------------------------------------
	ctx.translate( px, py );
	ctx.rotate( -rotation );//		rotation in radians
	//		aspect ratio is 0.8
	ctx.drawImage( img, -0.875*screenScale , -1.8125*screenScale , 1.75*screenScale , 2.5*screenScale);//		position here is is local space and therefore is only usefuly to center the image on the sled

	ctx.rotate( rotation );
	ctx.translate( -px, -py );

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
	if(ftmp < py){//		touching line
		py = ftmp;//		snap to surface of graph so you do not pass through it.

		//		velocity is set by the derrivative of the graph at the contact point
		//vy = (equation((px+1)/screenScale) - ftmp)/screenScale*40000*dt;
		//		get the tangent unit vector
		dy = (equation((px+0.1)/screenScale) - ftmp);//		get vertical displacment 0.1 meter to the right. dx = 1.
		dx = 1/Math.sqrt(0.01 + dy*dy);//		divide dx by the length of the tangent line formed by [0.1 , dy]
		dy *= dx;//		multiply dy by dx so [dx , dy] will be 1 meter long after the next opperation (unit tangent vector)
		dx *= 0.1;//	dx was a multiplier for dy, now turn it back into dx (the x component of the tangent unit vector)
		fftemp = (vx)*dx + (curveVy+vy)*dy;//		Dot Product of velocity and slope's tangent.		(Ammount of velocity along the graph)
			
		vx = dx*fftemp;//		new velocity along x set by amount of original velocity that was in the direction tangent to the equation line
		vy = dy*fftemp;


	//		----------------------------------------------------		[   Set Velocity by line movement   ]		----------------------------------------------------
		//		since the graph can only change allong Y so the change in Y is used as the full displacment vector.
		frameTime -= dt*2;//		I am not sure why the *2 is nessisary but it just is

		//		test (rotation)				-((x-22)*t*0.3-2)/5-5
		//		test (slightly slopped trampoline)	 -x/100+sin(t*1.5+1.5)*7
		//		test (neat)			-x/3-5+sin(-t+x/2)*2+((1+sin(t))*x/10-2)^2+sin(t)*4
		
		ltmp = equation((px-1)/screenScale);//		y pos 1 frame ago 1 meter to the left of the sledder's current location
		rtmp = equation((px+1)/screenScale);//		y pos 1 frame ago 1 meter to the right
		//	is ltmp closer to the current y position than rtmp (is the graph moving !left or !right)
		//		the difference between ftmp and ltmp/rtmp shows which direction and by how much the sled's current Y position has moved since the last frame
		if(Math.abs(ftmp - rtmp) > Math.abs(ftmp - ltmp)){//		ltmp is closer so the line is moving right so i will use ltmp to estimate the change in x (dxdt) this frame
			dxdt = (ftmp - ltmp);
		}else{//		the graph is moving left so i will use rtmp to estimate the change in x (dxdt) this frame
			dxdt = (ftmp - rtmp);
		}

		//		(y pos) - (y pos 1 frame ago)
		dydt = (ftmp - equation(px/screenScale));//		dydx is just the y component of the velocity vector.
		
		//		tmpx and tmpy are the x and y components of the velocity of the graph at [px,py]
		//		this will push the sled more left or right when the slope is steeper and more vertically when the slope is more level
		tmpx = dy * dxdt;
		tmpy = dx * dydt;

		if(tmpy < 0){//		The sled cannot be pulled by the ground, only pushed.
			vy += tmpy*0.5;//		devide by 2 to compensate for multiplying the change in time by 2
			vx += -tmpx*0.5;
		}
		//		test			min(-5,sin(t+x/4)*10)*max(5,sin(t+x/4)*10)
		//		square wave		max(-3,min(3,sin(-t+x/4)*100))-5
		/*
		//		Draw force from line moving
		ctx.strokeStyle="#FF0000";
		ctx.beginPath();
		ctx.moveTo(px , py);
		ctx.lineTo(px-tmpx*200/screenScale , py);
		ctx.stroke();

		ctx.strokeStyle="#00FF00";
		ctx.beginPath();
		ctx.moveTo(px , py);
		ctx.lineTo(px ,py+tmpy*200/screenScale);
		ctx.stroke();
		
		ctx.strokeStyle="#0000FF";
		ctx.beginPath();
		ctx.moveTo(px , py);
		ctx.lineTo(px-tmpx*200/screenScale , py+tmpy*200/screenScale);
		ctx.stroke();
		*/

		/*		read the line's Y offset over time as normal change, then get the X component of that.
				curveVx = (line change in Y over time*Normal.x/(normal.x^2+normal.y^2))
				normal.x = -dy.		normal.y = dx.
				(ftmp - equation(px/screenScale) is the graphs change on the Y axis which is how it is used in the curveVy equation, but in curveVx it is interpreted as the
				total displacment allong the line's normal. If it was actually interpreted as only the Y component and the X component was found using it, a square wave could
				accelerate the player to near infinte speeds while moving relativly slowly.
				While less accurate, this should be more stable.
		*/
		//		this should push the sled normal to the curve instead of just straight up
		frameTime += dt*2;
		av = 0;//		set angular velocity to 0 as it will be set below if the sled is not level on the track
	}
		
	//	ctx.fillText("Ltmp = " + Math.round(ltmp*10).toString(),10,50);
	//	ctx.fillText("Rtmp = " + Math.round(rtmp*10).toString(),10,120);
	//	ctx.fillText("Ftmp = " + Math.round(ftmp*10).toString(),10,180);
		ctx.fillText("tmpx = " + Math.round(tmpx*10).toString(),10,220);
		ctx.fillText("tmpy = " + Math.round(tmpy*10).toString(),10,280);
		ctx.fillText("dx = " + Math.round(dx*10).toString(),10,330);
		ctx.fillText("dy = " + Math.round(dy*10).toString(),10,400);
	//		----------------------------------------------------		[   Set Rotation   ]		----------------------------------------------------
	if((equation((px + boxx)/screenScale) <  py + boxy)		||		(equation((px - boxx)/screenScale) <  py - boxy)){//		one of the lower corners is below the line
	//if((equation((px + boxx - boxy/4)/screenScale) <  py + boxx - boxy/4)		||		(equation((px - boxx - boxy/4)/screenScale) <  py - boxx - boxy/4)){//		one of the lower corners is below the line
		av = ((equation((px - boxx - boxy/4)/screenScale) - (py - boxy - boxx/4)) - (equation((px + boxx - boxy/4)/screenScale) - (py + boxy - boxx/4)))*dt*0.08;
	}
	rotation += av;
	av *= 0.992;//		dampen rotation as it flies above the track so the sled eventually stopps spinning

	
	//		----------------------------------------------------		[   Move Screen   ]		----------------------------------------------------
	//		move the screen to keep the sledder on screen. Values are squared to smooth the screen movement.
	if(px > 1000){//		right edge of screen
		ftmp = (px - 1000)*dt*0.4;
		ftmp *= ftmp;
		screenx -= ftmp;
		px -= ftmp*screenScale;
	}else if(px < 600){//	left edge of screen
		ftmp = (px - 600)*dt*0.4;
		ftmp *= ftmp;
		screenx += ftmp;
		px += ftmp*screenScale;
	}
	
	if(py > 450){//		bottom edge of screen
		ftmp = (py - 450)*dt*0.4;
		ftmp *= ftmp;
		screeny += ftmp;
		py -= ftmp*screenScale;
	}else if(py < 350){//		top edge of screen
		ftmp = (py - 350)*dt*0.4;
		ftmp *= ftmp;
		screeny -= ftmp;
		py += ftmp*screenScale;
	}

	//		when you add rescaling mechanics here, remember to move the sled based on the difference between the new and old scale
}