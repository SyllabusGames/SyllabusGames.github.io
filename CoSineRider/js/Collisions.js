//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var showSVGPoints = false;

var gCircleX = new Array();
var gCircleY = new Array();
var gCircleR = new Array();

var endAngle = 2*Math.PI;
var levelName = "No level loaded";

var groundPointsX;
var groundPointsY;
var ceilingPointsX;
var ceilingPointsY;


var allGroundPointsX = new Array();
var allGroundPointsY = new Array();
var allGroundBreaks = new Array();

var allResetPointsX = new Array();
var allResetPointsY = new Array();
var allResetBreaks = new Array();

var sledLastY = 0;
var sledLastX = 0;
var llineY = 0;
var rlineY = 0;
var side = 1;
var segmentLength = 0;

/*		checking for collision with the .svg will
			take the sled's position
			use fftmp = Math.max( Math.min((apx+200)/20 , 19) , 0); to get the index of the relevent points
			use a for loop to parse all points in the arrays groundPointsX and ceilingPointsX to see if the sled is between them
			if it is, interpolate the find the Y value directly above/below the sled and use the sled's velocity to check if it is about to passed through the floor/ceiling
			each pass of the read in function will add more points to each array so it may look like this [(1) = point 1's position]
			   __--(6)------____
			(5)					(7)


	(0)-(1)--___   _______-------(3)--__	
				(2)						(4)

			As a result of this, evey point in the relevent array must be checked (unless a line has been contacted and the sled moved)
				because being between (5) and (6) also places you between (1) and (2) or (2) and (3)
*/


function drawColliders(){
	//		-----------------------------------------------------------------------		[   CHECK FOR COLLISIONS   ]		-----------------------------------------------------------------------
	if(simulating){
							drawPoint(apx+rotPointx , apy-rotPointy , "#000000");
							drawPoint(apx-rotPointx , apy+rotPointy , "#000000");
		//		-----------------------------------------------------------------------		[   Collision with SVG   ]		-----------------------------------------------------------------------
		for(i = allGroundPointsX.length - 1 ; i > 0 ; i--){//		read all x points
			if(allGroundBreaks[i-1]){//		if the next point is part of a different line, skip
				if(Math.sign(allGroundPointsX[i] - apx) != Math.sign(allGroundPointsX[i-1] - apx)){//		sled is between this point and the next
					dx = allGroundPointsX[i-1] - allGroundPointsX[i];//		change in x from one path point to the next
					dy = allGroundPointsY[i-1] - allGroundPointsY[i];

		//		-----------------------------------------------------------------------		[   Move Sled   ]		-----------------------------------------------------------------------
					dxdt = apx - allGroundPointsX[i];//		change in x from one path point to the sled
					rtmp = dxdt/dx;//		fraction of line from [i] to [i-1] that is from [i] to sled position
					ftmp = -dy*rtmp - allGroundPointsY[i];//		ftmp = y position on line at sled X coordinate
		//			console.log((apy+0.1).toString() +" ftmp="+ ftmp +" next apy="+ (apy+vy*dt*0.15).toString() + " dt=" + dt);
		
		
					if(Math.abs(ftmp - apy) < 5){//		Sled is less than 1 meter from this line, run collision and rotation calculations. (this stops lines above and below the line the sled is on from effecting its rotation)
						//		circle the two verticies collided with
				/*		drawPoint(allGroundPointsX[i-1] , -allGroundPointsY[i-1] , "#AA0000");
						drawPoint(apx , ftmp , "#FF0000");
						drawPoint(allGroundPointsX[i] , -allGroundPointsY[i] , "#0000FF");
*/
						//		get which side of the line the sled was on last frame
						//		the following line, vy*dt is multiplied by 0.15 because that is done in Sledder.js and it just works. The 1.2 is to give a margin for error/inconsistant dt values.
						if(Math.sign(allGroundPointsX[i] - sledLastX) != Math.sign(allGroundPointsX[i-1] - sledLastX)){//		sled was on this line last frame (Sled x is between i and i-1)
							//		side = change in sledY from last frame relative to the collision line. (posative number means the sled was above this line last frame. negative = below)
							side = (sledLastY - (-dy*(sledLastX - allGroundPointsX[i])/dx - allGroundPointsY[i]));
						}else{
							//		[i-1] is closer to the sled than [i]
							if(dx * (sledLastX - allGroundPointsX[i-1]) >= 0){//		[i-1] is right of [i] and sled is right of [i-1] (0*0) OR [i-1] is left of [i] and sled is left of [i-1].
								if(i > 1){//		if i = 1 or 0, the following will try to read from allGroundPointsX[i-1]
									side = (sledLastY - ((allGroundPointsY[i-1] - allGroundPointsY[i-2])*(sledLastX - allGroundPointsX[i-1])/(allGroundPointsX[i-2] - allGroundPointsX[i-1]) - allGroundPointsY[i-1]));
								}else{//		end of line. Expect strange behaviour
									continue;
								}
							}else{//		[i] is closer to the sled than [i-1]
								if(i < allGroundPointsY.length-1){//		don't read ground points that don't exist
									side = (sledLastY - ((allGroundPointsY[i+1] - allGroundPointsY[i])*(sledLastX - allGroundPointsX[i+1])/(allGroundPointsX[i] - allGroundPointsX[i+1]) - allGroundPointsY[i+1]));
								}else{//		end of line. Expect strange behaviour
									continue;
								}
							}
						}
						
						rotPointx = Math.cos(-rotation)*0.6;//		get x and y position of one end of the sled
						rotPointy = Math.sin(-rotation)*0.6;
						segmentLength = Math.sqrt(dx*dx+dy*dy);//		vector dx,dy magnitude
						/*
						//		SLED ROTATION USING BOTH ENDS OF THE SLED
						ltmp = 0;
						rtmp = 0;
				//		-----------------------------------------------------------------------		[   Rotate Sled   ]		-----------------------------------------------------------------------
						//						left end of sled		(Not the same side)		left line end
						if(Math.sign(allGroundPointsX[i] - apx - rotPointx) != Math.sign(allGroundPointsX[i-1])){//		sled in between allGroundPointsX[i] and [i-1]
						//	rtmp = change in Y between sled's right end y position and collision line at sled's right end's x position
							llineY = -allGroundPointsY[i-1] - (dx-dxdt-rotPointx)*dy/segmentLength;//	Y position on line directly below/above the right end of the sled
//							console.log(llineY + "  -  " + dxdt  + "  -  " + dx + "  -  " + dy + "  -  " + (dx-dxdt-rotPointx)/Math.sqrt(dx*dx+dy*dy));
							rtmp = -(dx - dxdt - rotPointx)/dx*dy - rotPointy;//apy + rotPointy - (-dy*(apx + rotPointx - allGroundPointsX[i])/dx - allGroundPointsY[i]);
							stmp = "#FF0000";
						}else{
							llineY = 50;
							//		[i-1] is closer to the sled than [i]
							if(dx * (apx + rotPointx - allGroundPointsX[i-1]) >= 0){//		[i-1] is right of [i] and sled is right of [i-1] (0*0) OR [i-1] is left of [i] and sled is left of [i-1].
								if(i > 1){//		if i = 1 or 0, the following will try to read from allGroundPointsX[-1]
									//rtmp = (dx - dxdt - rotPointx)*dy / segmentLength - rotPointy;
									rtmp = -((allGroundPointsX[i-2] - allGroundPointsX[i-1]) - (apx - allGroundPointsX[i-1]) - rotPointx) / //		(dx - dxdt - rotPointx)
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
							ltmp = -(dx - dxdt + rotPointx)/dx*dy + rotPointy;//(apy - rotPointy - (-dy*(apx - rotPointx - allGroundPointsX[i])/dx - allGroundPointsY[i]));
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
						rtmp = -(dx - dxdt - rotPointx)/dx*dy - rotPointy;
						ltmp = -(dx - dxdt + rotPointx)/dx*dy + rotPointy;

		//			OVERHANG Z SHAPED LINES ARE STILL NOT WORKING RIGHT
		//			when passing between lines, check both?



						//	console.log(dydt + " _ " +  (apy - ftmp));
						if((side * (apy - ftmp)) < 0){//	Sled is not on the same side of this line as it was last frame
				//		if((apy < ftmp && (ftmp - apy) < 1) && (apy+vy*dt*1.2*0.15 < ftmp)){//	Sled is under line by less than a meter OR next frame, the sled will be below line


							//		make [dx , dy] the unit vector of this segment's slope
							dx /= segmentLength;
							dy /= segmentLength;
							
							dtmp = vx*dx - vy*dy;//		Dot Product of velocity and slope's tangent.		(Ammount of velocity along the graph)
							vx =  dtmp * dx;//		new velocity along x set by amount of original velocity that was in the direction tangent to the equation line
							vy = -dtmp * dy;

							apy = ftmp + Math.sign(side)*0.0005;//		snap sled to just above/below line
							if(apy + 0.5 < equation(apx)){
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
							av = (ltmp - rtmp)*dt*10;//		this should not be in this if statment but putting it elsewhare it will run too often.
						}
					}
				}
			}
		}
		sledLastY = apy;//		record the current sled position Y so it can be used next frame
		sledLastX = apx;
				
	}else{//		if the level is not running, display the name
		ctx.fillStyle = "black";//		font color for text overlay
		ctx.font = "40px Arial";
		ctx.fillText(levelName,10,40);
	}
	
		//		-----------------------------------------------------------------------		[   Draw (and Collision with) Goals   ]		-----------------------------------------------------------------------
	for(i = gCircleX.length-1 ; i > -1 ; i--){
		//		check for collision with the sledder. (sled.x-circle.x)^2 + (sled.y-circle.y)^2 < circle.radius^2
//		console.log("x=" + gCircleX[i] + " y=" + gCircleY[i] + " r=" + gCircleR[i]);
		if( (Math.pow(apx-gCircleX[i] , 2) + Math.pow(apy-gCircleY[i] , 2)) < gCircleR[i]*gCircleR[i] ){
			levelCleared();
			resetSledder();
		}

		//		draw circle
		ctx.strokeStyle="#00B0FF";
		ctx.beginPath();
		ctx.arc((gCircleX[i]-screenx)*screenScale , -(gCircleY[i]-screeny)*screenScale , gCircleR[i]*screenScale , 0 , endAngle);
		ctx.stroke();
		ctx.stroke();
	}
	
	if(showSVGPoints)
		drawSVGColliders();
}