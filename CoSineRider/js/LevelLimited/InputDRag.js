
//		set by LevelLoader.js
var dragEquGaps = [];//		stoed as [,*x+ , +t/,+2]. If it starts with a dragable value, the first value is blank.
var dragVar = [];
var dragDirection = [];//		= h or v for hoizontal or vertical
var dragx = [];//		x coordinate of each handle point
var dragy = [];
var dragDefaultx = [];
var dragDefaulty = [];
var dragDependent0 = [];
var dragDependent1 = [];
var dragDependent2 = [];

var dragStart = 0;//		screen position of cursor when point is clicked
var dragPointIndex = -1;

var dragEquFormatted;

//	----------------------------------		[   Set up Drag Level   ]		----------------------------------
function dragInitialize(){//		called from LevelLoader.js
	activeInput = mainInput;//		set the active input field to the only input field
	containsVariables = true;//		If this happens to be set to false when this level is loaded, it won't be corrected at any other point in the level.
	
	//		make input field un-editable
	mainInput.setAttribute("contentEditable" , "false");
	mainInput.style.backgroundColor = _inputLockedColor;
	mainInput.style.display = "block";
	dragScreenResize();
	
	//		set the default equation to be the given equation with the gaps replaced with the default values
	dragUpdateEqu();
	
	//		set up Math.js equation parser
	scope = {x: 0 , t: 0 , z: 0};
	equInput = math.parse(equRaw , scope);
	equCompiled = equInput.compile();
	
	dragUpdatePoints();
}
/*
function dragUndoRedo(undo){//		true = undo, false = redo
	if(undo){
		if(equCurrentUndo == 0){//		nothing available to undo
			equExecutingUndo = false;
			return;
		}
		equCurrentUndo--;
	}else{
		if(equCurrentUndo > equUndo.length-2){//		nothing available to redo
			equExecutingUndo = false;
			return;
		}
		equCurrentUndo++;
	}
	mainInput.innerHTML = equUndo[equCurrentUndo];
	typeCheckInput();// is called from OnKeyUp, so this call is unnessisary except for when someone holds Ctrl+Z
}*/

function dragUpdateEqu(){//		concatinate string fragments of equation and variables to form full equation. Also form colored version for the Input text box.
	equRaw = "";
	dragEquFormatted = "";
	//		
	for(i = 0 ; i < dragEquGaps.length-1 ; i++){
		equRaw += dragEquGaps[i];
		dragEquFormatted += dragEquGaps[i];
		equRaw += dragVar[i];
		
		if(dragPointIndex == -1 || dragPointIndex == i){//		current point is being dragged or no point is being dragged, color all handle points
			dragEquFormatted += '<a style="color:' + _colors[i] + '">' + dragVar[i] + '</a>';
		}else{//						a point is being dragged and it isn't this one, let color be default
			dragEquFormatted += dragVar[i];
		}
	}
	equRaw += dragEquGaps[dragEquGaps.length-1];
	mainInput.innerHTML = dragEquFormatted;
}

//		called every frame from Main.js
//	----------------------------------		[   MAIN   ]		----------------------------------
function dragMain(){
	//		move handle points if one is being dragged
	if(dragPointIndex != -1){//		is set back to -1 by KeyboardMouseInput.js in mouseUp()
		var dmouse;//		change in mouse position in screen space
		var sign;//			sign must be inverted when using the y axis
	
		if(dragDirection[dragPointIndex] == 'x'){//		drag along the X
			dmouse = mouseX - dragStart;
			sign = 1;
		}else{
			dmouse = -mouseY + dragStart;
			sign = -1;
		}
		
		if(ctrlHeld){//		move by incraments of 1
			if(math.abs(dmouse/screenScale) > 0.1){//		number will not change (since it is rounded to the nearest 0.001) so return
				dragVar[dragPointIndex] = Math.round((dragVar[dragPointIndex] + dmouse/screenScale)*10)/10;
				dragStart += sign * Math.round(dmouse/screenScale*10)/10*screenScale;
				dragUpdateEqu();
				dragCheckInput();
			}
		}else if(shiftHeld){//		move by incraments of 0.00001
			if(math.abs(dmouse/screenScale) > 0.00001){//		number will not change (since it is rounded to the nearest 0.001) so return
				dragVar[dragPointIndex] = Math.round((dragVar[dragPointIndex] + dmouse/screenScale)*100000)/100000;
				dragStart += sign * Math.round(dmouse/screenScale*100000)/100000*screenScale;
				dragUpdateEqu();
				dragCheckInput();
			}
		}else{//		move by incraments of 0.001
			if(math.abs(dmouse/screenScale) > 0.001){//		number will not change (since it is rounded to the nearest 0.001) so return
				dragVar[dragPointIndex] = Math.round((dragVar[dragPointIndex] + dmouse/screenScale)*1000)/1000;
				dragStart += sign * Math.round(dmouse/screenScale*1000)/1000*screenScale;
				dragUpdateEqu();
				dragCheckInput();
			}
		}
		
		//		update all point positions based on the new values set above
		dragUpdatePoints();
	}
	
	
	//	----------------------------------		[   Draw Handle Points   ]		----------------------------------
	if(!simulating){
		ctx.lineWidth = 3;

		for(i = dragVar.length-1 ; i > -1 ; i--){
			if(dragPointIndex == -1 || dragPointIndex == i){//		current point is being dragged or no point is being dragged, color all handle points
				ctx.strokeStyle = _colors[i]; 
			}else{//						a point is being dragged and it isn't this one, set color to grey
				ctx.strokeStyle = _dragFadeColor;
			}
			
			//		global temp variables. Convert points to screen space.
			tmpx = (dragx[i] - screenx)*screenScale;
			tmpy = -(dragy[i]-screeny)*screenScale;
			
			//		draw point
			ctx.beginPath();
			ctx.arc( tmpx , tmpy , 4 , 0 , _piTimes2);
			ctx.stroke();
			
			//		draw move direction arrows
			ctx.beginPath();
			if(dragDirection[i] == 'x'){
				ctx.moveTo(tmpx + 13 , tmpy + 7);
				ctx.lineTo(tmpx + 20, tmpy);
				ctx.lineTo(tmpx + 13 , tmpy - 7);
				
				ctx.moveTo(tmpx + 17 , tmpy);
				ctx.lineTo(tmpx - 17 , tmpy);
				
				ctx.moveTo(tmpx - 13 , tmpy + 7);
				ctx.lineTo(tmpx - 20, tmpy);
				ctx.lineTo(tmpx - 13 , tmpy - 7);
			}else{
				ctx.moveTo(tmpx-7 , tmpy + 13);
				ctx.lineTo(tmpx , tmpy + 20);
				ctx.lineTo(tmpx+7 , tmpy + 13);
				
				ctx.moveTo(tmpx , tmpy + 17);
				ctx.lineTo(tmpx , tmpy - 17);
				
				ctx.moveTo(tmpx-7 , tmpy - 13);
				ctx.lineTo(tmpx , tmpy - 20);
				ctx.lineTo(tmpx+7 , tmpy - 13);
			}
			ctx.stroke();
		}
	}
}

//		update the position of all handle points
function dragUpdatePoints(){
	for(i = dragVar.length-1 ; i > -1 ; i--){
		tmpx = 0;//		temporary value to be modified by other points' values and added to the current point's display position
		tmpy = 0;
		
		if(dragDependent0[i] != -1){//	this point's position is offset by the value of another point
			if(dragDirection[dragDependent0[i]] == 'x'){//		X is inherited from the specified point
				tmpx = dragVar[dragDependent0[i]];
			}else{//		Y is inherited from the specified point
				tmpy = dragVar[dragDependent0[i]];
			}
		}
		
		if(dragDependent1[i] != -1){//	this point's position is offset by the value of another point
			if(dragDirection[dragDependent1[i]] == 'x'){
				tmpx += dragVar[dragDependent1[i]];
			}else{
				tmpy += dragVar[dragDependent1[i]];
			}
		}
		
		if(dragDependent2[i] != -1){//	multiply this point's default position by the value of another point and offset this point by the result
			if(dragDirection[dragDependent2[i]] == 'x'){
				tmpx += dragVar[dragDependent2[i]] * dragDefaultx[i] - dragDefaultx[i];//	subtract dragDefaultx[i] to negate it's addition below
			}else{
				tmpy += dragVar[dragDependent2[i]] * dragDefaulty[i] - dragDefaulty[i];//	dragDefaultx[i] is used as a multiplier now, not an offset
			}
		}
		
		if(dragDirection[i] == 'x'){//		drag along the X
			dragx[i] = dragDefaultx[i] + tmpx + dragVar[i];
			dragy[i] = dragDefaulty[i] + tmpy;
		}else{
			dragx[i] = dragDefaultx[i] + tmpx;
			dragy[i] = dragDefaulty[i] + tmpy + dragVar[i];
		}
	}
}

//		activated by screen resize
function dragScreenResize(){
	equInputField = mainInput.style;
	equInputField.left = "55px";
	
	console.log('dragScreenResize');
	
	equInputField.top = Math.round(screenHeight  - 85) + "px";
	equInputField.width = Math.round(screenWidth * 0.925) + "px";
	if(equInvalid || !containsVariables)
		yEqualsText.style.top = (screenHeight-95) + "px";
	else
		yEqualsText.style.top = (screenHeight-50) + "px";
	
	if(useDerivative){
		yPrimeEqualsText.style.top = (parseInt(yEqualsText.style.top) - 50) + "px";
	}
}

function dragShowHideInputs(showHide){
	mainInput.style.display = showHide;
}

//			check if the player has clicked on a drag point
function dragMouseDown(xxx , yyy){
	var dx;
	var dy;
	for(i = dragVar.length-1 ; i > -1 ; i--){//		check all handle points
		dx = dragx[i] - (xxx/screenScale + screenx);
		dy = -dragy[i] - (yyy/screenScale - screeny);
		if(dx*dx + dy*dy < 625/(screenScale*screenScale)){//		clicked within 25 [(625)^0.5] pixels of a point
			dragPointIndex = i;
				
			if(dragDirection[dragPointIndex] == 'x'){//		drag in the X direction
				dragStart = xxx;
			}else{//		drag in the Y direction
				dragStart = yyy;
			}
			return;
		}
	}
	dragPointIndex = -1;//		drag main checks if this is still -1 every frame
}


function dragCheckInput(){
	//		compile equRaw through Math.js parser so it can be used by EquationLine.js
	equInput = math.parse(equRaw , scope);
	equCompiled = equInput.compile();
	equInvalid = false;
}
