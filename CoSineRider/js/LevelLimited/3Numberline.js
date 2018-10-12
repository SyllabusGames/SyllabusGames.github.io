//	-----	[  This is free and unencumbered software released into the public domain  ]	-----

var animTxtHight = 5.0;//		scale of text height set by screen scale
var animTime = 2;//		counts up from 0 to 1+ to animate variables and pause between opperations
var animManualAdvance = true;//		true if enter/left mouse button must be pressed to advance instrucitons
var animCanProceed = true;//		enter has been pressed for this step or manual ↑ is not active
//		camera properties for animating screen movement
var animScale = 0;
var animOldScale = 0;
var animScreenx = 0;
var animOldScreenx = 0;
var animScreeny = 0;
var animOldScreeny = 0;
var animTimeScale = 1;

var animLnum = 0;//		temporary value for storing current line being drawn
var animNumberOfLines = 0;//		the highest index line to be rendered. (since animLy is not a dynamic array, this vairable records which indexes (ones below this) are actually in use)

//		variables for animating lines and points
//		variable names are self explanitory. If -1 is default, -1 means it is not being animated and other values mean that line # is being animated.
//		variables set to 0 are start and end values to interpolate between.
var animCamMoving = false;
var animLineMoving = -1;
var animRotateLine = -1;
var animPointMoving = -1;
var animGraphAnim = -1;
var animLineDraw = -1;
var animRotation = 0;
var animRotationOld = 0;
var animMoveLine = 0;
var animMoveLineOld = 0;
var animLineThickness = 0;

var animCurrentInst = -1;//		index of current instruciton
var animInstructionsRaw = "c130&-1&5&0,00&x&X,14&sqrt(x)&Y=square root of X,p0&0&1,p0&1&1,p0&4&0.5,p0&9&0.5,p0&0&10&3,r190&2&0,g02,l12,c90&-1&7&1,p0&16&1,c60&-1&11&1,p0&25&1,end";//		Square root
//						"c130&-1&5&0,00&x&X,14&sin(x/5)*5&Y=sin(X/5)*5,p0&1&1,p0&4&0.5,p0&6&0.4,p0&8&0.3,p0&0&10&3,r190&2&0,g02,l12,end";//		sin wave
//						"c70&-3&10&0,00&x&X,14&x+2&Y=X+2,p0&1&0.5,p0&4&0.2,p0&6&0.1,p0&8&0.1,p0&0&10&2,r190&2&0,g02,l12,end";//		Y=x+2
//						"c100&-6&6.5&0,00&x&X,14&x+2&Y=X+2,p0&1&0.5,27&2x&Y=2X,p1&3&1,r245&1,p0&0&10&2,c60&-4&13&2,r190&1.5&0,g02,l12,end";
var animInstruction;
/*	c20&-5&5&0 - camera , scale=20pixels per unit , screenx=-5 (left edge of screen is at x=-5) , screeny = 5 , transition time = 0 seconds
	00 - add number line 1 at y=0
	15&x+2 - add number line 1 at y=5. everything right of the = sign is the equation for this line
	p0&10&1.5 - draw a point at 10 animating from line 0 to line 0+1 over 1.5 seconds
	p0&-10&10&1.5 - draw all intiger points between -10 and 10 animating from line 0 to line 0+1 over 1.5 seconds
	210 - add rotating number line at y=10
	r1-90&1.5 - rotate line 1 to -90 degrees over 1.5 seconds
	r1-90&1.5&0 - same as above but also move to y=0
	g02 - animate number line 0's points to graph view over 2 seconds
	l21 - draw line using line 2's equation, graphing y=(eq)+ numberLine[2]'s y value. Fade in over 1 second.
*/

//		the following record y position, rotation, equation, displayed text, points mapped to, and variables for animating point movement for all 10 possible number lines.
var animLy = [-500,-5000,-5000,-5000,-5000,-5000,-5000,-5000,-5000,-5000];
var animLrot = [0,0,0,0,0,0,0,0,0,0];
var animLequ = ['x','x','x','x','x','x','x','x','x','x'];
var animLText = ['','','','','','','','','',''];
var animPoints = [];//new Array();//		x positions of points on lines
var animPointPos = [];//new Array();//		animates 0 to 1 to draw line from point on numberline to coresponding point on the next
var animGraphyness = [0,0,0,0,0,0,0,0,0,0];
var animGetsGraphed = [false,false,false,false,false,false,false,false,false,false];//		if true, points will use animGraphyness to move points to be in their correct position for a standard cartesian location 

function setUpAnim(){
	animInstruction = animInstructionsRaw.split(',');
	animCurrentInst = 0;
	mainInput.style.display = "none";
	//		create 10 placerholder arrays for points on each line
	animPoints.push([]);
	animPoints.push([]);
	animPoints.push([]);
	animPoints.push([]);
	animPoints.push([]);
	animPoints.push([]);
	animPoints.push([]);
	animPoints.push([]);
	animPoints.push([]);
	animPoints.push([]);
	
	animPointPos.push([]);
	animPointPos.push([]);
	animPointPos.push([]);
	animPointPos.push([]);
	animPointPos.push([]);
	animPointPos.push([]);
	animPointPos.push([]);
	animPointPos.push([]);
	animPointPos.push([]);
	animPointPos.push([]);
}

function switchToAnim(){
	//		pause the music
	pauseEquationTheme();
	//		hide the 2d view
	xyzc.style.display="none";
	xyz2c.style.display="none";
}

function animCore(){
	animTime += dt/animTimeScale;
	if(animCanProceed && animTime > 1 + 0.25/animTimeScale){//		wait until the last wait time is over + 0.25 seconds
		//		reset update variables
		animCamMoving = false;
		animLineMoving = -1;
		animRotateLine = -1;
		animPointMoving = -1;
		animGraphAnim = -1;
		if(animManualAdvance)
			animCanProceed = false;//		this is set back to true when left mouse button or enter are pressed
	
		stmp = animInstruction[animCurrentInst++];//		read in the next instruciton
		animTime = 0;
		switch(stmp[0]){
			case 'c'://		camera		input(c20&-5&5&0)	means	scale=20pixels per unit , screenx=-5 (left edge of screen is at x=-5) , screeny = 5 , transition time = 0 seconds
				ctmp = stmp.substring(1 , stmp.length).split('&');//		split off the camera's target scale, x, y, and transition time into ctmp[0] - ctmp[3]
				animScale = parseFloat(ctmp[0]);
				animScreenx = parseFloat(ctmp[1]);
				animScreeny = parseFloat(ctmp[2]);
				if(ctmp[3] == "0"){
					screenScale = animScale;
					screenx = animScreenx;
					screeny = animScreeny;
					
					dragScreenX = screenx + screenWidth/2/screenScale;
					dragScreenY = -screeny + screenHeight/2/screenScale;
					dragScreenScale = screenScale;
					//		go straight into the next command
					animTime = 2;
					animCanProceed = true;
				}else{
					animOldScale = screenScale;
					animOldScreenx = screenx;
					animOldScreeny = screeny;
					animTimeScale = parseFloat(ctmp[3]);
					animCamMoving = true;
				}
				break;
			case 'p'://		add points on lines
				//		For ranges			input (p0x0x10x1)	means	ctmp[0] = left end of x range, ctmp[1] = right end of x range, ctmp[2] = time
				//		For single points	input (p0x1x0.5)	means	ctmp[0] = point.x, ctmp[1] = time
				ctmp = stmp.substring(3 , stmp.length).split('&');
				animLnum = parseInt(stmp[1]);//		line number
				animPointMoving = animLnum;

				if(ctmp.length == 3){//		add a range of points
	//				console.log("added point from " + ctmp[0] + " to " +ctmp[1] + "to line" + animLnum + " in time " + ctmp[2]);
					i = parseInt(ctmp[1]);//		last number in range
					animTimeScale = parseFloat(ctmp[2]);//		timescale will be stored after the last &
					for(k = parseInt(ctmp[0]) ; k <= i ; k++){//		add all points between (including) range values
						animPoints[animLnum].push(k);
						animPointPos[animLnum].push(0);//		start each point's animation at 0
					}
				}else{//		add a single point
	//				console.log("added point at " + ctmp[0] + " to line " + animLnum + " in time " + ctmp[1]);
					animPoints[animLnum].push (parseFloat(ctmp[0]));
					animPointPos[animLnum].push(0);
					animTimeScale = parseFloat(ctmp[1]);
				}
				break;
			case 'r'://		rotate numberLine		input (r1-90x1.5) OR (r1-90x1.5x0)	means	rotate line 1 to -90 degrees over 1.5 seconds. Optional - move to y=0
				animRotateLine = parseInt(stmp[1]);
				ctmp = stmp.substring(2 , stmp.length).split('&');
				animRotation = ctmp[0];
				animRotationOld = animLrot[animRotateLine];
				ftmp = parseFloat(ctmp[1]);
				if(ftmp == 0)
					animTime = 2;//		go straight into the next command
				else
					animTimeScale = ftmp;
				if(ctmp.length > 2){//		move line in addition to rotating
					animMoveLine = parseFloat(ctmp[2]);
					animMoveLineOld = animLy[animRotateLine];
					animLineMoving = animRotateLine;
				}
				break;
			case 'e'://		end
				animTime = -99999;
				animCurrentInst--;
				break;
			case 'g'://		animate to graph view		input (g02)		means		animate number line 0's points to graph view over 2 seconds
				animGraphAnim = parseInt(stmp[1]);
				animGetsGraphed[animGraphAnim] = true;
				animGraphyness[animGraphAnim] = 0.2;
				animTimeScale = parseFloat(stmp.substring(2));
				break;
			case 'l'://		draw line of graph after using 'g'
				animLineDraw = parseInt(stmp[1]);
				animLineThickness = 0;
				animTimeScale = parseFloat(stmp.substring(2));
				break;
			default://		line identifier 0-9		input (15&x+2&Y=X+2)	means	Line 1,	y position y=5,	equation y=x+2,		display text Y=X+2
				i = parseInt(stmp[0]);//		read line number
				animNumberOfLines = Math.max(i+1 , animNumberOfLines);//		Set number of rendered lines to be at least this line's numeber + 1 
				ctmp = stmp.substring(1 , stmp.length).split('&');
				animLy[i] = parseFloat(ctmp[0]);
				if(ctmp.length > 0){//		add equation if one is declared
					scope = {x: k};
					eqinput = math.parse(ctmp[1] , scope);
	//				console.log("Equation "+ ctmp[1] + " / " + i)
					animLequ[i] = eqinput.compile();
					if(ctmp.length > 1){//		add equation if one is declared
						animLText[i] = ctmp[2];
					}
				}
				animTimeScale = 1;
		}
	}
	
	
	
	//		-----------------------------------------------------------------------		[   Animate variables   ]		-----------------------------------------------------------------------
	ftmp = Math.min(animTime,1);//		ftmp is interpolation value between 0 and 1
	if(animCamMoving){
		screenScale = animOldScale * (1-ftmp) + animScale * ftmp;
		screenx = animOldScreenx * (1-ftmp) + animScreenx * ftmp;
		screeny = animOldScreeny * (1-ftmp) + animScreeny * ftmp;
		dragScreenX = screenx + screenWidth/2/screenScale;
		dragScreenY = -screeny + screenHeight/2/screenScale;
		dragScreenScale = screenScale;
	}else if(animRotateLine != -1){
		animLrot[animRotateLine] = animRotationOld * (1-ftmp) + animRotation * ftmp;
	}else if(animPointMoving != -1){
		for(i = animPointPos[animPointMoving].length-1 ; i > -1 ; i--){
			animPointPos[animPointMoving][i] = Math.min(animPointPos[animPointMoving][i] + dt/animTimeScale , 1);
		}
	}else if(animGraphAnim != -1){
		animGraphyness[animGraphAnim] = ftmp;
	}
	if(animLineMoving != -1){//		lines can be animated and rotated at the same time. All other transforms are in else clauses because only one can execute at a time.
		animLy[animLineMoving] = animMoveLineOld * (1-ftmp) + animMoveLine * ftmp;
	}

	//		set font height for current screen scale
	animTxtHight = Math.round(Math.sqrt(screenScale)*3);
	ctx.font = animTxtHight.toString() + "px Arial";
	ctx.strokeStyle="#000000";

	//		-----------------------------------------------------------------------		[   Draw Everything   ]		-----------------------------------------------------------------------
	if(animLineDraw != -1){//		only one graphed line can be drawn at a time
		animLineThickness = Math.max(ftmp , animLineThickness + 0.001);
		ctx.lineWidth = animTxtHight/20 * animLineThickness;
		ctx.beginPath();
		scope = {x: screenx};
		ctx.moveTo(0 , (-animLequ[animLineDraw].eval(scope) + screeny)*screenScale);
		for(i = 5 ; i < screenWidth ; i+=5){
			scope = {x: i/screenScale + screenx};
			ctx.lineTo(i , (-animLequ[animLineDraw].eval(scope) + screeny)*screenScale);
		}
		ctx.stroke();
	}
	for(animLnum = 0 ; animLnum < animNumberOfLines ; animLnum++){
		rotateNumberLine(animLy[animLnum] , animLrot[animLnum]);
	}
}

//		yyy is y coordinate of number line
function rotateNumberLine(yyy , rotation){
	ctx.lineWidth = animTxtHight/10;//		line width is somtimes animated in animDrawPointMove() so setting it here is nessisary.
	yyy = (-yyy + screeny) * screenScale;//		world to screen space
	dx = Math.cos(rotation*0.0174532925199444);//		convert from degrees to normalized slope vector
	dy = Math.sin(-rotation*0.0174532925199444);
	
	//		draw number line and tic marks
	ctx.beginPath();
	for(i = -50 ; i < 51 ; i++){
		dxdt = (i*dx-screenx)*screenScale;//		x offset to move 1 unit allong line
		dydt = yyy+i*dy*screenScale;//		y offset to move 1 unit allong line
		ctx.lineTo(dxdt , dydt);
		if(i%10 == 0){//		tic mark is at a multiple of 10 are longer
			ctx.lineTo(dxdt - animTxtHight*-dy*0.75 , dydt - animTxtHight*dx*0.75);
		}else{
			ctx.lineTo(dxdt - animTxtHight*-dy*0.35 , dydt - animTxtHight*dx*0.35);
		}
		ctx.lineTo(dxdt + animTxtHight*-dy*0.2 , dydt + animTxtHight*dx*0.2);
		ctx.lineTo(dxdt , dydt);
		ctx.fillText(i.toString() , dxdt + animTxtHight*-dy*0.7 , dydt + animTxtHight*(0.8+dx*0.3-Math.abs(dy*0.4)));
	}
	ctx.stroke();
	
	//		draw text lable for line at about x=5
	ctx.fillText(animLText[animLnum] ,  (5*dx-screenx)*screenScale + animTxtHight*-dy - animLText[animLnum].length*animTxtHight*0.6  , yyy + 5*dy*screenScale - animTxtHight*dx);
	
	//		draw points on line
	for(i = 0 ; i < animPoints[animLnum].length ; i++){
		k = animPoints[animLnum][i];//		animLnum is the line number from the for loop calling this function.// k = x position
		scope = {x: k};
		ftmp = animLequ[animLnum+1].eval(scope);//		feed this point's x position to the next line's equation to get its position on the next line.
		animDrawPointMove(k , yyy , ftmp , animLy[animLnum+1] , animPointPos[animLnum][i]);
	}
}


//		draw points on a line, arrow pointing to where it maps to on the next line, and the point on the second line once that arrow is > 80% of the way to that second line
function animDrawPointMove(xxa , yya , xxb , yyb , lerp){	
	ryy = xxb;//		store x position on second number line for displaying as text
	
	//		conver to screen space. For yya, this is done in rotateNumberLine() right before this function is called.
	yyb = (-yyb + screeny) * screenScale;

	
	//		move coordinates to be on rotated number lines
	yya = yya-xxa*Math.sin(animLrot[animLnum]*0.0174532925199444)*screenScale;
	xxa = (xxa*Math.cos(animLrot[animLnum]*0.0174532925199444)-screenx)*screenScale;
	
	yyb = yyb-xxb*Math.sin(animLrot[animLnum+1]*0.0174532925199444)*screenScale;
	xxb = (xxb*Math.cos(animLrot[animLnum+1]*0.0174532925199444)-screenx)*screenScale;
	
	
	if(animGetsGraphed[animLnum]){//		if transitioning points to their 2D locations
		ctx.lineWidth = (1.05-animGraphyness[animLnum])*animTxtHight/7;//		fade out arrows. 1.05 leaves a very faint arrow. If you want it to go completly blank, use 1.001. A line weight of 0 causes problems.

		ctx.beginPath();//		draw arrow from left number line to points
		ctx.moveTo(xxb , yyb);

		xxb = xxa*animGraphyness[animLnum] + xxb*(1-animGraphyness[animLnum]);//		move second point from line to directly above point on first line
		
		//		draw arrow head
		ctx.lineTo(xxb , yyb);
		ctx.moveTo(xxb , yyb);
		ctx.lineTo(xxb-animTxtHight*0.9 , yyb+animTxtHight*0.3);
		ctx.moveTo(xxb , yyb);
		ctx.lineTo(xxb-animTxtHight*0.9 , yyb+animTxtHight*-0.3);
		ctx.stroke();
	}else{
		ctx.lineWidth = animTxtHight/7;
	}
	
	//		-----------------------------------------------------------------------		[   Point at xxa on yya   ]		-----------------------------------------------------------------------
	ctx.beginPath();
	ctx.arc(xxa , yya , animTxtHight/8 , 0 , endAngle);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	//		-----------------------------------------------------------------------		[   Point at xxb on yyb   ]		-----------------------------------------------------------------------
	if(lerp > 0.8){
		ctx.beginPath();
		ctx.arc(xxb , yyb , animTxtHight/8 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.fillText( (Math.round(ryy*100)/100).toString() , xxb , yyb - 10);
	}
	//		slope of line joining points between number lines
	dx = xxb-xxa;
	dy = yyb-yya;
	
	ftmp = Math.sqrt(dx*dx+dy*dy);//		magnitude of vector (dx,dy)
	
	ctx.beginPath();
	ctx.moveTo(xxa , yya);

	xxb = xxa + lerp * dx;//		lerp animates from 0 to 1 to animate the line being drawn from the first point to the second
	yyb = yya + lerp * dy;
	
	dx /= ftmp;//		unit vectors for line slope
	dy /= ftmp;
	
	//		-----------------------------------------------------------------------		[   Line from (xxa,yya) to (xxb,yyb)   ]		-----------------------------------------------------------------------
	ctx.lineTo(xxb , yyb);
	ctx.moveTo(xxb , yyb);
	ctx.lineTo(xxb+animTxtHight*(-dy*0.3-dx) , yyb+animTxtHight*(dx*0.3-dy));
	ctx.moveTo(xxb , yyb);
	ctx.lineTo(xxb+animTxtHight*(dy*0.3-dx) , yyb+animTxtHight*(-dx*0.3-dy));
	ctx.stroke();
}


//		non-rotatable, infinite number line
/*
//		yyy is y coordinate of number line
function drawNumberLine(yyy){
	animTxtHight = Math.round(Math.sqrt(screenScale)*4);
	ctx.font = animTxtHight.toString() + "px Arial";
	ctx.lineWidth = animTxtHight/10;
	yyy = (-yyy + screeny) * screenScale;
	ctx.strokeStyle="#000000";

	//		-----------------------------------------------------------------------		[   Tic-Marks   ]		-----------------------------------------------------------------------
	ctx.beginPath();
	ctx.moveTo(0 , yyy);
	//		i is in screen space units
	for(i = (-(screenx%1))*screenScale ; i < screenWidth ; i += screenScale){
		k = Math.round(i/screenScale + screenx);
		ctx.lineTo(i , yyy);
		if(k%10 == 0){//		tic mark is at a multiple of 10
			ctx.lineTo(i , yyy - animTxtHight*0.75);
		}else{
			ctx.lineTo(i , yyy - animTxtHight*0.35);
		}
		ctx.lineTo(i , yyy + animTxtHight*0.2);
		ctx.lineTo(i , yyy);
		ctx.fillText( k.toString() , i , yyy + animTxtHight);
	}
	ctx.lineTo(screenWidth , yyy);
	ctx.stroke();
	
	//		-----------------------------------------------------------------------		[   Origin (X=0 Mark)   ]		-----------------------------------------------------------------------
	ctx.beginPath();
	ctx.moveTo(-screenx*screenScale , yyy - animTxtHight*0.9);
	ctx.lineTo(-screenx*screenScale , yyy + animTxtHight*0.2);
	ctx.stroke();

	
	//		-----------------------------------------------------------------------		[   Darken Horizontal Line   ]		-----------------------------------------------------------------------
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(0 , yyy);
	ctx.lineTo(screenWidth , yyy);
	ctx.stroke();
}
*/
