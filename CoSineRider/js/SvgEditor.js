//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var selectedPoint = 8;
var mouseLastX = 0.0;
var mouseLastY = 0.0;
var draggingPoint = false;
var draggingScreen = false;
var dragScreenX = 0;//		dragScreenX and Y are the coordinates at the center of the screen, making the zooming math simpler
var dragScreenY = 0;
var dragScreenScale = 15;

function drawSVGColliders(){//		called from the end of Collisiions.js

	ctx.lineWidth = screenScale/3;

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

//		----------------------------------------------------		[   Mouse Move   ]		----------------------------------------------------
function updateMousePosition(e){
	var evt = e==null ? event : e;//		firefox compatibility	
	mouseLastX = mouseX;
	mouseLastY = mouseY;
	mouseX = evt.clientX;
	mouseY = evt.clientY;
	
	if(!simulating || !camLocked){//		run when camera is not locked

		if(!simulating && showSVGPoints && draggingPoint && selectedPoint != -1){//		highlight selected point and move with cursor if (not running, points are visible, mouse held down, and a point is under the cursor)
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
			if(useRender)
				renderCenter();//		see 2dRender.js
		}
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
