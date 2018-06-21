//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var selectedPoint = 8;
var mouseLastX = 0.0;
var mouseLastY = 0.0;
var mouseX = 0.0;
var mouseY = 0.0;
var draggingPoint = false;
var draggingScreen = false;
var dragScreenX = 0;//		dragScreenX and Y are the coordinates at the center of the screen, making the zooming math simpler
var dragScreenY = 0;
var dragScreenScale = 15;
var graphingPoints = false;
var graphPointXs = new Array();//		X coordinates to graph

function drawSVGColliders(){//		called from the end of Collisiions.js

	ctx.strokeStyle.lineWidth = 30;

	ctx.strokeStyle="#900000";

	ctx.beginPath();
	for(i = allGroundPointsX.length-1 ; i > -1 ; i--){
		if(allGroundBreaks[i]){//		line continues
			ctx.lineTo((allGroundPointsX[i]-screenx)*screenScale , (allGroundPointsY[i]+screeny)*screenScale);
		}else if(i == 0 || allGroundBreaks[i-1]){//	first point of new line
			ctx.moveTo((allGroundPointsX[i]-screenx)*screenScale , (allGroundPointsY[i]+screeny)*screenScale);
		}
	}
	ctx.stroke();
	
	if(selectedPoint != -1){//		highlight selected point and move with cursor
		if(draggingPoint){//		Point being dragged has a light blue dot over it
			ctx.strokeStyle="#00FFFF";
			ctx.beginPath();
			ctx.arc((allGroundPointsX[selectedPoint]-screenx)*screenScale , (allGroundPointsY[selectedPoint]+screeny)*screenScale , 3+0.2*screenScale , 0 , endAngle);
			ctx.stroke();
			ctx.fillStyle = "#00FFFF";
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}else{//		Point hovered over is circled in blue
			ctx.strokeStyle="#0080FF";
			ctx.beginPath();
			ctx.arc((allGroundPointsX[selectedPoint]-screenx)*screenScale , (allGroundPointsY[selectedPoint]+screeny)*screenScale , 3+0.2*screenScale , 0 , endAngle);
			ctx.stroke();
		}
	}
}

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("mousemove", updateMousePosition);


//		----------------------------------------------------		[   Mouse Down   ]		----------------------------------------------------
function mouseDown(e){
	var evt = e==null ? event : e;//		firefox compatibility	
	
	if( evt.which == 1 ){//		left click
		if(useZ){
			xyzMouseDown(evt.clientX , evt.clientY);//		see XYZView.js
		}
	}
	
	if(!simulating || !camLocked){//		run when camera is not locked
		if( evt.which == 2 ) {//		middle click
			evt.preventDefault();
			draggingScreen = true;
			if(dragScreenX == 0){//		the screen is currently in its default position
				dragScreenX = screenx + screenWidth/2/screenScale;
				dragScreenY = -screeny + screenHeight/2/screenScale;
			
				dragScreenScale = screenScale;
			}
		}

		if( evt.which == 3 ){//		right click
			writeCursor = true;
		}

		if( evt.which == 1 ){//		left click
			if(selectedPoint != -1)
				draggingPoint = true;
		
			if(writeCursor){//		add a point to be perminently labled
				graphingPoints = true;
				if(ctrlHeld)//		round x input
					graphPointXs.push(Math.round(evt.clientX/screenScale + screenx));
				else
					graphPointXs.push(evt.clientX/screenScale + screenx);
			}
		}
	}
}

//		----------------------------------------------------		[   Mouse Up   ]		----------------------------------------------------
function mouseUp(e){
	var evt = e==null ? event : e;//		firefox compatibility	

	if( evt.which == 2 ) {//		middle click
		draggingScreen = false;
	}
	
if( evt.which == 1 ){//		left click
		draggingPoint = false;
	}
	
	if( evt.which == 3 ){//		right click
		writeCursor = false;
	}
}

//		----------------------------------------------------		[   Mouse Move   ]		----------------------------------------------------
function updateMousePosition(e){
	if(!simulating || !camLocked){//		run when camera is not locked
		var evt = e==null ? event : e;//		firefox compatibility	
		mouseLastX = mouseX;
		mouseLastY = mouseY;
		mouseX = evt.clientX;
		mouseY = evt.clientY;

		if(draggingPoint && selectedPoint != -1){//		highlight selected point and move with cursor
			allGroundPointsX[selectedPoint] += (mouseX - mouseLastX)/screenScale;
			allGroundPointsY[selectedPoint] += (mouseY - mouseLastY)/screenScale;
		}else{//		highlight closest point
			var dist = 10;
			//		convert mouse space to world space
			dx = (evt.clientX/screenScale)+screenx;
			dy = (evt.clientY/screenScale)-screeny;
			selectedPoint = -1;//		if this remains -1, no point was within 10 meters of the cursor
			for(i = allGroundPointsX.length-1 ; i > -1 ; i--){
				ftmp = dx - allGroundPointsX[i];
				fftmp = dy - allGroundPointsY[i];
				ftmp = ftmp*ftmp+fftmp*fftmp;
				if(ftmp < dist){
					dist = ftmp;
					selectedPoint = i;
				}
			}
		}
		if(draggingScreen){
			dragScreenX -= (mouseX - mouseLastX)/screenScale;
			dragScreenY -= (mouseY - mouseLastY)/screenScale;
		
			screenx = dragScreenX - screenWidth/2/screenScale;
			screeny = -dragScreenY + screenHeight/2/screenScale;
		}
	}
}

//		----------------------------------------------------		[   Scroll Wheel   ]		----------------------------------------------------
document.addEventListener('wheel', function(e){
	if(!simulating || !camLocked){//		run when camera is not locked
		ftmp = 0.25*Math.sign(e.deltaY) - 0.046;//		makes scroll speed brouser independent
		dragScreenScale = Math.min(Math.max(dragScreenScale - ftmp*dragScreenScale , 0.15) , 17000);//		scale is non-linear so multiplying by dragScreenScale makes changes close to linear
		screenScale = dragScreenScale;
		screenx = dragScreenX - screenWidth/2/screenScale;
		screeny = -dragScreenY + screenHeight/2/screenScale;
		//				Zoom twards mouse so mouse does not move on screen (Comment out following 4 lines to zoom on screen center)
		dragScreenX -= ftmp*(mouseX - screenWidth/2)/screenScale;
		dragScreenY -= ftmp*(mouseY - screenHeight/2)/screenScale;
		screenx = dragScreenX - screenWidth/2/screenScale;
		screeny = -dragScreenY + screenHeight/2/screenScale;
	}
});


//		----------------------------------------------------		[   Graphed Points   ]		----------------------------------------------------
function drawGraphedPoints(){
	ctx.font = "25px Arial";
	ctx.fillStyle = "#00A0E0";
	for(i = graphPointXs.length-1 ; i > -1 ; i--){
		dx = graphPointXs[i];
		dy = equation(dx);
		
		ctx.fillText( '(' + (Math.round(dx*100)/100).toString() + ',' + (Math.round(dy*100)/100).toString() + ')', (dx - screenx)*screenScale + 5 , -(dy-screeny)*screenScale);
	
		//		draw dot on graph at coordinates above
		ctx.beginPath();
		ctx.arc( (dx - screenx)*screenScale , -(dy-screeny)*screenScale , 4 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}

//	----------------------------------		[   Display coordinates on line near cursor   ]		----------------------------------
function cursorPosition(){
	dx = mouseX/screenScale + screenx;
	if(ctrlHeld)//		round x input
		dx = Math.round(dx);
	dy = equation(dx);

	//		show mouse X and corisponding graph Y on screen
	ctx.fillText( "X = " + (Math.round(dx*100)/100).toString() + " Y = " + (Math.round(dy*100)/100).toString(),
		Math.max(Math.min(mouseX , Math.round(screenWidth - 600)) , 10) ,
		Math.max(Math.min(mouseY , Math.round(screenHeight - 140)) , 50));
	
	//		draw dot on graph at coordinates above
	ctx.beginPath();
	ctx.arc( (dx - screenx)*screenScale , -(dy-screeny)*screenScale , 4 , 0 , endAngle);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
//	----------------------------------		[   Local Minima/Maxima   ]		----------------------------------
	ftmp = 15/Math.sqrt(screenScale);//		2x gap between ltmp and rtmp
	onOff = false;
	if(equation(dx + ftmp) < dy && equation(dx - ftmp) < dy){//		close to a local maxima
		stmp = "Local Maxima:";
		onOff = true;
	}else if(equation(dx + ftmp) > dy && equation(dx - ftmp) > dy){
		stmp = "Local Minima:";
		onOff = true;
	}
	if(onOff){
		ltmp = dx - ftmp;//		left x value
		lyy = equation(ltmp);//	left y value
		rtmp = dx + ftmp;//	right x value
		ryy = equation(rtmp);//		right y value
		dtmp = dy;//		center y value

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

		ctx.fillText(stmp,
			Math.max(Math.min(mouseX , Math.round(screenWidth - 400)) , 10) ,
			Math.max(Math.min(mouseY-100 , Math.round(screenHeight - 200)) , 50));

		ctx.fillText("X = " + (Math.round((ltmp+rtmp)/2*1000)/1000).toString() + "\nY = " + (Math.round(dtmp*1000)/1000).toString(),
			Math.max(Math.min(mouseX , Math.round(screenWidth - 400)) , 10) ,
			Math.max(Math.min(mouseY-50 , Math.round(screenHeight - 250)) , 100));
		//		draw dot at maxima
		ctx.strokeStyle="#00AAFF";
		ctx.fillStyle=="#00AAFF";
		ctx.beginPath();
		ctx.arc( ((ltmp+rtmp)/2-screenx)*screenScale , -(dtmp-screeny)*screenScale , 4 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle="#000000";
		ctx.fillStyle=="#000000";
	}
}

//		----------------------------------------------------		[   Export SVG   ]		----------------------------------------------------
function saveExternalSVG(){
	if(simulating)
		return;
	var svgCode = '<svg xmlns="http://www.w3.org/2000/svg" height="2000" width="2000" version="1.1" viewBox="0 0 2000 2000">\n <g transform="translate(0 1000)" fill="none">\n';
	svgCode += '  <path d="M';
	for(i = allGroundPointsX.length-1 ; i > -1 ; i--){
		//		record X and Y coordiantes with 2 decimal places with spaces between them
		svgCode += " " +  String(Math.round(allGroundPointsX[i]*500+100000)/100) + " " + String(Math.round(allGroundPointsY[i]*500+5000)/100);
		if(i == 0 || !allGroundBreaks[i-1]){//	first point of new line
			if(i == 0)//		last line
				svgCode += '" stroke="#000000" stroke-width="1.5"/>\n';
			else
				svgCode += '" stroke="#000000" stroke-width="1.5"/>\n  <path d="M';
		}
	}
	svgCode += ' </g>\n</svg>';
	
    var downloadFile = document.createElement('a');
	downloadFile.href = window.URL.createObjectURL(new Blob([svgCode], {type: 'text/svg'}));
	downloadFile.download = 'Level.svg';
	document.body.appendChild(downloadFile);
	downloadFile.click();
	document.body.removeChild(downloadFile);
}
