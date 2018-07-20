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
var passUsesT0 = false;//		used to temporarily set t to 0 for grey t=0 line
var passUsesZ0 = false;//		used to temporarily set Z to 0 for green/red Z=+-20 lines
var equRaw = ["0" , "0" , "0" , "0" , "0" , "0" , "0" , "0" , "0" , "0"];
var equColored = "";
var equLast = ["0" , "0" , "0" , "0" , "0" , "0" , "0" , "0" , "0" , "0"];
var equCompiled  = ["0" , "0" , "0" , "0" , "0" , "0" , "0" , "0" , "0" , "0"];//		these are the compiled Math.js parsers. They are initialized as strings just to get length=10
var equInvalid = false;
var colors = ['#d13120', '#3420d1', '#d2a320', '#d120ce', '#206cd1', '#b0d120', '#d12020', '#7820d1', '#20d120', '#20b0d1'];

//		Text colors, [0-9] Partenthasis, [11] x, [12] t, [13] z
//	"#FF0000" , "#009900" , "#0000FF"];//	10-12
var parenOpen = 0;
var defaultEqu = "-x-5";
var graphResolution = 0.25;
var equInputField;
var background = new Image;
var colliders;
var gridScale = 1;//		scales grid to show 1s, 10s, or 100s based on the screenScale

var graphingPoints = false;
var graphPointXs = new Array();//		X coordinates to graph

//		-----------------------------------------------------------------------		[   Draw Grid   ]		-----------------------------------------------------------------------
function drawGrid(){//		draw a line at every 10 units
	ctx.strokeStyle="#C5C5C5";
	
	//		change what grid incraments are visible based on screen scale
	if(screenScale < 1.5)
		gridScale = 100;
	else{
		//		if scale is not huge and game is not running, lable the 10 meter marks
		if(!simulating){
			ctx.font = "30px Arial";
			ctx.fillText("10m" , -screenx*screenScale-30 , (-10+screeny)*screenScale+10);
			ctx.fillText("10m" , (10-screenx)*screenScale-30 , screeny*screenScale+10);
			ctx.fillText("0m" , 0-screenx*screenScale-10 , screeny*screenScale+10);
			ctx.fillText("X axis" , screenWidth - 90 , screeny * screenScale - 2);
			ctx.fillText("Y axis" , -screenx * screenScale + 2 , 25);
		}
		if(screenScale < 25)
			gridScale = 10;
		else if(screenScale < 350)
			gridScale = 1;
		else
			gridScale = 0.1;
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

//		-----------------------------------------------------------------------		[   Draw Line   ]		-----------------------------------------------------------------------
function drawLine(){
	if(useRender)//		do not try to draw the line if the equation is an inequality or contans an =. It will almost allways cause problems.
		return;
	ctx.lineWidth = 3;
	//		testing		(x-13)^2-20+sin(t/2)*20
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
		for(q = 0 ; q < piecSecCount ; q++){
			if(input < piecSections[q]){
			//	return 5*q;
				return equCompiled[q].eval(scope);
			}
		}
		return (-5);
	}else{
		return equ.eval(scope);
	}
	
//		negative because in canvas, down is posative
//	return screenScale*math.eval('20*(2+sin(x/20))+sin(t)*50' , scope);
	//return (10*screenScale*(5+Math.sin(input/10 - frameTime)));//		moving sin wave
	//return input*8+100;//		linear
	//		half sine. Rising only.
	/*if((frameTime%6.283) < 3.141)
		return Math.cos(frameTime)*100+400+input*3;//		trampoline
	else
		return 400;//		trampoline
	*/
//	return Math.sin(frameTime*2)*100+input+200;//		sloppede trampoline
//	return (input/200*20*screenScale*(2+Math.sin(input/10))+Math.sin(frameTime)*50+100);//		bounching sin wave
//	return (150+10*screenScale*Math.sign(Math.sin(input/10)))+input*2;//		square wave
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

