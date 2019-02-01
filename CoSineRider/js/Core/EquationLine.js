//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
/*		File contains:
 *			Equation for line function
 *			Background grid draw
 *			Display point at cursor position (fi shift is held)
 *			Display points in graphPointXs list
 * 
 */

//		equation input
var scope = {x: 0 , t: 0 , z: 0};
var equInput;
var equCompiled;//		compiled Math.js parsers
var equInvalid = false;

var guideInput;
var guideCompiled;
var guideTime = 0;

var equInputField;
var gridScale = 1;//		scales grid to show 1s, 10s, or 100s based on the screenScale


//		-----------------------------------------------------------------------		[   Draw Line   ]		-----------------------------------------------------------------------
function graphAllLines(){
	if(useRender || isCutscene)//		do not try to draw the line if the equation is an inequality or contans an =. It will almost always cause problems. Also cancle on cutscenes.
		return;
	
	tempZ = apz;//		read in the sled's z position so equation() uses the right value
	//	----------------------------------		[   Draw Guide Line (Grey and dashed)   ]		----------------------------------
	if(useGuide && !simulating){
		ctx.lineWidth = 5;
		ctx.setLineDash([40,20]);
		ctx.strokeStyle = _lineFadedColor;
		//		cycle the graph through t=0 through t=6 at half speed (over 12 seconds)
		guideTime += dt;

		ctx.beginPath();
		
		if(usePolar){
			ctx.moveTo(0 , (-guideCompiled.eval({x: screenx , t: (guideTime/2)%6}) + screeny)*screenScale);
			for(i = 0.005 ; i < _piTimes2 ; i += 0.005){
				ctx.lineTo(i , (-guideCompiled.eval({x: i/screenScale + screenx , t: (guideTime/2)%6}) + screeny)*screenScale);
			}
		}else{
			ctx.moveTo(0 , (-guideCompiled.eval({x: screenx , t: (guideTime/2)%6}) + screeny)*screenScale);
			for(i = lineResolution ; i < screenWidth ; i+=lineResolution*3){
				ctx.lineTo(i , (-guideCompiled.eval({x: i/screenScale + screenx , t: (guideTime/2)%6}) + screeny)*screenScale);
			}
		}
		ctx.stroke();	
		ctx.setLineDash([0]);//		reset line to be solid
	}
	
	//	----------------------------------		[   Graph Proxy Function inputs as separate functions   ]		----------------------------------
	
	//		if using InputProxyFunction, draw a line for every function with x substituted for a
	if(isProxyFunction){// && !simulating){
		ctx.lineWidth = 2.5;
		for(k = pieEquInputsUsed ; k > 0 ; k--){
			ctx.strokeStyle = _pFunLineColor[k-1] + "A0";//		set alpha to make the composite line stand out. There are 4 colors and 5 inputs so -1
			ctx.beginPath();
			
			if(usePolar){
				ctx.moveTo((pieEquCompiled[k].eval({a: 0}) - screenx)*screenScale , screeny*screenScale);
				for(i = 0.005 ; i < _piTimes2 ; i += 0.005){
					ftmp = pieEquCompiled[k].eval({a: i});//		ftmp = r 		read a as θ
					ctx.lineTo((ftmp * math.cos(i) - screenx)*screenScale , (-ftmp * math.sin(i) + screeny)*screenScale);
				}
			}else{
				ctx.moveTo(0 , (-pieEquCompiled[k].eval({a: i/screenScale + screenx}) + screeny)*screenScale);
				for(i = lineResolution ; i < screenWidth ; i+=lineResolution){
					ctx.lineTo(i , (-pieEquCompiled[k].eval({a: i/screenScale + screenx}) + screeny)*screenScale);//		read a as x position
				}
			}
			
			ctx.stroke();
		}
	}
	
	ctx.lineWidth = 3;
	
	//	----------------------------------		[   Draw t=0 line (light grey)   ]		----------------------------------
	if(showt0){
		//		draw time independent (t=0) equation line in grey
		ctx.strokeStyle = _lineTimelessColor;
		var tmpTime = frameTime;
		frameTime = 0;
		
		graphLine();
		
		frameTime = tmpTime;
	}

	//	----------------------------------		[   draw Z max and Z min lines (red and green)   ]		----------------------------------
	//		Z not comparable with polar coordinates
	if(useZ){
		//		draw equation with Z=5 and -5 in red and green
		ctx.strokeStyle = _lineZPlusColor;
		tempZ = 20;
		graphLine();

		ctx.strokeStyle = _lineZMinusColor;
		tempZ = -20;
		graphLine();
		
		tempZ = apz;//		tempZ is always created from apz so setting a temporary variable to store tempZ is not nessisary
	}
	
	//	----------------------------------		[   Show original when using Derivative   ]		----------------------------------
	if(useDerivative){
		ctx.strokeStyle = _lineRaw;
		ctx.beginPath();
		//		disable derivatives so you can draw the entered equation directly, then re-enable derivatives
		useDerivative = false;
		
		if(usePolar){
			ctx.moveTo((equation(0) - screenx)*screenScale , screeny*screenScale);
			for(i = 0.005 ; i < _piTimes2 ; i += 0.005){
				ftmp = equation(i);//		ftmp = r
				ctx.lineTo((ftmp * math.cos(i) - screenx)*screenScale , (-ftmp * math.sin(i) + screeny)*screenScale);
			}
		}else{
			ctx.moveTo(0 , (-equation(screenx) + screeny)*screenScale);
			for(i = lineResolution ; i < screenWidth ; i+=lineResolution){
				ctx.lineTo(i , Math.min( Math.max(-equation(i/screenScale + screenx) + screeny , -10)*screenScale , 2000));
			}
		}
		ctx.stroke();
		
		useDerivative = true;
	}
	
	//	----------------------------------		[   draw equation line (black)   ]		----------------------------------
	//		Black Line if the sledder is above the line. 
	if(simulating || equation(apx) < apy + 0.01){
		ctx.strokeStyle = _lineColor;
	}else{//		Red Line if the sledder is below the line (level cannot start)
		ctx.strokeStyle = _lineInvalidColor;
	}
	
	ctx.lineWidth = 4;
	graphLine();
}


//		----------------------------------------------------		[   Graphed Single Equation Line   ]		----------------------------------------------------
//		this function draws most graphed lines. The line color and weight as well as locking t and z to certain values before calling this function is what differenciates lines being graphed.
function graphLine(){
	ctx.beginPath();
	if(usePolar){
		ctx.moveTo((equation(0) - screenx)*screenScale , screeny*screenScale);
		for(i = 0.005 ; i < _piTimes2 ; i += 0.005){
		// for(i = -2*_piTimes2 ; i < _piTimes2*5 ; i += 0.005){
			ftmp = equation(i);//		ftmp = r
			ctx.lineTo((ftmp * math.cos(i) - screenx)*screenScale , (-ftmp * math.sin(i) + screeny)*screenScale);
		}
	}else{
		ctx.moveTo(0 , (-equation(screenx) + screeny)*screenScale);
		for(i = lineResolution ; i < screenWidth ; i+=lineResolution){
			ctx.lineTo(i , Math.min( Math.max(-equation(i/screenScale + screenx) + screeny , -10)*screenScale , 2000));
		}
	}
	ctx.stroke();
}