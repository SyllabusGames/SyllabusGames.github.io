//		-----------------------------------------------------------------------		[   Draw Grid   ]		-----------------------------------------------------------------------
function drawGrid(){//		draw a line at every 10 units
	if(isCutscene)
		return;
	
	//		set the color for the small lines on the left side of the grid
	ctx.strokeStyle = _gridSecondaryColor;
	ctx.font = "26px Arial";
	ctx.fillStyle = _gridTextColor;
	
	
		
	//		change what grid increments are visible based on screen scale
	if(screenScale < 1.5){
		gridScale = 100;
		if(!simulating){
			ctx.fillText("100m" , -screenx*screenScale-30 , (-100+screeny)*screenScale+10);
			ctx.fillText("100m" , (100-screenx)*screenScale-30 , screeny*screenScale+10);
		}
	}else{
		//		if scale is not huge and game is not running, label the 10 meter marks
		if(screenScale < 25){
			gridScale = 10;
			if(!simulating){
				ctx.fillText("10m" , -screenx*screenScale-30 , (-10+screeny)*screenScale+10);
				ctx.fillText("10m" , (10-screenx)*screenScale-30 , screeny*screenScale+10);
			}
		}else if(screenScale < 350){
			gridScale = 1;
			if(!simulating){
				ctx.fillText("10m" , -screenx*screenScale-30 , (-10+screeny)*screenScale+10);
				ctx.fillText("10m" , (10-screenx)*screenScale-30 , screeny*screenScale+10);
			}
		}else{
			gridScale = 0.1;
			if(!simulating){
				ctx.fillText("1m" , -screenx*screenScale-30 , (-1+screeny)*screenScale+5);
				ctx.fillText("1m" , (1-screenx)*screenScale-30 , screeny*screenScale+5);
			}
		}
	}
	
	if(usePolar){
		drawPolarGrid();
	}else{
		if(!simulating){//		lable axis
			ctx.fillText("X axis" , screenWidth - 90 , screeny * screenScale - 2);
			ctx.fillText("Y axis" , -screenx * screenScale + 2 , 25);
		}
		for(i = Math.round(screenx/gridScale) ; i < (screenx+screenWidth/screenScale)/gridScale ; i++){//		vertical lines
			if(i%10 == 0){
				ctx.lineWidth = 3;
				if(i == 0){//		Origin line
					ctx.strokeStyle = _gridMainColor;
					ctx.beginPath();
					ctx.moveTo(-screenx * screenScale , 0);//		(graph left edge + line number*line spacing(10))*scale
					ctx.lineTo(-screenx * screenScale , screenHeight);
					ctx.stroke();
					ctx.strokeStyle = _gridSecondaryColor;
					continue;
				}
			}else{
				ctx.lineWidth = 1;
			}
			ctx.beginPath();
			ctx.moveTo((-screenx + i*gridScale) * screenScale , 0);//		(graph left edge + line number*line spacing(10))*scale
			ctx.lineTo((-screenx + i*gridScale) * screenScale , screenHeight);
			ctx.stroke();
		}
		for(i = Math.round(-screeny/gridScale) ; i < (-screeny+screenHeight/screenScale)/gridScale ; i++){//		horizontal lines
			if(i%10 == 0){
					ctx.lineWidth = 3;
				if(i == 0){//		Origin line
					ctx.strokeStyle = _gridMainColor;
					ctx.beginPath();
					ctx.moveTo(0 , screeny * screenScale);
					ctx.lineTo(screenWidth , screeny * screenScale);
					ctx.stroke();
					ctx.strokeStyle = _gridSecondaryColor;
					continue;
				}
			}else{
				ctx.lineWidth = 1;
			}
			ctx.beginPath();
			ctx.moveTo(0 , (screeny + i*gridScale) * screenScale);
			ctx.lineTo(screenWidth , (screeny + i*gridScale) * screenScale);
			ctx.stroke();
		}
	}
}

function drawPolarGrid(){
	for(i = 1 ; i < 100 ; i++){//		circles
		if(i%10 == 0){//		Every 10 lines
			ctx.lineWidth = 3;
		}else{
			ctx.lineWidth = 1;
		}
		ctx.beginPath();
		ctx.arc( -screenx*screenScale , screeny*screenScale , i*gridScale*screenScale , 0 , _piTimes2);
		ctx.stroke();
	}

	for(i = Math.PI ; i > 0 ; i -= Math.PI/12){//	Radial lines
		if(i%45 == 0){//		Every 45 degrees = pi/12 radians
			ctx.lineWidth = 3;
		}else{
			ctx.lineWidth = 1;
		}
		ctx.beginPath();
		ctx.moveTo( (math.cos(i)*10000 - screenx) * screenScale ,  (math.sin(i)*10000 + screeny) * screenScale);//		(graph left edge + line number*line spacing(10))*scale
		ctx.lineTo((-math.cos(i)*10000 - screenx) * screenScale , (-math.sin(i)*10000 + screeny) * screenScale);
		ctx.stroke();
	}
}

//		-----------------------------------------------------------------------		[   Draw Goals   ]		-----------------------------------------------------------------------
function drawGoals(){
	ctx.strokeStyle = _goalColor;
	//		draw goal
	ctx.beginPath();
	ctx.arc((goalx-screenx)*screenScale , -(goaly-screeny)*screenScale , goalr*screenScale , 0 , _piTimes2);
	ctx.stroke();
	
	if(useCheckpoints){
		ctx.strokeStyle = _checkpointColor;
		for(i = checkx.length-1 ; i > -1 ; i--){
			//		draw circle
			ctx.beginPath();
			ctx.arc((checkx[i]-screenx)*screenScale , -(checky[i]-screeny)*screenScale , checkr[i]*screenScale , 0 , _piTimes2);
			ctx.stroke();
		}
	}
}