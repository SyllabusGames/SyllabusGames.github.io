var viewAngle = 1;
var cForwardx = 0.577350269;
var cForwardz = -0.577350269;
var cLeftx = 0;
var cLeftz = 0;
var camSpacex = 0;
var camSpacey = 0;
var camSpacez = 0;

function drawXYZ(){
	var imageData = xyz.getImageData(0, 0, xyzWidth, xyzWidth);
	var buf = new ArrayBuffer(imageData.data.length);
	var buf8 = new Uint8ClampedArray(buf);
	var data = new Uint32Array(buf);
	var y = 0.5;
	var dist = 0;
	var pos = 0;
	var brightness = 1;
	var lastY = 0;//		the y value from last frame where dx=0 and dz=-1
	
	//		erase the last render
	xyz.clearRect(0, 0, xyzWidth, xyzHeight);

	//		the camera never looks up or down. This means cForwardy and cLefty are always 0 and cUpx = 0, cUpy = 1, and cUpz = 0

	//		use the viewAngle to find the X and Z components of the vector of the direction the camera is facing
	cForwardx = -Math.sin(viewAngle);
	cForwardz = -Math.cos(viewAngle);
	
	cLeftx = cForwardz;
	cLeftz = -cForwardx;

	//		ReRender everything near the sledders X and Z position and everything further from the camera than the sledder on those 2 axes. Then render the sledder.
	useZ = true;

	for (var x = -100; x < 100; x+=0.4){
		tempZ = -21;
		lastY = equation(x);
		for(var z = -20; z < 20; z+=0.07){
			tempZ = z;
			y = equation(x);

			//		transform to camera space. Matrix is [x,x,x,0	//	y,y,y,0	//	z,z,z,0]	x = cLeft	y=cUp	z=cForward.
			//		A lot of the matrix is removed since the camera never changes pitch.
			camSpacex = x*cLeftx + z*cForwardx;
			camSpacey = -y + 25;//		invert Y since y increases as you go down the screen. Offset camera by 25m up because tilting the camera just doesn't work.'
			camSpacez = x*cLeftz + z*cForwardz;

			//		perspective projection matrix. (still side view)		Scale = 25
			camSpacex =  camSpacex/(-500+camSpacez)*1000;//		camSpace / (camera distance from origin allong horizontal axis + z) * scale
			camSpacey = -camSpacey/(-500+camSpacez)*1000;
			
			if(Math.abs(x) % 10 < 0.5 || Math.abs(z) % 10 < 0.5){
				brightness = 0;
			}else{
				ftmp = y-equation(x-1);
				//		cross product of normal and light (straight down) scaled and clamped [0.4,1]
				brightness = Math.max(Math.min(1-100/(1+(y-lastY)*(y-lastY) + ftmp*ftmp)/2 , 1) , 0.4);
			}

			pos = Math.round(camSpacex+xyzWidth/2);//		add half of screen width so the render is centered
			if(pos > 0 && pos < xyzWidth){//		not off screen to the right or left
				pos += Math.round(camSpacey+xyzHeight/2 - 200)*xyzWidth;
				if(pos > 0 && pos < data.length){//		not off screen off the top or bottom
					data[pos] =
						(255   << 24) |    // alpha
						(brightness*255 << 16) |    // blue		2.55 = 255/100
						(brightness*255 <<  8) |    // green	6.375 = 255/40
						 brightness*255;            // red		6.375 = 255/40
				}
			}
		}
	}
	imageData.data.set(buf8);
	xyz.putImageData(imageData, 0, 0);
}