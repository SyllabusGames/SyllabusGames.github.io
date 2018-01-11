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
var gvy = 0;
var curveVy = 0;
var curveVx = 0;
var ax = 0;
var ay = 30;
		
function setUpSledder(){
	//		set up sledder
	img = new Image;
	img.src = "SineRiderSled.svg";
	//window.alert("pause");
}

	//		-----------------------------------------------------------------------		[   UPDATE   ]		-----------------------------------------------------------------------
function moveSledder(){
	curveVy = Math.min(curveVy + ay*dt , 0);

	if(simulating){
		//		sledder kinematics
		//		while velocity and acceleration are calculated as raw math, when converting to world space, changes in position must be divided by screenScale

		px += vx*dt*screenScale*0.3;
		py += vy*dt*screenScale*0.3;
		//py += 2;

		//px += curveVx*dt*screenScale*0.15;
		//py += curveVy*dt*screenScale*0.15;
		py += gvy*dt;
		//		test curvV with y=-x*2+(x/10-5)^2+sin(x/5+t)*15+10-x-5
		//						y=sin(x/3+t*2)*3-x/2
		//						y=sin(t*4)*3-x/2
		vx += ax*dt;
		vy += ay*dt;
		gvy += ay*dt;
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
	//	ctx.beginPath();
	//	ctx.moveTo(px , py);
	//	ctx.lineTo(px+2*screenScale , py);
	//	ctx.stroke();
	}

	drawColliders();//		see collisions.js
}
//		-----------------------------------------------------------------------		[   /UPDATE/   ]		-----------------------------------------------------------------------

	
function resetSledder(){
	dropTime = 0;//		delete
	simulating = !simulating;
	px = defaultPosX*screenScale;
	py = defaultPosY*screenScale;
	av = 0;
	vx = 0;
	vy = 0;
	gvy = 0;
	curveVx = 0;
	curveVy = 0;
	rotation = 0;
	//		reset screen too. This should probably be moved somewhere else.
	screenx = 0;
	screeny = 0;
}

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
	//ctx.drawImage( img, -28/8*screenScale , -58/8*screenScale , 56/8*screenScale , 80/8*screenScale);

	ctx.rotate( rotation );
	ctx.translate( -px, -py );

	//		----------------------------------------------------		[   Set Position   ]		----------------------------------------------------
	if(ftmp < py){//		touching line
		py = ftmp;//		snap to surface of graph so you do not pass through it.
		gvy = 0;

		//		velocity is set by the derrivative of the graph at the contact point
		//vy = (equation((px+1)/screenScale) - ftmp)/screenScale*40000*dt;
		//		get the tangent unit vector
		dy = (equation((px+0.1)/screenScale) - ftmp);//		get vertical displacment 0.1 meter to the right. dx = 1.
		dx = 1/Math.sqrt(0.01 + dy*dy);//		divide dx by the length of the tangent line formed by [1 , dy]
		dy *= dx;//		multiply dy by dx so [dx , dy] is 1 meter long (unit tangent vector)
		dx *= 0.1;//	dx was a multiplier for dy, now turn it back into dx (the x component of the tangent unit vector)
		fftemp = vx*dx + vy*dy;//		Dot Product of velocity and slope's tangent.		(Ammount of velocity along the graph)
			
		vx = dx*fftemp;//		new velocity along x set by amount of original velocity that was in the direction tangent to the equation line
		vy = dy*fftemp;


	//		----------------------------------------------------		[   Set Velocity by line movement   ]		----------------------------------------------------
		//	Equation for this is	 curveV = [0,dy/dt] + tangentUnitVector * Dot( [0,dy/dt] , tangentUnitVector )
		//		since the graph can only change allong y, dx/dt cannot be measured and 0 is used for these calculations
		frameTime -= dt*2;//		I am not sure why the *2 is nessisary but it just is
		
		//			(y pos - y pos 1 frame ago)
		dydt = (ftmp - equation(px/screenScale));
		//		the x and y components of the velocity of the graph at [dx,dy]
		tmpx = -dx*dydt*dy;
		tmpy += dydt + dy*dydt*dy;
		//		dot product of normal vector and line movement vector.	normal.x = -dy.		normal.y = dx.		Dot = tmpx*normal.x + tmpy*normal.y;
		ftmp = -tmpx*dy + tmpy*dx;
		//ftmp = Math.max(0 , ftmp);
		curveVx +=  dy*ftmp*0.125;//		curveVy += normal vector * ammount of normal vector in the direction of the graph's movement
		curveVy += -dx*ftmp*0.125;
		/*
		//		Draw line's offset
		ctx.strokeStyle="#0000FF";
		ctx.beginPath();
		ctx.moveTo(px , py);
		ctx.lineTo(px+dy*ftmp*80/screenScale , py-dx*ftmp*80/screenScale);
		ctx.stroke();

		//		Draw line's direction of travel
		ctx.strokeStyle="#FF0000";
		ctx.beginPath();
		ctx.moveTo(px , py);
		ctx.lineTo(px-(tmpx)*80/screenScale , py+ (tmpy)*80/screenScale);
		ctx.stroke();
		*/

		//curveVy += (ftmp - equation(px/screenScale));//		read the line's Y offset over time as Y velocity change
		//curveVx += (ftmp - equation(px/screenScale))*-dy / (dx*dx+dy*dy);

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
