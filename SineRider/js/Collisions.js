//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
//		all points are lower left corner of rectangle

var rRectX = new Array(2);
var rRectY = new Array(2);
var rRecSideX = new Array(2);
var rRecSideY =  new Array(2);


var gRectX = new Array(2);
var gRectY = new Array(2);
var gRectSideX = new Array(2);
var gRectSideY =  new Array(2);


var rCircleX = new Array(1);
var rCircleY = new Array(1);
var rCircleR = new Array(1);


var gCircleX = new Array(2);
var gCircleY = new Array(2);
var gCircleR = new Array(2);

var endAngle = 2*Math.PI;
var levelName = "No level loaded";

var groundPointsX;
var groundPointsY;
var ceilingPointsX;
var ceilingPointsY;


var allGroundPointsX = new Array();
var allGroundPointsY = new Array();
var allGroundBreaks = new Array();


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
	ctx.lineWidth = 6;
	//		temporaty variables for offsetting by the screen position
	tmspx = spx/screenScale;// - screenx*screenScale;
	tmspy = spy/screenScale;// + screeny*screenScale;
	ftmp = -screenx*screenScale;
	dtmp = -screeny*screenScale;
	ctx.lineWidth = 0.3*screenScale;
		//		-----------------------------------------------------------------------		[   Draw Goals   ]		-----------------------------------------------------------------------
		//				Rectangle
		for(i = gRectX.length-1 ; i > -1 ; i--){
			//		check for collision with the sledder. Collisions are checked in world space (no scale) while objects are drawn in screen space (scale applied).
			if(tmspx > gRectX[i]-screenx){
				if(tmspy > -gRectY[i]+screeny){
					if(tmspx < gRectX[i]-screenx + gRecSideX[i]){
						if(tmspy < -gRectY[i]+screeny + gRecSideY[i]){
							levelCleared();
							resetSledder();
			}}}}
			//		draw rectangle
			ctx.strokeStyle="#00B0FF";
			ctx.beginPath();
			ctx.moveTo(gRectX[i]*screenScale+ftmp , -gRectY[i]*screenScale-dtmp);
			ctx.lineTo(gRectX[i]*screenScale+ftmp , -gRectY[i]*screenScale-dtmp + gRecSideY[i]*screenScale);
			ctx.lineTo(gRectX[i]*screenScale+ftmp + gRecSideX[i]*screenScale , -gRectY[i]*screenScale-dtmp + gRecSideY[i]*screenScale);
			ctx.lineTo(gRectX[i]*screenScale+ftmp + gRecSideX[i]*screenScale , -gRectY[i]*screenScale-dtmp);
			ctx.stroke();
			//ctx.fillStyle = "#50B0FF";
			ctx.closePath();
			//ctx.fill();
			ctx.stroke();
		}
	
		//				Circle
		for(i = rCircleX.length-1 ; i > -1 ; i--){//		i is a globar variable
			//		check for collision with the sledder. (sled.x-circle.x)^2 + (sled.y-circle.y)^2 < circle.radius^2
			if( (Math.pow(tmspx-gCircleX[i]+screenx,2) + Math.pow(tmspy+gCircleY[i]-screeny,2)) < gCircleR[i]*gCircleR[i] ){
				levelCleared();
				resetSledder();
			}

			//		draw circle
			ctx.strokeStyle="#00B0FF";
			ctx.beginPath();
			ctx.arc(gCircleX[i]*screenScale+ftmp , -gCircleY[i]*screenScale-dtmp , gCircleR[i]*screenScale , 0 , endAngle);
			ctx.stroke();
			//ctx.fillStyle = "#50B0FF";
			ctx.closePath();
			//ctx.fill();
			ctx.stroke();
		}

		//		-----------------------------------------------------------------------		[   Draw Resets   ]		-----------------------------------------------------------------------
		//				Rectangle
		for(i = rRectX.length-1 ; i > -1 ; i--){
			if(tmspx > rRectX[i]-screenx){
				if(tmspy > -rRectY[i]+screeny){
					if(tmspx < rRectX[i]-screenx + rRecSideX[i]){
						if(tmspy < -rRectY[i]+screeny + rRecSideY[i]){
							resetSledder();
			}}}}
			ctx.strokeStyle="#500000";
			ctx.beginPath();
			ctx.moveTo(rRectX[i]*screenScale+ftmp , -rRectY[i]*screenScale-dtmp);
			ctx.lineTo(rRectX[i]*screenScale+ftmp , -rRectY[i]*screenScale-dtmp + rRecSideY[i]*screenScale);
			ctx.lineTo(rRectX[i]*screenScale+ftmp + rRecSideX[i]*screenScale , -rRectY[i]*screenScale-dtmp + rRecSideY[i]*screenScale);
			ctx.lineTo(rRectX[i]*screenScale+ftmp + rRecSideX[i]*screenScale , -rRectY[i]*screenScale-dtmp);
			ctx.stroke();
			ctx.fillStyle = "red";
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
		//				Circle
		for(i = rCircleX.length-1 ; i > -1 ; i--){
			if( (Math.pow(tmspx-rCircleX[i]+screenx,2) + Math.pow(tmspy+rCircleY[i]-screeny,2)) < rCircleR[i]*rCircleR[i] ){
				resetSledder();
			}

			ctx.strokeStyle="#500000";
			ctx.beginPath();
			ctx.arc(rCircleX[i]*screenScale+ftmp , -rCircleY[i]*screenScale-dtmp , rCircleR[i]*screenScale , 0 , endAngle);
			ctx.stroke();
			ctx.fillStyle = "red";
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
	
	if(simulating){//		while the game is running, check for collisions
	}else{//		if the level is not running, display the name
		ctx.fillStyle = "black";//		font color for text overlay
		ctx.font = "40px Arial";
		ctx.fillText(levelName,10,40);
		ctx.font = "60px Arial";//		60spx font is used everywhere but here so it should only need to be set here.
	}
	drawSVGColliders();
	//		-----------------------------------------------------------------------		[   Collision with SVG   ]		-----------------------------------------------------------------------
	for(i = allGroundPointsX.length - 1 ; i > 0 ; i--){//		read all x points
		if(allGroundBreaks[i-1]){//		if the next point is part of a different line, skip
			if(Math.sign(allGroundPointsX[i] - apx) != Math.sign(allGroundPointsX[i-1] - apx)){//		sled is between this point and the next
				dx = allGroundPointsX[i-1] - allGroundPointsX[i];//		change in x from one path point to the next
				dy = allGroundPointsY[i-1] - allGroundPointsY[i];

				dxdt = apx - allGroundPointsX[i];//		change in x from one path point to the sled
				rtmp = dxdt/dx;//		fraction of line from [i] to [i-1] that is from [i] to sled position
				ftmp = -dy*rtmp - allGroundPointsY[i];//		ftmp = y position on line at sled X coordinate
				console.log((apy+0.1).toString() +" ftmp="+ ftmp +" next apy="+ (apy+vy*dt*0.15).toString() + " dt=" + dt);
				//		the following line, vy*dt is multiplied by 0.15 because that is done in Sledder.js and it just works. The 1.2 is to give a margin for error/inconsistant dt values.
				if((apy < ftmp && (ftmp - apy) < 1) && (apy+vy*dt*1.2*0.15 < ftmp)){//	Sled is under line by less than a meter OR next frame, the sled will be below line
			//	if((apy > ftmp-0.01) && (apy+vy*dt*1.2*0.15 < ftmp)){//		currently sled is above line (or very slightly below [0.01]) and next frame will be below line
			//	if(apy < ftmp && (ftmp - apy) < 1){///(0.1+Math.abs(dx))){//		if sled is below line but not by more than 1 meter/slope x component
					console.log("moved to SVG");
					ltmp = Math.sqrt(dx*dx+dy*dy);//		vector dx,dy magnitude
					//		make [dx , dy] the unit vector of this segment's slope
					dx /= ltmp;
					dy /= ltmp;
					
					dtmp = vx*dx - vy*dy;//		Dot Product of velocity and slope's tangent.		(Ammount of velocity along the graph)
				//	console.log("dot="+dtmp+" vx=" + vx + " dx=" + dx+" vy="+vy+" dy="+dy);
					vx =  dtmp * dx;//		new velocity along x set by amount of original velocity that was in the direction tangent to the equation line
					vy = -dtmp * dy;

					apy = ftmp;//		snap sled to line
				}
			}
		}
	}
}


