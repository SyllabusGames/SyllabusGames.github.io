/*
	(x*x+y*y-1)^3-x^2*y^3=0
	1=x*x+y*y
	0.1=sin(x)+sin(y)
	6.5=((x+2)^2+y^2)^0.5+((x-1.4)^2+(y+1.4)^2)^0.5+((x-1.4)^2+(y-1.4)^2)^0.5
*/
	var renderx = 1600;
	var rendery;
	var renderType = -1;
	var renderEquation;
	var renderCanvas

	var renderImageData;
	var renderBuf;
	var renderBuf8;
	var renderData;
	
	var leftEqu;
	var rightEqu;
	var renderTime;

	var renderScreenx;
	var renderScreeny;
	var renderScreenScale;

	var renderFullTimer = 5;

function render2d(){
	//	----------------------------------		[   Set Up Render   ]		----------------------------------
	renderType = 0;
	renderCanvas = document.getElementById("render").getContext('2d');
	//		clear/set up buffer for writing pixels to
	renderImageData = renderCanvas.getImageData(0, 0, screenWidth, screenHeight);
	renderBuf = new ArrayBuffer(renderImageData.data.length);
	renderBuf8 = new Uint8ClampedArray(renderBuf);
	renderData = new Uint32Array(renderBuf);

	//		record what type of equation / inequality this is
	if(equRaw[0].indexOf('=') > -1){
		renderType = 0;
		renderEquation = equRaw[0].split('=');
	}else if(equRaw[0].indexOf('>') > -1){
		renderType = 1;
		renderEquation = equRaw[0].split('>');
	}else if(equRaw[0].indexOf('<') > -1){
		renderType = 2;
		renderEquation = equRaw[0].split('<');
	}else{
		return;
	}
	
	//		initilalize equations for both sides of the = < or >
	scope = {x: 0 , y: 0};
	eqinput = math.parse(renderEquation[0] , scope);
	leftEqu = eqinput.compile();
	
	eqinput = math.parse(renderEquation[1] , scope);
	rightEqu = eqinput.compile();

	//	----------------------------------		[   Full Screen Render   ]		----------------------------------
	renderx = screenWidth;
	renderPass();
}

function renderCenter(){//		this is called every thime the screen is moved or rescaled by the player
	renderFullTimer = 5;//		reset the timer so it will be at least 5 frames before a full screen render starts. See CoSineRider.html for implimentation
	renderx = -1;//		stop renderPass if it is running
	renderImageData = renderCanvas.getImageData(0, 0, screenWidth, screenHeight);
	renderBuf = new ArrayBuffer(renderImageData.data.length);
	renderBuf8 = new Uint8ClampedArray(renderBuf);
	renderData = new Uint32Array(renderBuf);

	var xx;
	for(xx = screenWidth/2+100; xx > screenWidth/2-100 ; xx--){
		for(rendery = screenHeight/2+100 ; rendery > screenHeight/2-100 ; rendery--){
			scope = {x: xx/screenScale + screenx , y: -rendery/screenScale + screeny};
			//		in folowing equation, #/(screenScale*screenScale). #/3 is about the number of pixels wide the line drawn will be
			switch(renderType){
				case 0://	=
					if(Math.pow(leftEqu.eval(scope) - rightEqu.eval(scope) , 2) < 10/(screenScale*screenScale)){//		equation is true for this point
						renderData[rendery*screenWidth+xx] = (255 << 24) | (125 << 16) |	(125 <<  8) | 0;
					}
					break;
				case 1://	>
					if(leftEqu.eval(scope) > rightEqu.eval(scope)){//		equation is true for this point
						renderData[rendery*screenWidth+xx] = (150 << 24) | (0 << 16) |	(255 <<  8) | 0;
					}
					break;
				default://	<
					if(leftEqu.eval(scope) < rightEqu.eval(scope)){//		equation is true for this point
						renderData[rendery*screenWidth+xx] = (150 << 24) | (255 << 16) |	(0 <<  8) | 0;
					}
					break;
			}
		}
	}
	renderImageData.data.set(renderBuf8);
	renderCanvas.putImageData(renderImageData, 0, 0);
}

function renderPass(){
	renderTime = performance.now();

	for(; renderx > -1 ; renderx--){
		for(rendery = screenHeight ; rendery > -1 ; rendery--){
			scope = {x: renderx/screenScale + screenx , y: -rendery/screenScale + screeny};
			//		in folowing equation, #/(screenScale*screenScale). #/3 is about the number of pixels wide the line drawn will be
			switch(renderType){
				case 0://	=
					if(Math.pow(leftEqu.eval(scope) - rightEqu.eval(scope) , 2) < 10/(screenScale*screenScale)){//		equation is true for this point
						renderData[rendery*screenWidth+renderx] = (255 << 24) | (125 << 16) |	(125 <<  8) | 0;
					}
					break;
				case 1://	>
					if(leftEqu.eval(scope) > rightEqu.eval(scope)){//		equation is true for this point
						renderData[rendery*screenWidth+renderx] = (150 << 24) | (0 << 16) |	(255 <<  8) | 0;
					}
					break;
				default://	<
					if(leftEqu.eval(scope) < rightEqu.eval(scope)){//		equation is true for this point
						renderData[rendery*screenWidth+renderx] = (150 << 24) | (255 << 16) |	(0 <<  8) | 0;
					}
					break;
			}
		}
		if((performance.now() - renderTime) > 15){//		start a new pass every 15ms
			renderImageData.data.set(renderBuf8);//		push partial render to screen
			renderCanvas.putImageData(renderImageData, 0, 0);
			window.requestAnimationFrame(renderPass);//		call renderPass() next frame to continue the rendering
			return;
		}
	}

	renderImageData.data.set(renderBuf8);
	renderCanvas.putImageData(renderImageData, 0, 0);
}

/*
				renderData[rendery*screenWidth+renderx] =
					(255   << 24) |    // alpha
					(0 << 16) |    // blue		2.55 = 255/100
					(100 <<  8) |    // green	6.375 = 255/40
					 255;            // red		6.375 = 255/40
*/