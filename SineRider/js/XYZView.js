var viewAngle = 1;
var passViewAngle = 1;//		the view angle used for this pass so it doesn't change partway through a render pass.
var cForwardx = 0.577350269;
var cForwardz = -0.577350269;
var cLeftx = 0;
var cLeftz = 0;
var camSpacex = 0;
var camSpacey = 0;
var camSpacez = 0;

//		for testing			-x*2+2+sin(z/15+t*2+x/10)*10
//							(sin(x/5-t)+sin(z/5))*5-20
//							sin(x/5-t)*4+-(z/5)^2


var imageData;
var buf;
var buf8;
var data;
var y = 0.5;
var dist = 0;
var pos = 0;
var lastY = 0;//		the y value from last frame where dx=0 and dz=-1
//		these 4 values hold the color of the pixel being added
var brightness = 1;
var red = 0;
var green = 0;
var blue = 0;
var scanLine = -15;

function setUpXYZ(){
	scanLine = -20;
	imageData = xyz.getImageData(0, 0, xyzWidth, xyzWidth);
	buf = new ArrayBuffer(imageData.data.length);
	buf8 = new Uint8ClampedArray(buf);
	data = new Uint32Array(buf);
	passViewAngle = viewAngle;
}

function drawXYZ(){
	//		the camera never looks up or down. This means cForwardy and cLefty are always 0 and cUpx = 0, cUpy = 1, and cUpz = 0

	//		use the viewAngle to find the X and Z components of the vector of the direction the camera is facing
	cForwardx = -Math.sin(passViewAngle);
	cForwardz = -Math.cos(passViewAngle);
	
	cLeftx = cForwardz;
	cLeftz = -cForwardx;

	//		ReRender everything near the sledders X and Z position and everything further from the camera than the sledder on those 2 axes. Then render the sledder.
	useZ = true;
	//		render 10 lines a frame
	for (var x = scanLine; x < scanLine+10; x+=0.3){
		tempZ = -21;
		lastY = equation(x);
		for(var z = -20; z < 20; z+=0.2){
			tempZ = z;
			y = equation(x);

			//		transform to camera space. Matrix is [x,x,x,0	//	y,y,y,0	//	z,z,z,0]	x = cLeft	y=cUp	z=cForward.
			//		A lot of the matrix is removed since the camera never changes pitch.
			camSpacex = x*cLeftx + z*cForwardx;
			camSpacey = -y + 200;//		invert Y since y increases as you go down the screen. Offset camera by 25m up because tilting the camera just doesn't work.'
			camSpacez = x*cLeftz + z*cForwardz;

			//		perspective projection matrix. (still side view)		Scale = 25
			camSpacex =  camSpacex/(-500+camSpacez)*1200;//		camSpace / (camera distance from origin allong horizontal axis + z) * scale
			camSpacey = -camSpacey/(-500+camSpacez)*1200;
		
			//		when one of these variables is not set below, it is being left at 1.
			brightness = 1;
			red = 1;
			green = 1;
			blue = 1;

			//		color the left and right edges to match the Z min and max lines drawn in the 2D view
			if(z > 19){//		left edge
				green = 0;
				blue = 0;
			}else if(z < -19){//		right edge
				brightness = 1;
				red = 0;
				blue = 0;
			}else if(Math.abs(x) % 10 < 0.5 || Math.abs(z) % 10 < 0.5){//		on the 10x10 grid
				brightness = 0;
			}else{//		normal point on surface
				ftmp = y-equation(x-0.2);//		
				//		cross product of normal and light (straight down) scaled and clamped [0.4,1]
				//		y-lastY is the change in y moving 0.2 pixels allong -z. ftmp is change in y moving 0.2 pixels allong -x
				brightness = 1/(1+20*(y-lastY)*(y-lastY)) * 1/(1+20*ftmp*ftmp);
			}
			lastY = y;

			//		draw a dot at the sled's position
			if((x-apx)*(x-apx)+(z-apz)*(z-apz) < 4){
				brightness = 1;
				red = 0;
				green = 0;
				blue = 1;
			}

			pos = Math.round(camSpacex+xyzWidth/2);//		add half of screen width so the render is centered
			if(pos > 0 && pos < xyzWidth){//		not off screen to the right or left
				pos += Math.round(camSpacey+xyzHeight/2 - 400)*xyzWidth;
				if(pos > 0 && pos < data.length){//		not off screen off the top or bottom
					data[pos] =
						(255   << 24) |    // alpha
						(brightness*255*blue << 16) |    // blue		2.55 = 255/100
						(brightness*255*green <<  8) |    // green	6.375 = 255/40
						 brightness*255*red;            // red		6.375 = 255/40
				}
			}
		}
	}

	//		if the render has reached line 50, push the buffer to the canvas
	if(scanLine < 50){
		scanLine += 10;
		return;
	}
		
	passViewAngle = viewAngle;
	scanLine = -15;
	//		erase the last render
	xyz.clearRect(0, 0, xyzWidth, xyzHeight);

	//	----------------------------------		[   draw origin   ]		----------------------------------
	//		Here I copied over the projection to camera space and perspective scripts, then removed all the parts that were just 0
	y = 0;
	z = 0;
	for (var x = -4; x < 4; x+=0.2){
		camSpacex = x*cLeftx;
		camSpacez = x*cLeftz;
		//		perspective projection matrix. (still side view)		Scale = 25
		camSpacex =  camSpacex/(-500+camSpacez)*1200;//		camSpace / (camera distance from origin allong horizontal axis + z) * scale
		camSpacey = -200/(-500+camSpacez)*1200;
			
		pos = Math.round(camSpacex+xyzWidth/2) + Math.round(camSpacey+xyzHeight/2 - 400)*xyzWidth;
			data[pos] =
				(255   << 24) |    // alpha
				 255;            // red
	}
	x = 0;
	z = 0;
	for (var y = -4; y < 4; y+=0.2){
		camSpacey = (y - 200)/(-500)*1200;
		pos = Math.round(xyzWidth/2) + Math.round(camSpacey+xyzHeight/2 - 400)*xyzWidth;
			data[pos] =
				(255   << 24) |    // alpha
				(255 <<  8)    // green
	}
	y = 0;
	x = 0;
	for (var z = -4; z < 4; z+=0.2){
		camSpacex = z*cForwardx;
		camSpacez = z*cForwardz;

		camSpacex =  camSpacex/(-500+camSpacez)*1200;
		camSpacey = -200/(-500+camSpacez)*1200;
			
		pos = Math.round(camSpacex+xyzWidth/2) + Math.round(camSpacey+xyzHeight/2 - 400)*xyzWidth;
			data[pos] =
				(255   << 24) |    // alpha
				(255 << 16)    // blue
	}

	imageData.data.set(buf8);
	xyz.putImageData(imageData, 0, 0);
	//		a second canvas is behind the XYZ canvas showing exactly the same thing, effectivly doubling the samples and removing gaps in the render.
//	xyz2.clearRect(0, 0, xyzWidth, xyzHeight);
	//xyz2.drawImage(xyz2c , 0 , 0);
	
	document.getElementById('XYZ2').getContext('2d').clearRect(0, 0, xyzWidth, xyzHeight);
	document.getElementById('XYZ2').getContext('2d').drawImage(document.getElementById('XYZ') , 0 , 0);

	//		reset the render buffer
	scanLine = -20;
	buf = new ArrayBuffer(imageData.data.length);
	buf8 = new Uint8ClampedArray(buf);
	data = new Uint32Array(buf);
}