//		-----------------------------------------------------------------------		[   Draw Grid   ]		-----------------------------------------------------------------------
function drawGrid(){//		draw a line at every 10 units
	ctx.strokeStyle="#C5C5C5";
	ctx.font = "26px Arial";
	ctx.fillStyle = "black";
	
	if(!simulating){//		lable axis
		ctx.fillText("X axis" , screenWidth - 90 , screeny * screenScale - 2);
		ctx.fillText("Y axis" , -screenx * screenScale + 2 , 25);
	}
	
	//		change what grid incraments are visible based on screen scale
	if(screenScale < 1.5){
		gridScale = 100;
		if(!simulating){
			ctx.fillText("100m" , -screenx*screenScale-30 , (-100+screeny)*screenScale+10);
			ctx.fillText("100m" , (100-screenx)*screenScale-30 , screeny*screenScale+10);
		}
	}else{
		//		if scale is not huge and game is not running, lable the 10 meter marks
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
	for(i = Math.round(screenx/gridScale) ; i < (screenx+screenWidth/screenScale)/gridScale ; i++){//		vertical lines
		if(i%10 == 0){
			ctx.lineWidth = 3;
			if(i == 0){//		Origin line
				ctx.strokeStyle="#505050";
				ctx.beginPath();
				ctx.moveTo(-screenx * screenScale , 0);//		(graph left edge + line number*line spacing(10))*scale
				ctx.lineTo(-screenx * screenScale , screenHeight);
				ctx.stroke();
				ctx.strokeStyle="#C5C5C5";
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
				ctx.strokeStyle="#505050";
				ctx.beginPath();
				ctx.moveTo(0 , screeny * screenScale);
				ctx.lineTo(screenWidth , screeny * screenScale);
				ctx.stroke();
				ctx.strokeStyle="#C5C5C5";
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