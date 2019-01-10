//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var graphingPoints = false;
var graphPointXs = [];//		X coordinates to graph
var graphPointUndoXs = [[]];

//		these are used in KeyboardMoudeInput.js to add graphed points at min/max
var minMax = false;
var minMaxX = 0;

//		----------------------------------------------------		[   Add/Remove Graphed Points   ]		----------------------------------------------------
function addGraphedPoint(xx){//		input is mouse x position in screen coordinates
	graphingPoints = true;
	if(usePolar){//		copied from the start of cursorPosition()
		tmpx = mouseX/screenScale + screenx;//		mouse position in world space
		theta = math.atan(-(mouseY/screenScale - screeny)/(tmpx));
		if(tmpx < 0){
			theta = Math.PI + theta;
		}else if(-(mouseY/screenScale - screeny) < 0){
			theta = _endAngle + theta;
		}
		
		if(ctrlHeld){
			graphPointXs.push(math.round(theta/_piOver2*18)*_piOver2/18);//			snap to 5 degree increments.
		}else{
			graphPointXs.push(theta);
		}
	}else{
		if(ctrlHeld){
			if(minMax)//		snap to min or max
				graphPointXs.push(minMaxX);
			else//		round x input
				graphPointXs.push(Math.round(xx/screenScale + screenx));
		}else{
			graphPointXs.push(xx/screenScale + screenx);
		}
	}
	graphPointUndoXs.push(graphPointXs.slice());//		add the current point list to the undo list
}

function removeGraphedPoint(xx){
	graphingPoints = true;
	
	//		if ctrl is held, round xx to be the screen position where the dot drawn on the line will be
	if(ctrlHeld){
		if(minMax)//		snap to min or max
			xx = (minMaxX - screenx)*screenScale
		else//		round x input
			xx = (Math.round(xx/screenScale + screenx) - screenx)*screenScale;
	}
	
	var dist = 25;
	var point = -1;
	for(i = graphPointXs.length-1 ; i > -1 ; i--){//		find the point in the list closest to the cursor.

		if(Math.abs((graphPointXs[i] - screenx)*screenScale - xx) < dist){//		current point is within 25 pixels (or closest point yet) of the cursor horizontally
			point = i;
			dist = Math.abs((graphPointXs[i] - screenx)*screenScale - xx);
		}
	}
	if(point != -1){//		a point was within 25 pixels of the cursor
		graphPointXs.splice(point , 1);//		remove the point selected by the for loop
		graphPointUndoXs.push(graphPointXs.slice());//		add the current point list to the undo list
	}
}

function clearGraphedPoints(){
	graphingPoints = false;
	graphPointXs = [];
	graphPointUndoXs.push(graphPointXs.slice());//		add the current point list to the undo list
}

function undoGraphedPoints(){
	if(graphPointUndoXs.length > 2){
		graphingPoints = true;
		graphPointXs = graphPointUndoXs[graphPointUndoXs.length-2];
		graphPointUndoXs.pop();//		delete the last graphed point in the list
	}else if(graphPointUndoXs.length == 2){//		there is only one entry left and no points are currently graphed.
		graphingPoints = false;
		graphPointXs = [];
		graphPointUndoXs.pop();
	}
}

//		----------------------------------------------------		[   Graphed Points   ]		----------------------------------------------------
function drawGraphedPoints(){
	if(useRender || useCutscene)
		return;
	ctx.font = "25px Arial";
	ctx.fillStyle = _graphedPointColor;
	ctx.strokeStyle = _graphedPointColor;

	for(i = graphPointXs.length-1 ; i > -1 ; i--){
		tmpx = graphPointXs[i];
		tmpy = equation(tmpx);
		
		
		if(usePolar){
			dx = tmpy * math.cos(tmpx);
			dy = tmpy * math.sin(tmpx);
			ctx.fillText( '(' + (Math.round(tmpy*100)/100).toString() + ',' + (Math.round(tmpx*100)/100).toString() + ')',
				(dx - screenx)*screenScale + 5 ,
				-(dy-screeny)*screenScale);
			
			
			//		draw dot on graph at coordinates above
			drawCircle(dx , dy , 4);
		}else{
			ctx.fillText( '(' + (Math.round(tmpx*100)/100).toString() + ',' + (Math.round(tmpy*100)/100).toString() + ')', (tmpx - screenx)*screenScale + 5 , -(tmpy-screeny)*screenScale);
			//		draw dot on graph at coordinates above
			drawCircle(tmpx , tmpy , 4);
		}
	}
}

//	----------------------------------		[   Display coordinates on line near cursor   ]		----------------------------------
function cursorPosition(){
	if(useRender || useCutscene)
		return;
	
	tmpx = mouseX/screenScale + screenx;//		mouse position in world space
	
	
	if(usePolar){
		theta = math.atan(-(mouseY/screenScale - screeny)/(tmpx));//		theta = θ
		
		//		This ↓  makes theta go from 0 to 2PI as it makes a full circle around the origin instead of jumping around as arctan(y/x) does.
		if(tmpx < 0){//		left of Y axis.
			theta = Math.PI + theta;
		}else if(-(mouseY/screenScale - screeny) < 0){//		below X axis
			theta = _endAngle + theta;
		}
		
		tmpy = equation(theta);
	}else{
		tmpy = equation(tmpx);//		y position on main line at mouse's x position
	}
	
	//		set text and dot color to blue to increase readability
	ctx.fillStyle = _graphedCursorColor;
		
	//		show mouse X and Y on screen
	if(usePolar){
		ftmp = mouseY/screenScale - screeny;
		ftmp = math.sqrt(tmpx*tmpx + ftmp*ftmp);
		if(Math.abs((tmpy + screeny) * screenScale - ftmp) > 50){//		if the cursor is more than 50 pixels radially from the line's point, display the cursor's coordinates
			ctx.fillText( "r = " + Math.round(ftmp*100)/100 + ", θ = " + Math.round(theta*100)/100 + "radians",
			Math.max(Math.min(mouseX , Math.round(screenWidth - 300)) , 10) ,
			Math.max(Math.min(mouseY , Math.round(screenHeight - 100)) , 110));
		}
	}else{
		if(Math.abs(mouseY - (screeny - tmpy)*screenScale) > 50){//		if the cursor is more than 50 pixels vertically from the line's point, display the cursor's coordinates
			ctx.fillText( "X = " + (Math.round((mouseX/screenScale + screenx)*100)/100).toString() + " Y = " + (Math.round((mouseY/screenScale - screeny)*100)/100).toString(),
			Math.max(Math.min(mouseX , Math.round(screenWidth - 300)) , 10) ,
			Math.max(Math.min(mouseY , Math.round(screenHeight - 100)) , 110));
		}
	}
	
	//	----------------------------------		[   Local Minima/Maxima Check   ]		----------------------------------
	if(!usePolar){
		var selectDist = 7/Math.sqrt(screenScale);//		2x gap between ltmp and rtmp
		minMax = false;
		
		lyy = equation(tmpx - selectDist);//		y value at point left of selected point
		ryy = equation(tmpx + selectDist);//		y value at point right of selected point
		
		//		check if close to local minima or maxima (point slightly to the right < selected point's y value and point slightly to the left < selected point's y value)
		if(ryy < tmpy && lyy < tmpy){
	//		 = "Local Maxima:";
			minMax = true;
		}else if(ryy > tmpy && lyy > tmpy){
	//		 = "Local Minima:";
			minMax = true;
		}
	}
	
	
		//	----------------------------------		[   X and Y intercept {Polar}   ]		----------------------------------
	if(usePolar){
		if(math.abs((theta+0.1)%_piOver2) < 0.2){//		less than 0.1 radians from an axis
			
			dx = (dy * math.cos(ftmp) - screenx)*screenScale;
			dy = (-dy * math.sin(ftmp) + screeny)*screenScale;
		
			ctx.strokeStyle = _graphedInterceptColor;
			ftmp = math.round(theta / _piOver2) * _piOver2;
			dy = equation(ftmp);
			drawCircle(dy * math.cos(ftmp) , dy * math.sin(ftmp) , 4);
		
			ctx.fillText( "Intercept:",
				Math.max((dy * math.cos(ftmp) - screenx)*screenScale - 120) ,
				Math.max((-dy * math.sin(ftmp) + screeny)*screenScale + 32));
				
			ctx.fillText( "θ = " + Math.round(ftmp/Math.PI*100)/100 + "π r = " + Math.round(dy*100)/100,
				Math.max((dy * math.cos(ftmp) - screenx)*screenScale - 120) ,
				Math.max((-dy * math.sin(ftmp) + screeny)*screenScale + 72));
		}
	}else{
		//	----------------------------------		[   Y intercept (where x = 0)   ]		----------------------------------
		if(Math.abs(tmpx) < selectDist/2){//		(use selectDist/2 so the player has to get twice as close to 0 to label it)
			ctx.strokeStyle = _graphedInterceptColor;
			drawCircle(0 , equation(0) , 4);
		
			ctx.fillText( "Y intercept:",
				Math.max((0 - screenx)*screenScale - 180) ,
				Math.max(-(equation(0) - screeny)*screenScale - 42));
				
			ctx.fillText( "X = 0 Y = " + (Math.round(equation(0)*100)/100).toString(),
				Math.max((0 - screenx)*screenScale - 180) ,
				Math.max(-(equation(0) - screeny)*screenScale - 12));
		}
		
		
		//	----------------------------------		[   X intercept (where y = 0)   ]		----------------------------------
		if(Math.sign(lyy) != Math.sign(ryy) || Math.sign(lyy) != Math.sign(tmpy)){
			ltmp = tmpx - selectDist;//		left x value
			rtmp = tmpx + selectDist;//	right x value
			ftmp = selectDist;
			
			//		unlike the Min/Max for loop, here I move both left and right points so if I overshoot the X intercept, it will eventually make it back
			for(i = 0 ; i < 35 ; i++){//		covering an area of x, the precision will be x/2^25 = 0.0000122
				if(Math.abs(lyy) < Math.abs(ryy)){//		y value is closer to 0 on the left side
					rtmp -= ftmp/1.5;//		shift right x value to where the center used to be
					ryy = equation(rtmp);//		set right y value to center y value
					ltmp -= ftmp/4;
					lyy = equation(ltmp);
				}else{
					ltmp += ftmp/1.5;
					lyy = equation(ltmp);
					rtmp += ftmp/4;
					ryy = equation(rtmp);
				}
				ftmp *= 0.75;//		half the gap between left and right
			}
			
			centerY = equation((ltmp+rtmp)/2);
			
			ctx.strokeStyle = _graphedInterceptColor;
			
			drawCircle((ltmp+rtmp)/2 , centerY , 4);
		
			ctx.fillText("X intercept:",
				Math.max(((ltmp+rtmp)/2 - screenx)*screenScale + 5) ,
				Math.max(-(centerY - screeny)*screenScale + 32));
		
			ctx.fillText( "X = " + (Math.round((ltmp+rtmp)/2*100)/100).toString() + " Y = 0",
				Math.max(((ltmp+rtmp)/2 - screenx)*screenScale + 5) ,
				Math.max(-(centerY - screeny)*screenScale + 62));
		}
		
		
		//	----------------------------------		[   Local Minima/Maxima Find   ]		----------------------------------
		if(minMax){
			ltmp = tmpx - selectDist;//		left x value
			rtmp = tmpx + selectDist;//	right x value
			dtmp = tmpy;//		center y value
			ftmp = selectDist;
			
			for(i = 0 ; i < 25 ; i++){//		covering an area of x, the precision will be x/2^25 = 0.0000122
				if(Math.abs(lyy - dtmp) < Math.abs(ryy - dtmp)){//		slope is less (closer to maxima) on the left side
					rtmp -= ftmp;//		shift right point to where the center used to be
					ryy = dtmp;//		set right y value to center y value
					dtmp = equation(ltmp + ftmp/2);//		shift center y ftmp/2 to the left
				}else{
					ltmp += ftmp;
					lyy = dtmp;
					dtmp = equation(rtmp - ftmp/2);
				}
				ftmp *= 0.5;//		half the gap between left and right
			}

			minMaxX = (ltmp+rtmp)/2;
			
			if(ryy > tmpy){
				ctx.fillText("Local Maxima:",
					Math.max(Math.min(((ltmp+rtmp)/2 - screenx)*screenScale + 5  , Math.round(screenWidth - 300)) , 10) ,
					Math.max(Math.min(-(dtmp - screeny)*screenScale - 42 , Math.round(screenHeight - 170)) , 40));

				ctx.fillText("X = " + (Math.round(minMaxX*1000)/1000).toString() + "\nY = " + (Math.round(dtmp*1000)/1000).toString(),
					Math.max(Math.min(((ltmp+rtmp)/2 - screenx)*screenScale + 5 , Math.round(screenWidth - 300)) , 10) ,
					Math.max(Math.min(-(dtmp - screeny)*screenScale - 12, Math.round(screenHeight - 140)) , 70));
			}else{
				ctx.fillText("Local Minima:",
					Math.max(Math.min(((ltmp+rtmp)/2 - screenx)*screenScale + 5  , Math.round(screenWidth - 300)) , 10) ,
					Math.max(Math.min(-(dtmp - screeny)*screenScale + 32 , Math.round(screenHeight - 170)) , 40));

				ctx.fillText("X = " + (Math.round(minMaxX*1000)/1000).toString() + "\nY = " + (Math.round(dtmp*1000)/1000).toString(),
					Math.max(Math.min(((ltmp+rtmp)/2 - screenx)*screenScale + 5 , Math.round(screenWidth - 300)) , 10) ,
					Math.max(Math.min(-(dtmp - screeny)*screenScale + 62, Math.round(screenHeight - 140)) , 70));
			}
			
			//		draw dot at maxima
			ctx.strokeStyle = _graphedMinMaxColor;
			drawCircle(minMaxX , dtmp , 4);
		}
	}
	
	if(ctrlHeld){//		round x input
		if(minMax)//		if ctrl is held and you are near a min or max, just graph that
			return;
		if(usePolar){
			theta = math.round(theta/_piOver2*18)*_piOver2/18;//		snap to 5 degree increments. theta is in radians which is why the math looks complicated
			tmpy = equation(theta);
		}else{
			tmpx = Math.round(tmpx);
			tmpy = equation(tmpx);
		}
	}
	
	//		set text and dot color to graphed cursor point color again
	ctx.strokeStyle = _graphedCursorColor;
	ctx.fillStyle = _graphedCursorColor;
	
	
		
	//		draw dot on graph at coordinates above
	if(usePolar){
		//		get screen position of point on line being labeled
		dx = (tmpy * math.cos(theta) - screenx)*screenScale;
		dy = (-tmpy * math.sin(theta) + screeny)*screenScale;
		
		//		Draw arc angle from X axis to radius going to the mouse
		ctx.beginPath();
		ctx.arc( -screenx*screenScale , screeny*screenScale , 40 , -theta , 0);
		ctx.stroke();
		
		//		Lable angle
		ctx.fillText( "θ = " + Math.round(theta/Math.PI*1000)/1000 + "π radians" ,
		Math.max(Math.min(-screenx*screenScale + 40 , Math.round(screenWidth - 270)) , 10) ,
		Math.max(Math.min(screeny*screenScale - 12 , Math.round(screenHeight - 100)) , 110));
		
		ctx.fillText( "θ = " + Math.round(theta*10/_piOver2*90)/10 + "°",
		Math.max(Math.min(-screenx*screenScale + 40 , Math.round(screenWidth - 270)) , 10) ,
		Math.max(Math.min(screeny*screenScale + 38 , Math.round(screenHeight - 100)) , 80));
		
		ctx.fillText( "r = " + Math.round(tmpy*100)/100,
		Math.max(Math.min(dx - 110 , Math.round(screenWidth - 270)) , 10) ,
		Math.max(Math.min(dy - 12 , Math.round(screenHeight - 100)) , 110));
			
		
		drawCircle(tmpy * math.cos(theta) , tmpy * math.sin(theta) , 4);
		
		//		if you are zoomed in enough compared to the radius you are measuring so that the screen won't be crowded by all the text
		//			then write the X and Y components of the point selected to the screen.
		if(tmpy*screenScale > 400){//		Only show if radius is more than 400 pixels
			ctx.strokeStyle = _graphedMinMaxColor;
			ctx.fillStyle = _graphedMinMaxColor;

			ftmp = tmpy * math.cos(theta);
			//		X
			ctx.beginPath();
			ctx.moveTo(-screenx*screenScale , screeny*screenScale);//		origin
			//		Y
			ctx.lineTo(dx , screeny*screenScale);
			ctx.lineTo(dx , dy);//		point on arc
			ctx.stroke();
			
			
			ctx.fillText( "X=r*cos(" + math.round(theta*100)/100 + ")=" + Math.round(tmpy * math.cos(theta)*100)/100,
				(-screenx*screenScale + dx)/2 - 100 ,//		center below dX line 
				screeny*screenScale + 80);//		80 pixels below line
				
			ctx.fillText( "Y=r*sin(" + math.round(theta*100)/100 + ")=" + Math.round(tmpy * math.sin(theta)*100)/100,
				dx + 10,//		10 pixels right of line
				(screeny*screenScale + dy)/2) + 30;//		center of dY line
			
			
		}
		
	}else{
		//		show mouse X and corresponding graph Y on screen
		//		the Math.max(Math.min( section is to keep the text on screen
		ctx.fillText( "X = " + Math.round(tmpx*100)/100 + " Y = " + Math.round(tmpy*100)/100,
			Math.max(Math.min((tmpx - screenx)*screenScale - 110 , Math.round(screenWidth - 270)) , 10) ,
			Math.max(Math.min(-(tmpy -screeny)*screenScale - 12 , Math.round(screenHeight - 100)) , 110));
		
		drawCircle(tmpx , tmpy , 4);
	}
	
	
	if(usePolar){
		//		draw line from origin to mouse through graphed point
		ctx.lineWidth = 2;
		ctx.beginPath();
		if(tmpy > 0)//		point is between origin and mouse (radius is positive)
			ctx.moveTo(-screenx*screenScale , screeny*screenScale);
		else//		radius is positive. Draw line from graphed point to mouse instead
			ctx.moveTo(dx , dy);
		ctx.lineTo(mouseX , mouseY);
		ctx.stroke();
	}else{
		//		draw red deletion bars around the point graphed
		ctx.strokeStyle = _graphedDeletionColor;
		ctx.beginPath();
		ctx.moveTo((tmpx - screenx)*screenScale - 25 , -(tmpy-screeny)*screenScale + 100);
		ctx.lineTo((tmpx - screenx)*screenScale - 25 , -(tmpy-screeny)*screenScale - 100);
		ctx.moveTo((tmpx - screenx)*screenScale + 25 , -(tmpy-screeny)*screenScale + 100);
		ctx.lineTo((tmpx - screenx)*screenScale + 25 , -(tmpy-screeny)*screenScale - 100);
		ctx.stroke();
	}
}

//		takes an x and y position in world space and a radius in pixels and draws a circle
function drawCircle(xx , yy , rr){
	ctx.beginPath();
	ctx.arc( (xx-screenx)*screenScale , -(yy-screeny)*screenScale , rr , 0 , _endAngle);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}


