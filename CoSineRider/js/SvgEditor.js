//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var selectedPoint = 8;
var mouseLastX = 0.0;
var mouseLastY = 0.0;
var draggingPoint = false;
var draggingScreen = false;
//		dragScreenX and Y are the coordinates at the center of the screen, making the zooming math simpler
var dragScreenX = 0;
var dragScreenY = 0;
var dragScreenScale = 15;
var showSVGPoints = false;


//		create load file button and hide
var svgFileSelector = document.createElement('input');
svgFileSelector.setAttribute('type' , 'file');
svgFileSelector.setAttribute('accept' , ".svg");
svgFileSelector.setAttribute('onchange' , "svgHandleFiles(this.files)");
svgFileSelector.setAttribute('display' , "none");


document.addEventListener("keydown", function(e){
	
	if(e.keyCode == 221){//		]
		e.preventDefault();
		svgFileSelector.click();//		open file selector
	}
	if(e.keyCode == 219){//		]
		e.preventDefault();
		saveExternalSVG();
	}
});

//		read .csv, store in csvInputString, and run csvLoad()
function svgHandleFiles(files){
	if(window.FileReader){
		var reader = new FileReader();
		// Read file into memory as UTF-8      
		reader.readAsText(files[0]);
		// Handle errors load
		reader.onload = svgLoadHandler;
		reader.onerror = svgError;
	}else{
		alert('FileReader is not supported in this browser.');
	}
}

function svgLoadHandler(event) {
	loadCollidersFromSvg(event.target.result);//		load colliders into current level
	console.log("checkpoints");
	console.log(checkx);
	console.log(goalx);
}

function svgError(){
	alert("Can't read file")
}


function drawSVGColliders(){//		called from the end of Collisiions.js
	if(useScreenLimit){
		ctx.beginPath();
		ctx.arc( screenWidth/2 , screenHeight/2, 5 , 0 , _endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	
		ctx.beginPath();
		ctx.moveTo((checkScreenx[0]-screenx)*screenScale , (-checkScreeny[0]+screeny)*screenScale);
		ctx.lineTo((checkScreenx[0]-screenx)*screenScale , (-checkScreeny[1]+screeny)*screenScale);
		ctx.lineTo((checkScreenx[1]-screenx)*screenScale , (-checkScreeny[1]+screeny)*screenScale);
		ctx.lineTo((checkScreenx[1]-screenx)*screenScale , (-checkScreeny[0]+screeny)*screenScale);
		ctx.lineTo((checkScreenx[0]-screenx)*screenScale , (-checkScreeny[0]+screeny)*screenScale);
		ctx.stroke();
		
		ctx.lineWidth = 10;
		ctx.strokeStyle="#900000";
		ctx.beginPath();
		ctx.moveTo((checkScreenx[0]-60-screenx)*screenScale , (-checkScreeny[0]+40+screeny)*screenScale);
		ctx.lineTo((checkScreenx[0]-60-screenx)*screenScale , (-checkScreeny[1]-40+screeny)*screenScale);
		ctx.lineTo((checkScreenx[1]+60-screenx)*screenScale , (-checkScreeny[1]-40+screeny)*screenScale);
		ctx.lineTo((checkScreenx[1]+60-screenx)*screenScale , (-checkScreeny[0]+40+screeny)*screenScale);
		ctx.lineTo((checkScreenx[0]-60-screenx)*screenScale , (-checkScreeny[0]+40+screeny)*screenScale);
		ctx.stroke();
	}
	
	
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
				console.log("selected " + selectedPoint);
		if(draggingPoint){//		Point being dragged has a light blue dot over it
			ctx.strokeStyle="#00FFFF";
			ctx.fillStyle = "#00FFFF";

			/*ctx.beginPath();
			ctx.arc((allGroundPointsX[selectedPoint]-screenx)*screenScale , (allGroundPointsY[selectedPoint]+screeny)*screenScale , 3+0.2*screenScale , 0 , _endAngle);
			ctx.stroke();
			ctx.closePath();
			ctx.fill();
			ctx.stroke();*/
			drawCircle(allGroundPointsX[selectedPoint] , -allGroundPointsY[selectedPoint] , 3+0.2*screenScale);
		}else{//		Point hovered over is circled in blue
			ctx.strokeStyle="#0080FF";
			ctx.beginPath();
			ctx.arc((allGroundPointsX[selectedPoint]-screenx)*screenScale , (allGroundPointsY[selectedPoint]+screeny)*screenScale , 3+0.2*screenScale , 0 , _endAngle);
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
			moveScreen();
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
		svgCode += " " +  String(Math.round(allGroundPointsX[i]*500+100000)/100) + " " + String(Math.round(allGroundPointsY[i]*500)/100);
		if(i == 0 || !allGroundBreaks[i-1]){//	first point of new line
			if(i == 0)//		last line
				svgCode += '" stroke="#000000" stroke-width="1.5"/>\n';
			else
				svgCode += '" stroke="#000000" stroke-width="1.5"/>\n  <path d="M';
		}
	}
	
	svgCode += '  <circle id="Goal" cx="' + (Math.round(goalx*50+10000)/10) + '" cy="' + (Math.round(-goaly*50)/10) + '" r="' + (Math.round(goalr*50)/10) + '" stroke="' + _goalColor + '"/>\n';
	
	for(i = checkx.length-1 ; i > -1 ; i--){
		//		record X and Y coordinates with 1 decimal place with spaces between them
		svgCode += '  <circle cx="' + (Math.round(checkx[i]*50+10000)/10) + '" cy="' + (Math.round(-checky[i]*50)/10) + '" r="' + (Math.round(checkr[i]*50)/10) + '" stroke="' + _checkpointColor + '"/>\n';
	}
	
	svgCode += ' </g>\n</svg>';
	
    var downloadFile = document.createElement('a');
	downloadFile.href = window.URL.createObjectURL(new Blob([svgCode], {type: 'text/svg'}));
	downloadFile.download = 'Level.svg';
	document.body.appendChild(downloadFile);
	downloadFile.click();
	document.body.removeChild(downloadFile);
}
