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

//		these are used in KeyboardMoudeInput.js to add graphed points at min/max
var minMax = false;
var minMaxX = 0;



//		-----------------------------------------------------------------------		[   Draw Line   ]		-----------------------------------------------------------------------
function drawLine(){
	if(useRender || useCutscene)//		do not try to draw the line if the equation is an inequality or contans an =. It will almost always cause problems. Also cancle on cutscenes.
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
	//		draw line black if the game is running or the sledder is above the line. 
	if(simulating || equation(apx) < apy + 0.01){
		ctx.strokeStyle="#000000";
	}else{//		draw line red if the sledder is below the line so the level cannot start
		ctx.strokeStyle="#CC0000";
	}
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(0 , (-equation(screenx) + screeny)*screenScale);
	
	for(i = lineResolution ; i < screenWidth ; i+=lineResolution){
		//		min and max are used to make sure the line does not go so far off screen that it doesn't render
		ctx.lineTo(i , Math.min( Math.max(-equation(i/screenScale + screenx) + screeny , -10)*screenScale , 2000));
	}
	ctx.stroke();
}

var q = 0;//	integer to only be used in equation()
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
	if(useRender || useCutscene)
		return;
	ctx.font = "25px Arial";
	ctx.fillStyle = "#00A0E0";
	ctx.strokeStyle="#00AAAA";

	for(i = graphPointXs.length-1 ; i > -1 ; i--){
		tmpx = graphPointXs[i];
		tmpy = equation(tmpx);
		
		ctx.fillText( '(' + (Math.round(tmpx*100)/100).toString() + ',' + (Math.round(tmpy*100)/100).toString() + ')', (tmpx - screenx)*screenScale + 5 , -(tmpy-screeny)*screenScale);
	
		//		draw dot on graph at coordinates above
		ctx.beginPath();
		ctx.arc( (tmpx - screenx)*screenScale , -(tmpy-screeny)*screenScale , 4 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}

//	----------------------------------		[   Display coordinates on line near cursor   ]		----------------------------------
function cursorPosition(){
	if(useRender || useCutscene)
		return;
	
	tmpx = mouseX/screenScale + screenx;
	tmpy = equation(tmpx);
	
	//		set text and dot color to blue to increase readability
//	ctx.strokeStyle = "#3333FF";
	ctx.fillStyle = "#3333FF";
		
	//		show mouse X and Y on screen
	if(Math.abs(mouseY - tmpy) > 10){//		if the cursor is within __ pixels square of the line's point, just display the line's point ↑; otherwise, display the cursor point too↓
		ctx.fillText( "X = " + (Math.round((mouseX/screenScale + screenx)*100)/100).toString() + " Y = " + (Math.round((mouseY/screenScale + screenx)*100)/100).toString(),
		Math.max(Math.min(mouseX , Math.round(screenWidth - 300)) , 10) ,
		Math.max(Math.min(mouseY , Math.round(screenHeight - 100)) , 110));
	}
	
	
//	----------------------------------		[   Local Minima/Maxima   ]		----------------------------------
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
	
	/*
		//		render left and right selectDist limits
		ctx.strokeStyle="#FF0000";
		ctx.beginPath();
		ctx.arc( (tmpx + selectDist-screenx)*screenScale , -(ryy-screeny)*screenScale , 4 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	
		ctx.strokeStyle="#0000FF";
		ctx.beginPath();
		ctx.arc( (tmpx - selectDist-screenx)*screenScale , -(lyy-screeny)*screenScale , 4 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();*/
	
	
	//		Y intercept (where x = 0)
	if(Math.abs(tmpx) < selectDist/2){//		(use selectDist/2 so the player has to get twice as close to 0 to label it)
		ctx.strokeStyle="#FFAA00";
		ctx.beginPath();
		ctx.arc( (0-screenx)*screenScale , -(equation(0)-screeny)*screenScale , 4 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	
		ctx.fillText( "Y intercept:",
			Math.max((0 - screenx)*screenScale - 180) ,
			Math.max(-(equation(0) - screeny)*screenScale - 42));
			
		ctx.fillText( "X = 0 Y = " + (Math.round(equation(0)*100)/100).toString(),
			Math.max((0 - screenx)*screenScale - 180) ,
			Math.max(-(equation(0) - screeny)*screenScale - 12));
	}
	
	
	//		X intercept (where y = 0)
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
		/*	ctx.beginPath();
			ctx.arc( ((ltmp+rtmp)/2-screenx)*screenScale , -(equation((ltmp+rtmp)/2)-screeny)*screenScale , 4 , 0 , endAngle);
			ctx.stroke();
			ctx.closePath();*/
			ftmp *= 0.75;//		half the gap between left and right
		}
		
		centerY = equation((ltmp+rtmp)/2);
		
		ctx.strokeStyle="#FFAA00";
		ctx.beginPath();
		ctx.arc( ((ltmp+rtmp)/2-screenx)*screenScale , -(centerY-screeny)*screenScale , 4 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	
	
		ctx.fillText("X intercept:",
			Math.max(((ltmp+rtmp)/2 - screenx)*screenScale + 5) ,
			Math.max(-(centerY - screeny)*screenScale + 32));
	
		ctx.fillText( "X = " + (Math.round((ltmp+rtmp)/2*100)/100).toString() + " Y = 0",
			Math.max(((ltmp+rtmp)/2 - screenx)*screenScale + 5) ,
			Math.max(-(centerY - screeny)*screenScale + 62));
	}
	
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
		ctx.strokeStyle="#00AAFF";
		ctx.beginPath();
		ctx.arc( (minMaxX-screenx)*screenScale , -(dtmp-screeny)*screenScale , 4 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
	
	if(ctrlHeld){//		round x input
		if(minMax)//		if ctrl is held and you are near a min or max, just graph that
			return;
		tmpx = Math.round(tmpx);
		tmpy = equation(tmpx);
	}
	
	//		set text and dot color to blue to increase readability
	ctx.strokeStyle = "#3333FF";
	ctx.fillStyle = "#3333FF";
	
	//		show mouse X and corresponding graph Y on screen
	//		the Math.max(Math.min( section is to keep the text on screen
	ctx.fillText( "X = " + (Math.round(tmpx*100)/100).toString() + " Y = " + (Math.round(tmpy*100)/100).toString(),
		Math.max(Math.min((tmpx - screenx)*screenScale - 110 , Math.round(screenWidth - 270)) , 10) ,
		Math.max(Math.min(-(tmpy -screeny)*screenScale - 12 , Math.round(screenHeight - 100)) , 110));
		
		
	//		draw dot on graph at coordinates above
	ctx.beginPath();
	ctx.arc( (tmpx - screenx)*screenScale , -(tmpy-screeny)*screenScale , 4 , 0 , endAngle);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}