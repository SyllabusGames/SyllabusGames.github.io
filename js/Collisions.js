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


function drawColliders(){
	ctx.lineWidth = 6;
	//		temporaty variables for offsetting by the screen position
	tmpx = px/screenScale;// - screenx*screenScale;
	tmpy = py/screenScale;// + screeny*screenScale;
	ftmp = screenx*screenScale;
	fftemp = screeny*screenScale;
	ctx.lineWidth = 0.3*screenScale;
		//		-----------------------------------------------------------------------		[   Draw Goals   ]		-----------------------------------------------------------------------
		for(i = gRectX.length-1 ; i > -1 ; i--){
			//		check for collision with the sledder. Collisions are checked in world space (no scale) while objects are drawn in screen space (scale applied).
			if(tmpx > gRectX[i]+screenx){
				if(tmpy > -gRectY[i]-screeny){
					if(tmpx < gRectX[i]+screenx + gRecSideX[i]){
						if(tmpy < -gRectY[i]-screeny + gRecSideY[i]){
							levelCleared();
							resetSledder();
			}}}}
			//		draw rectangle
			ctx.strokeStyle="#00B0FF";
			ctx.beginPath();
			ctx.moveTo(gRectX[i]*screenScale+ftmp , -gRectY[i]*screenScale-fftemp);
			ctx.lineTo(gRectX[i]*screenScale+ftmp , -gRectY[i]*screenScale-fftemp + gRecSideY[i]*screenScale);
			ctx.lineTo(gRectX[i]*screenScale+ftmp + gRecSideX[i]*screenScale , -gRectY[i]*screenScale-fftemp + gRecSideY[i]*screenScale);
			ctx.lineTo(gRectX[i]*screenScale+ftmp + gRecSideX[i]*screenScale , -gRectY[i]*screenScale-fftemp);
			ctx.stroke();
			ctx.fillStyle = "#50B0FF";
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
	
		for(i = rCircleX.length-1 ; i > -1 ; i--){//		i is a globar variable
			//		check for collision with the sledder. (sled.x-circle.x)^2 + (sled.y-circle.y)^2 < circle.radius^2
			if( (Math.pow(tmpx-gCircleX[i]-screenx,2) + Math.pow(tmpy+gCircleY[i]+screeny,2)) < gCircleR[i]*gCircleR[i] ){
				levelCleared();
				resetSledder();
			}

			//		draw circle
			ctx.strokeStyle="#00B0FF";
			ctx.beginPath();
			ctx.arc(gCircleX[i]*screenScale+ftmp , -gCircleY[i]*screenScale-fftemp , gCircleR[i]*screenScale , 0 , endAngle);
			ctx.stroke();
			ctx.fillStyle = "#50B0FF";
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}

		//		-----------------------------------------------------------------------		[   Draw Resets   ]		-----------------------------------------------------------------------
		for(i = rRectX.length-1 ; i > -1 ; i--){
			if(tmpx > rRectX[i]+screenx){
				if(tmpy > -rRectY[i]-screeny){
					if(tmpx < rRectX[i]+screenx + rRecSideX[i]){
						if(tmpy < -rRectY[i]-screeny + rRecSideY[i]){
							resetSledder();
			}}}}
			ctx.strokeStyle="#500000";
			ctx.beginPath();
			ctx.moveTo(rRectX[i]*screenScale+ftmp , -rRectY[i]*screenScale-fftemp);
			ctx.lineTo(rRectX[i]*screenScale+ftmp , -rRectY[i]*screenScale-fftemp + rRecSideY[i]*screenScale);
			ctx.lineTo(rRectX[i]*screenScale+ftmp + rRecSideX[i]*screenScale , -rRectY[i]*screenScale-fftemp + rRecSideY[i]*screenScale);
			ctx.lineTo(rRectX[i]*screenScale+ftmp + rRecSideX[i]*screenScale , -rRectY[i]*screenScale-fftemp);
			ctx.stroke();
			ctx.fillStyle = "red";
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
	
		for(i = rCircleX.length-1 ; i > -1 ; i--){
			if( (Math.pow(tmpx-rCircleX[i]-screenx,2) + Math.pow(tmpy+rCircleY[i]+screeny,2)) < rCircleR[i]*rCircleR[i] ){
				resetSledder();
			}

			ctx.strokeStyle="#500000";
			ctx.beginPath();
			ctx.arc(rCircleX[i]*screenScale+ftmp , -rCircleY[i]*screenScale-fftemp , rCircleR[i]*screenScale , 0 , endAngle);
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
		ctx.fillText(levelName,1200,50);
	}
}

