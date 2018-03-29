var viewAngle = 3;
var camx = 0;
var camy = -50;
var camz = 30;
var cForwardx = -0.577350269;
var cForwardy = -0.577350269;
var cForwardz = -0.577350269;
var cLeftx = 0;
var cLeftz = 0;
var cUpx = 0;
var cUpy = 0;
var cUpz = 0;
var fromCamx = 1;
var fromCamy = 1;
var fromCamz = 1;
var camSpacex = 0;
var camSpacey = 0;
var camSpacez = 0;

function drawXYZ(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	/*camx = Math.sin(viewAngle) * 707;
	camz = Math.cos(viewAngle) * 707;
	dist = magnitude(camx , camy , camz);

	cnormalx = -camx/dist;
	cnormalz = -camz/dist;*/
	
	var canvasWidth  = canvas.width;
	var canvasHeight = canvas.height;
	var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

	var buf = new ArrayBuffer(imageData.data.length);
	var buf8 = new Uint8ClampedArray(buf);
	var data = new Uint32Array(buf);
	var value = 0.5;
	var y = 0.5;
	var dist = 0;
	var pos = 0;
	

	
	//		Build camera matrix for transforming points from world space to camera space (It was camera to world but I filipped the signs)
	//		Left vector of camera is forward vector CROSS world up vector (0,1,0)
	cLeftx = -cForwardy;
	//clefty = 0; This is a note that CamLeftY is always 0 by deffinition;
	cLeftz = cForwardx;
	//		Up vector of camera icamera forward vector CROSS camera left vector
	cUpx = -cForwardy*cLeftz;
	cUpy = -cForwardz * cLeftx + cForwardx*cLeftz;
	cUpz = cForwardy * cLeftx;


	//		ReRender everything near the sledders X and Z position and everything further from the camera than the sledder on those 2 axes. Then render the sledder.


	for (var x = 0; x < 800; x++){
		for (var z = -400; z < 400; z+=3){
			//	x=x
			//	y=equ(x,t,z)
			//	z=z/80
			//y = -Math.sin(x/30)*20+Math.pow(z/80 , 2)-5;
			if(x > 300 && x < 500 && z > -100 && z < 100){
				y = -400;
			}else{
				y = -x/2+Math.sin(x/30)*5 + Math.pow((z-400)/80 , 2) - 60;
			}


			fromCamx = x-400 - camx;
			fromCamy = -y + camy;//		invert Y since y increases as you go down the screen
			fromCamz = z/80-400/80 - camz;
			
			//		Z-Clipping (does not work)
			//if(fromCamz < 0)
			//	continue;

			dist = magnitude(fromCamx , fromCamy , fromCamz);
			/*
			//		cross(cross(camNormal , fromCamToPoint) , fromCamToPoint) / fromCamToPoint.magnitude
			//		tmsp_ = cross(camNormal , fromCamToPoint)
			tmspx = cnormaly * fromCamz - cnormalz * fromCamy;
			tmspy = cnormalz * fromCamx - cnormalx * fromCamz;
			tmspz = cnormalx * fromCamy - cnormaly * fromCamx;

			//		cross(tmsp_ , fromCamToPoint) / fromCamToPoint.magnitude
			camSpacex = (tmspy * fromCamz - tmspz * fromCamy)/dist;
			camSpacey = (tmspz * fromCamx - tmspx * fromCamz)/dist;
			camSpacez = (tmspx * fromCamy - tmspy * fromCamz)/dist;
			*/
			//		testing


			//		side view
		//	camSpacex = fromCamx;
		//	camSpacey = fromCamy;


			//		transform to camera space. Matrix is [x,x,x,0	//	y,y,y,0	//	z,z,z,0]	x = cLeft	y=cUp	z=cForward
			camSpacex = fromCamx*cLeftx + fromCamy*cUpx + fromCamz*cForwardx;
			camSpacey = fromCamx*0 + fromCamy*cUpy + fromCamz*cForwardy;
		//	camSpacez = fromCamx*cLeftz + fromCamy*cUpz + fromCamz*cForwardz;

			//https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/building-basic-perspective-projection-matrix
			//		perspective projection matrix. (still side view)		Scale = 25
			camSpacex = camSpacex/(camz+z/80)*25;
			camSpacey = camSpacey/(camz+z/80)*25;


			/*//		orthocrapic slant, failure projection
			camSpacex = fromCamz*cnormalx - fromCamx*cnormalz;
			camSpacey = (1+fromCamx)*cnormalx + (1+fromCamz)*cnormalz + (1+fromCamy)*cnormaly;
			//		testing
			*/

			pos = Math.round(camSpacex) + Math.round(camSpacey)*canvasWidth;
			if(pos > 0 && pos < data.length){
				data[pos] =
					(255   << 24) |    // alpha
					((y-40)*0.255 << 16) |    // blue		2.55 = 255/100
					((30-z/80)*6.375 <<  8) |    // green	6.375 = 255/40
					 (30+x/80)*6.375;            // red		6.375 = 255/40
			}
		}
	}

	/*
	for (var y = 0; y < canvasHeight; ++y) {
		for (var x = 0; x < canvasWidth; ++x) {
			var value = x * y & 0xff;

			data[y * canvasWidth + x] =
				(255   << 24) |    // alpha
				(value << 16) |    // blue
				(value <<  8) |    // green
				 value;            // red
		}
	}*/
	imageData.data.set(buf8);
	ctx.putImageData(imageData, 0, 0);

	ctx.fillText("View = " + Math.round(viewAngle).toString(),10,100);
	ctx.fillText("CamX = " + Math.round(camx).toString(),10,150);
	ctx.fillText("CamY = " + Math.round(camy).toString(),10,200);
	ctx.fillText("CamZ = " + Math.round(camz).toString(),10,250);
	ctx.fillText("Forward X = " + cForwardx.toString(),10,300);
	ctx.fillText("Forward Y = " + cForwardy.toString(),10,350);
	ctx.fillText("Forward Z = " + cForwardz.toString(),10,400);

}

function magnitude(aa , bb , cc){
	return Math.sqrt(aa*aa + bb*bb + cc*cc);
}