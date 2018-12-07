//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
/*		File contains:
 *			Equation for line function
 *			Background grid draw
 *			Display point at cursor position (fi shift is held)
 *			Display points in graphPointXs list
 * 
 */

//		equation input
var scope;
var eqinput;
var equCompiled;//		compiled Math.js parsers
var equInvalid = false;
//		All colors have different Hues but the same Saturation and Value 
var colors = ['#d12020', '#3420d1', '#d2a320', '#d120ce', '#206cd1', '#b0d120', '#D15E20', '#7820d1', '#20d120', '#20b0d1'];

//		Text colors, [0-9] Partenthasis, [11] x, [12] t, [13] z
//	"#FF0000" , "#009900" , "#0000FF"];//	10-12
var parenOpen = 0;
var defaultEqu = "-x-5";
var equInputField;
var gridScale = 1;//		scales grid to show 1s, 10s, or 100s based on the screenScale

var graphingPoints = false;
var graphPointXs = [];//		X coordinates to graph

//		temp variables
var minMax = false;



//		-----------------------------------------------------------------------		[   Draw Line   ]		-----------------------------------------------------------------------
function drawLine(){
	if(useRender)//		do not try to draw the line if the equation is an inequality or contans an =. It will almost allways cause problems.
		return;
	ctx.lineWidth = 3;
	//	----------------------------------		[   draw time independent line (light grey)   ]		----------------------------------
	if(useTime){
		//		draw time independent (t=0) equation line in grey
		ctx.strokeStyle="#BBBBBB";
		ctx.beginPath();
		scope = {x: screenx , t: 0 , z: 0};
		ctx.moveTo(0 , (-equ.eval(scope) + screeny)*screenScale);
	
		for(i = lineResolution ; i < screenWidth ; i+=lineResolution){
			scope = {x: i/screenScale + screenx , t: 0 , z: 0};
			ctx.lineTo(i , (-equ.eval(scope) + screeny)*screenScale);
		}
		ctx.stroke();
	}

	//	----------------------------------		[   draw Z max and Z min lines (red and green)   ]		----------------------------------
	if(useZ){
		//		draw equation with Z=5 and -5 in red and green
		ctx.strokeStyle="#BB7060";
		ctx.beginPath();
	//	tempZ = 20;
		scope = {x: screenx , t: frameTime , z: 20};
		ctx.moveTo(0 , (-equ.eval(scope) + screeny)*screenScale);
	
		for(i = lineResolution ; i < screenWidth ; i+=lineResolution){
			scope = {x: i/screenScale + screenx , t: frameTime , z: 20};
			ctx.lineTo(i , (-equ.eval(scope) + screeny)*screenScale);
		}
		ctx.stroke();

		ctx.strokeStyle="#70BB60";
		ctx.beginPath();
		scope = {x: screenx , t: frameTime , z: -20};
		ctx.moveTo(0 , (-equ.eval(scope) + screeny)*screenScale);
	
		for(i = lineResolution ; i < screenWidth ; i+=lineResolution){
			scope = {x: i/screenScale + screenx , t: frameTime , z: -20};
			ctx.lineTo(i , (-equ.eval(scope) + screeny)*screenScale);
		}
		ctx.stroke();
		tempZ = apz;
	}
	//	----------------------------------		[   draw equation line (black)   ]		----------------------------------
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(0 , (-equation(screenx) + screeny)*screenScale);
	
	for(i = lineResolution ; i < screenWidth ; i+=lineResolution){
		//		min and max are used to make sure the line does not go so far off screen that it doesn't render
		ctx.lineTo(i , Math.min( Math.max(-equation(i/screenScale + screenx) + screeny , -10)*screenScale , 2000));
	}
	ctx.stroke();
}

var q = 0;//	intiger to only be used in equation()
function equation(input){
	if(useZ){
		scope = {x: input , t: frameTime , z: tempZ};
	}else{
		scope = {x: input , t: frameTime};
	}
	
	if(usePiecewise){
		for(q = 0 ; q < pieEquInputsUsed ; q++){
			if(input < pieRightLimit[q] && input >= pieLeftLimit[q])
				return pieEquCompiled[q].eval(scope);
		}
		//		current X position is not within a range so set to very low value to make a pit.
		return (-9001);
	}else{
		return equ.eval(scope);
	}
}



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
	minMax = false;
	if(equation(dx + ftmp) < dy && equation(dx - ftmp) < dy){//		close to a local maxima
		stmp = "Local Maxima:";
		minMax = true;
	}else if(equation(dx + ftmp) > dy && equation(dx - ftmp) > dy){
		stmp = "Local Minima:";
		minMax = true;
	}
	if(minMax){
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