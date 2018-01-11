//		all points are lower left corner of rectangle

var rRectX = new Array(2);
var rRectY = new Array(2);
var rRecSidex = new Array(2);
var rRecSidey =  new Array(2);


var goalRectX = new Array(2);
var gRectx = new Array(2);
var gRecty =  new Array(2);


var rCircleX = new Array(1);
var rCircleY = new Array(1);
var rCircleR = new Array(1);


var goalCircleX = new Array(2);
var goalCircleY = new Array(2);
var gCircler = new Array(2);

var endAngle = 2*Math.PI;

function setUpColliders(){
	//setInterval(psUpdate, 1000 / 60);//		call update 60 times a second
	rRectX[0] = -30;
	rRectY[0] = -62;
	rRecSidex[0] = 10;
	rRecSidey[0] = 5;
	
	rRectX[1] = -20;
	rRectY[1] = -40;
	rRecSidex[1] = 5;
	rRecSidey[1] = 5;

	rCircleX[0] = -20;
	rCircleY[0] = -20;
	rCircleR[0] = 4;
}

function drawColliders(){
	ctx.lineWidth = 6;
	//		tomporaty variables for offsetting by the screen position
	tmpx = px/screenScale;// - screenx*screenScale;
	tmpy = py/screenScale;// + screeny*screenScale;
	ftmp = screenx*screenScale;
	fftemp = screeny*screenScale;
//	ctx.fillText( "px = " + Math.round(tmpx-ftmp).toString() + " Box0 = " + Math.round(rRectX[0]).toString() + " Box1 = " + Math.round(rRectX[1]).toString() + " ScreenX = " + Math.round(screenx).toString() ,10,400);
//	ctx.fillText( "px = " + Math.round(tmpx).toString() + "BoxX = " + Math.round(rRectX[0]+ftmp).toString() ,10,400);
//	ctx.fillText( "py = " + Math.round(tmpy).toString() + "Boxy = " + Math.round(-rRectY[0]+ftmp).toString() ,10,480);
	for(i = rRectX.length-1 ; i > -1 ; i--){//		i is a global variable
		//		check for collision with the sledder. Collisions are checked in world space (no scale) while objects are drawn in screen space (scale applied).
		if(tmpx > rRectX[i]+screenx){
			if(tmpy > -rRectY[i]-screeny){
				if(tmpx < rRectX[i]+screenx + rRecSidex[i]){
					if(tmpy < -rRectY[i]-screeny + rRecSidey[i]){
						resetSledder();
		}}}}
		//		draw rectangle
		ctx.strokeStyle="#500000";
		ctx.beginPath();
		ctx.moveTo(rRectX[i]*screenScale+ftmp , -rRectY[i]*screenScale-fftemp);
		ctx.lineTo(rRectX[i]*screenScale+ftmp , -rRectY[i]*screenScale-fftemp + rRecSidey[i]*screenScale);
		ctx.lineTo(rRectX[i]*screenScale+ftmp + rRecSidex[i]*screenScale , -rRectY[i]*screenScale-fftemp + rRecSidey[i]*screenScale);
		ctx.lineTo(rRectX[i]*screenScale+ftmp + rRecSidex[i]*screenScale , -rRectY[i]*screenScale-fftemp);
		ctx.stroke();
		ctx.fillStyle = "red";
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
	
	for(i = rCircleX.length-1 ; i > -1 ; i--){//		i is a globar variable
		//		check for collision with the sledder. (sled.x-circle.x)^2 + (sled.y-circle.y)^2 < circle.radius^2
		if( (Math.pow(tmpx-rCircleX[i]-screenx,2) + Math.pow(tmpy+rCircleY[i]+screeny,2)) < rCircleR[i]*rCircleR[i] ){
			resetSledder();
		}

		//		draw rectangle
		ctx.strokeStyle="#500000";
		ctx.beginPath();
		ctx.arc(rCircleX[i]*screenScale+ftmp , -rCircleY[i]*screenScale-fftemp , rCircleR[i]*screenScale , 0 , endAngle);
		ctx.stroke();
		ctx.fillStyle = "red";
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}

