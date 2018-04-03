var viewAngle = 1;
var camx = 400;
var camy = 400;
var camz = -800;
var cForwardx = 0.577350269;
var cForwardy = 0;
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
	var imageData = ctx.getImageData(0, 0, screenWidth, screenHeight);

	var buf = new ArrayBuffer(imageData.data.length);
	var buf8 = new Uint8ClampedArray(buf);
	var data = new Uint32Array(buf);
	var y = 0.5;
	var dist = 0;
	var pos = 0;
	
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	cForwardx = -Math.sin(viewAngle)*(1-cForwardy*cForwardy);
	cForwardz = -Math.cos(viewAngle)*(1-cForwardy*cForwardy);
	
	dist = magnitude(cForwardx , cForwardz , cForwardy);
	cForwardx /= dist;
	cForwardz /= dist;
	
	camx = -cForwardx*0;
	camy = -cForwardy*0;
	camz = -cForwardz*0;
	
	//		Build camera matrix for transforming points from world space to camera space (It was camera to world but I filipped the signs)
	//		Left vector of camera is forward vector CROSS world up vector (0,1,0)
	cLeftx = -cForwardz;
	//clefty = 0; This is a note that CamLeftY is always 0 by deffinition;
	cLeftz = cForwardx;
	//		Up vector of camera icamera forward vector CROSS camera left vector
	cUpx = -cForwardy*cLeftz;
	cUpy = -cForwardz * cLeftx + cForwardx*cLeftz;
	cUpz = cForwardy * cLeftx;


	//		ReRender everything near the sledders X and Z position and everything further from the camera than the sledder on those 2 axes. Then render the sledder.


	for (var x = -200; x < 200; x++){
		for (var z = -20; z < 20; z+=0.1){
			//	x=x
			//	y=equ(x,t,z)
			//	z=z/80
			//y = -Math.sin(x/30)*20+Math.pow(z/80 , 2)-5;
			if(x > -100 && x < 100 && z > -5 && z < 5){
				y = -400;
			}else{
				y = -x/2+Math.sin(x/30)*5 + Math.pow(z , 2)/30 - 60;
				//y = Math.round(-x/100)*100;//		Steps
				//y = -100;
			}


			fromCamx = x - camx;
			fromCamy = -y + camy;//		invert Y since y increases as you go down the screen
			fromCamz = z - camz;
			
			//		Z-Clipping (does not work)
			//if(fromCamz < 0)
			//	continue;
			/*
			dist = magnitude(fromCamx , fromCamy , fromCamz);
			
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
			camSpacex = fromCamx;
			camSpacey = fromCamy;
			
	//		camSpacex = fromCamx*(1-viewAngle/3) + fromCamz*viewAngle/3;
	//		camSpacey = fromCamy;
	//		camSpacez = -fromCamx*viewAngle/3 + fromCamz*(1-viewAngle/3);
			

			//		transform to camera space. Matrix is [x,x,x,0	//	y,y,y,0	//	z,z,z,0]	x = cLeft	y=cUp	z=cForward
			camSpacex = fromCamx*cLeftx + fromCamy*cUpx + fromCamz*cForwardx + camx;
			camSpacey = fromCamx*0		+ fromCamy*cUpy + fromCamz*cForwardy + camy;
			camSpacez = fromCamx*cLeftz + fromCamy*cUpz + fromCamz*cForwardz + camz;



			//https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/building-basic-perspective-projection-matrix
			//		perspective projection matrix. (still side view)		Scale = 25
			
	//		camSpacex = camSpacex/(camz+z)*25;
	//		camSpacey = camSpacey/(camz+z)*25;

	//		camSpacex =  camSpacex/(-100+z)*100;//		camSpace / (camera distance from origin allong horizontal axis + z) * scale
	//		camSpacey = -camSpacey/(-100+z)*100;


			//		orthocrapic slant, failure projection
	//		camSpacex = fromCamz*cForwardx - fromCamx*cForwardz;
	//		camSpacey = (1+fromCamx)*cForwardx + (1+fromCamz)*cForwardz + (1+fromCamy)*cForwardy;
			//		testing
			

			pos = Math.round(camSpacex+screenWidth/2);
			if(pos > 0 && pos < screenWidth){//		not off screen to the right or left
				pos += Math.round(camSpacey+screenHeight/2)*screenWidth;
				if(pos > 0 && pos < data.length){//		not off screen off the top or bottom
					data[pos] =
						(255   << 24) |    // alpha
						((y-40)*0.255 << 16) |    // blue		2.55 = 255/100
						((30-z/80)*6.375 <<  8) |    // green	6.375 = 255/40
						 (30+x/80)*6.375;            // red		6.375 = 255/40
				}
			}
		}
	}

	/*
	for (var y = 0; y < screenHeight; ++y) {
		for (var x = 0; x < screenWidth; ++x) {
			var value = x * y & 0xff;

			data[y * screenWidth + x] =
				(255   << 24) |    // alpha
				(value << 16) |    // blue
				(value <<  8) |    // green
				 value;            // red
		}
	}*/
	imageData.data.set(buf8);
	ctx.putImageData(imageData, 0, 0);

	ctx.fillText("View = " + viewAngle.toString(),10,100);
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