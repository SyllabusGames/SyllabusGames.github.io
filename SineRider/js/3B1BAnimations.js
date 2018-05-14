var animX = 1;//		animate 0 to 1 to go from all number lines on the Y axis to being spaced out accross the screen
var animY = 0;

//["5" , "5+x" , "5+x/2" , "5+(x/2)^2"]
//var animIndex = -1;//		the step of the animation that is being played. -1 is moving the vertical lines off the Y axis. 0+ map to the steps in animSteps.

var animScope;
var animInput;

var displayEqu = [" " , " "];

/*	The following system works like this:
	Every equation is read into its variable "a,x,s"		animA=x		s means set so		animALast=x so there is no animation
	an m on the end means multiply/devide so the animation will show points scaling to the next location
	an a on the end means add/subtract so the animaion will show points being offset to the next location
	an r on the end means remove this equation
	Every equation is always animating between anim# and anim#Last if anim#Fade is false, so when an equation is not in use, these equations are set to be the same thing

	The input is formatted "equation letter,y=___,[set(first instance of a,b,c equation),multiply,add,remove(hide)]"
*/
var animTime = -0.25;
//var animStages=["a,x,s" , "a,2x,m" , "a,2x+2,a" , "a,(2x+2)*0.5,m","a,(x+1)^2,m" , "b,-x,s" , "b,-x/2,m" , "a,((x+1)^2)-x/2,a" , "b, ,r"]
var animStages = ["a,x,s" , "a,k*x,m" , "a,k*x+2,a" , "a,(2x+2)*k,m" , "a,(x+1)^k,m" , "b,-x,s" , "b,-x/k,m" , "a,((x+1)^2)-k*x/2,a" , "b, ,r"]
var animLerps = [	0,0	,		1,2	  ,		0,2		,	 1,0.5		,	 1,2		 ,	0,0		,	1,2	,		0,1				,		0,0	];//		values for a to interpolate (Lerp) between
var animIndex = 0;
var animA;//		red
var animALast;
var animAShow = false;
var animAFade = false;
var animAEqu;
var animB;//		blue
var animBLast;
var animBShow = false;
var animBFade = false;
var animBEqu;
var animC;//		green
var animCLast;
var animCShow = false;
var animCFade = false;
var animCEqu;


function setUpNumberLines(){//		reset variables for a new animation
	pullNextStage();
	/*displayEqu = new Array();
	animTime = -0.25;
	animIndex = -1;
	for(i = 0 ; i < animSteps.length ; i++){
		substring = animSteps[i].split('a');
		displayEqu.push(substring[0]);
		displayEqu.push(substring[1]);
	}*/
}

function pullNextStage(){
	substring = animStages[animIndex].split(',');

	switch(substring[0]){
		case "a":
			if(substring[2] == 's'){//		set last to the current equation
				animALast = substring[1];
				animTime = 0.5;//		Shorten time since nothing will be moving when the equation is first graphed
			}else{
				animALast = animA;
			}
			if(substring[2] == 'r'){//		remove (hide) this equation
				animAShow = false;
			}else{//		fade equations that are not currently being animated
				animA = substring[1];
				animAShow = true;
				animAFade = false;
				animBFade = true;
				animCFade = true;
				displayEqu = substring[1].split('k');
			}
			break;
			
		case "b":
			if(substring[2] == 's'){
				animBLast = substring[1];
			}else{
				animBLast = animA;
			}
			if(substring[2] == 'r'){
				animBShow = false;
			}else{
				animAFade = true;
				animB = substring[1];
				animBShow = true;
				animBFade = false;
				animCFade = true;
				displayEqu = substring[1].split('k');
			}
			break;

		case "c":
			if(substring[2] == 's'){
				animCLast = substring[1];
			}else{
				animCLast = animA;
			}
			if(substring[2] == 'r'){
				animCShow = false;
			}else{
				animAFade = true;
				animBFade = true;
				animC = substring[1];
				animCShow = true;
				animCFade = false;
				displayEqu = substring[1].split('k');
			}
			break;
	}
	animIndex++;

	
		//		parse in the next step's equation 
	if(animAShow){
		animScope = {x: 0 , t: 0 , z: 0 , k: 1};
		animInput = math.parse(animA , animScope);
		animAEqu = animInput.compile();
	}
}

function drawNumberLines(){
	animTime += dt*0.5;
	
	//		-------------------------------------------------------------		[   Load next equation/Stage   ]		-------------------------------------------------------------
	if(animTime > 1.25){
		if(animIndex == animStages.length-1){//		out of equation steps, animation should end
			rtmp += dt;//		when you have reached the last step in the equation, start animating t as time
			if(animTime > 3.25){
				return;
			}
			ctx.fillText( "t = " + (Math.round(rtmp*10)/10).toString() + "Seconds" , 20 , 120);
		}else{
			animTime = -0.25;
			pullNextStage();
			//displayEqu = animSteps[animIndex].split('a');//		split the input equation on a so [0] is everything left of a and [1] is everything right
		

			ltmp = 1;//		most starting equations are y=1 recorded as y=a. a is ltmp so a starts as 1.
			rtmp = 0;
		}
	}

	//		-------------------------------------------------------------		[   Animate X and Y Inputs   ]		-------------------------------------------------------------
	if(animIndex == -1){
		animX = Math.min(Math.max(animTime , 0) , 1);//		clamp animX between 0 and 1
	}else{
		animY = Math.min(Math.max(animTime , 0) , 1);//		clamp animY between 0 and 1
		//		set ltmp as the value between the start and end values for this equation iterpolated by animY
		ltmp = animLerps[animIndex*2]*(1-animY) +  animLerps[animIndex*2+1]*animY;
		ctx.fillText( "y=" + displayEqu[0] + (Math.round(ltmp*10)/10).toString() + displayEqu[1] , 20 , 50);
	}

	//		-------------------------------------------------------------		[   Draw Graph Points   ]		-------------------------------------------------------------
	ctx.lineWidth = 3;
	ctx.fillStyle = "black";
	if(animIndex == -1){//		on the first loop, y=1
		for(ftmp = 0 ; ftmp < screenWidth*animX ; ftmp += 10*screenScale*animX){
			numberLine(ftmp , 1);
		}
	}else{
		for(ftmp = 0 ; ftmp < screenWidth*animX ; ftmp += 10*screenScale*animX){
			animScope = {x: ftmp/screenScale , t: rtmp , z: 0 , k: ltmp ,  b: 0};
		
			if(animAShow){
				if(animAFade)
					ctx.strokeStyle="#F08080";
				else
					ctx.strokeStyle="#D02020";
				dtmp =  animAEqu.eval(animScope);//		offset (adders)
				animScope = {x: 0 , t: rtmp , z: 0 , k: ltmp ,  b: ltmp};//		scalers (multipliers)
				numberLine(ftmp , dtmp , animAEqu.eval(animScope));
			}

			
			if(animBShow){
				if(animBFade)
					ctx.strokeStyle="#80F080";
				else
					ctx.strokeStyle="#20D020";
				dtmp =  animBEqu.eval(animScope);//		offset (adders)
				animScope = {x: 0 , t: rtmp , z: 0 , k: ltmp ,  b: ltmp};//		scalers (multipliers)
				numberLine(ftmp , dtmp , animBEqu.eval(animScope));
			}
		}
	}

	//		Write out every equation that will be solved and make them clickable
	//		-------------------------------------------------------------		[   Show equation steps   ]		-------------------------------------------------------------
	/*for(i = 0 ; i < animStages.length ; i++){
		if(animAShow){
			ctx.fillText( "y=" + displayEqu[i*2] + animLerps[i*2+1].toString() + displayEqu[i*2+1] , 20 , 250 + i*75);
		}
	}*/

}



//		xxx is x position of line. yyy is spacing of ticks
function numberLine(xxx , dy , yyy){
	return;
	xxx -= screenx*screenScale;
	//		don't add thousands of tic marks if the spacing is too small to see
	if(Math.abs(yyy) < 0.15){
		if(yyy == 0){
			yyy = 0.15;
		}else{
			yyy = Math.sign(yyy)*0.15;
		}
	}
	//		[  Vertical Line  ]
	/*ctx.beginPath();
	ctx.lineTo(xxx , screenHeight);
	ctx.lineTo(xxx , 0);
	ctx.stroke();*/

	//	this will draw a number line starting at the bottom of the screen, moving up to the next notch, moving left, moving right,
	//	moving back to the center, then the center, then repeating.


	

	if(dy+yyy > 0){
		//		draw a faint line in the negative direction
	//	ctx.strokeStyle="#D08080";
		
		ctx.beginPath();
		ctx.lineTo(xxx , screenHeight);
		ctx.lineTo(xxx , screeny*screenScale);
		ctx.stroke();
		//		draw a tic-marked line in the posative direction
	//	ctx.strokeStyle="#C00000";
		ctx.beginPath();
		ctx.lineTo(xxx , 0);
		for(i = screeny*screenScale+dy ; i > 0 ; i -= screenScale*yyy){
			ctx.lineTo(xxx , i);
			ctx.lineTo(xxx-5 , i);
			ctx.lineTo(xxx+5 , i);
			ctx.lineTo(xxx , i);
		}
		ctx.lineTo(xxx , screeny*screenScale);
		ctx.stroke();

	}else{
		//		draw a faint line in the posative direction
	//	ctx.strokeStyle="#D08080";
		
		ctx.beginPath();
		ctx.lineTo(xxx , 0);
		ctx.lineTo(xxx , screeny*screenScale);
		ctx.stroke();
		//		draw a tic-marked line in the nagative direction
	//	ctx.strokeStyle="#C00000";
		ctx.beginPath();
		ctx.lineTo(xxx , screenHeight);
		for(i = screeny*screenScale+dy ; i < screeny*screenScale + Math.floor(screenHeight) ; i -= screenScale*yyy){
			ctx.lineTo(xxx , i);
			ctx.lineTo(xxx-4 , i);
			ctx.lineTo(xxx+4 , i);
			ctx.lineTo(xxx , i);
		}
		ctx.lineTo(xxx , screeny*screenScale);
		ctx.stroke();
	}
	
	//		draw point at [xxx,dy] (Draw the graph points)
	ctx.beginPath();
	ctx.arc(xxx , (screeny - dy)*screenScale , 6 , 0 , endAngle);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	//		label point
	ctx.fillText( Math.round(dy*10)/10 , xxx , (screeny - dy)*screenScale - 10);
	ctx.fillText( Math.round(xxx/screenScale+screenx) , xxx - 35 , screeny*screenScale + 45);

	//		draw the offset
	ctx.beginPath();
	ctx.moveTo(xxx - 6 , (screeny - yyy)*screenScale + 3);
	ctx.lineTo(xxx + 6 , (screeny - yyy)*screenScale + 3);
	ctx.lineTo(xxx + 6 , (screeny - yyy)*screenScale - 3);
	ctx.lineTo(xxx - 6 , (screeny - yyy)*screenScale - 3);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	
	//for(i = Math.round(screenx/10) ; i < screenx/10+screenWidth/10/screenScale ; i++){//		vertical lines
	/*
	for(i = Math.round(screenx) ; i < screenx+screenWidth/screenScale ; i++){
		ctx.moveTo((-screenx + i*10) * screenScale , 0);
		ctx.lineTo((-screenx + i*10) * screenScale , screenHeight);
	}
	*/


}