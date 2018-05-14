/*		contains line from equation
 *			equation text input
 *			background grid draw
 * 
 */

//		equation input
var scope;
var eqinput;
var equation;
var equRaw = "0";
var equColored = "";
var equLast = "0";
var equInvalid = false;
var defaultEqu = "-x-5";
var graphResolution = 0.25;
var equInputField;
var background = new Image;
var colliders;
var gridScale = 1;//		scales grid to show 1s, 10s, or 100s based on the screenScale

//		-----------------------------------------------------------------------		[   Equation Changed   ]		-----------------------------------------------------------------------
//		RESOURCE: http://jsfiddle.net/karim79/TxQDV/
//		RESOURCE: http://jsfiddle.net/4rL3tvah/1/
$("div").keyup(function(){
	parenOpened = 0;
	parenClosed = 0;
	if(!simulating)
		equRaw = $(this).text();
	var loc = getCaretLocation(this);
	var chars = $(this).text().split("");
	$("#dinput").text("");
	$.each(chars, function(ccc){
//		-----------------------------------------------------------------------		[   Input Text Coloring   ]		-----------------------------------------------------------------------
		if(chars[ccc] == '('){
			$("<span>").text(this).css({
				color: textColor[parenOpen%10]
				,'font-weight': 'bold'
			}).appendTo("#dinput");
			parenOpen++;
		}else if(chars[ccc] == ')'){
			parenOpen--;
			$("<span>").text(this).css({
				color: textColor[parenOpen%10]
				,'font-weight': 'bold'
			}).appendTo("#dinput");
		}else if(chars[ccc] == 'x'){
			$("<span>").text(this).css({
				color: textColor[10]
			}).appendTo("#dinput");
		}else if(chars[ccc] == 't'){
			$("<span>").text(this).css({
				color: textColor[11]
			}).appendTo("#dinput");
		}else{
			$("<span>").text(this).css({
				color: "#000000"
			}).appendTo("#dinput");
		}
	});
	$("#dinput").val($("div").chars);
	setCaretLocation(this, loc);
	if(!simulating){//		Only update the equation if the simulation is not running
		try{//		parse the input text to check if it is a valid equation, if not, reenter the last valid equation
			eqinput = math.parse(equRaw , scope);
			equ = eqinput.compile();
			equInvalid = false;
		}catch(err){
			eqinput = math.parse(equLast , scope);
			equ = eqinput.compile();
			equInvalid = true;
			equInputField.borderColor = "#FF0000";
			equInputField.borderWidth = 2;			
		}
		if(!equInvalid){
			equLast = equRaw;
			equInputField.borderColor = "#AAAAAA";
			equInputField.borderWidth = 1;
		}
	}
});

//		following code from: http://jsfiddle.net/DerekL/A7gL2/
function setCaretLocation(ele, pos){
	var range = document.createRange(),
		sel = window.getSelection();
	if(ele.childNodes[pos - 1] != null)//		removed error
		range.setStart(ele.childNodes[pos - 1], 1);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
}

function getCaretLocation(element){
	try{
		var range = window.getSelection().getRangeAt(0),
			preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.startContainer, range.startOffset);
	}catch(err){
		return 0;
	}
	return preCaretRange.toString().length;
}



//		-----------------------------------------------------------------------		[   Set up Equation Input Box   ]		-----------------------------------------------------------------------
function setUpInput(){
	ctx.font = "60px Arial";
	equInputField = document.getElementById('dinput').style;//		used to set the border color when the equation contains errors
	//equInput.onkeydown = handleEnter;//		execute function on key press
	equRaw = defaultEqu;
	equLast = defaultEqu;
	$("#dinput").text(defaultEqu);//		set the input field to have the default equation. Then update it and set it active (focus).
	$('#dinput').focus();
	scope = {x: 0 , t: 0};
	eqinput = math.parse(equRaw , scope);
	equ = eqinput.compile();
	//$("div").keyup();//		update equation line to match the default equation.
	//$('#div').trigger('keyup');

	//		https://stackoverflow.com/questions/20830353/how-to-make-an-elements-content-editable-with-javascript-or-jquery
}


//		-----------------------------------------------------------------------		[   Draw Grid   ]		-----------------------------------------------------------------------
function drawGrid(){//		draw a line at every 10 units
	ctx.strokeStyle="#C5C5C5";
	
	//		change what grid incraments are visible based on screen scale
	if(screenScale < 1.5)
		gridScale = 100;
	else if(screenScale < 25)
		gridScale = 10;
	else if(screenScale < 350)
		gridScale = 1;
	else
		gridScale = 0.1;
		
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
//		-----------------------------------------------------------------------		[   Draw background .svg   ]		-----------------------------------------------------------------------
		ctx.drawImage( background , (-screenx - 200)* screenScale , (screeny - 200) * screenScale , 400*screenScale , 400*screenScale);

	

//		-----------------------------------------------------------------------		[   Draw y = next to equation input   ]		-----------------------------------------------------------------------

	//		write equation the line is using if the equation in the input box is invalid and therefore, is not being used
	if(equInvalid){//		invalid equation, show y = old equation
		ctx.fillStyle = "#888888";
		ctx.fillText("y = " + equLast , Math.round(screenWidth * 0.03) , Math.round(screenHeight*0.86));
	}else{
		ctx.fillStyle = "black";
		ctx.fillText("y =", Math.round(screenWidth * 0.03) , Math.round(screenHeight*0.94));
	}
}

//		-----------------------------------------------------------------------		[   Draw Line   ]		-----------------------------------------------------------------------
function drawLine(){
	ctx.lineWidth = 3;
	//		testing		(x-13)^2-20+sin(t/2)*20
	//	----------------------------------		[   draw time independent line (light grey)   ]		----------------------------------
	if(useTime){
		//		draw time independent (t=0) equation line in grey
		ctx.strokeStyle="#AAAAAA";
		ctx.beginPath();
		scope = {x: screenx , t: 0 , z: 0};
		ctx.moveTo(0 , (-equ.eval(scope) + screeny)*screenScale);
	
		for(i = 5 ; i < screenWidth ; i+=5){
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
	
		for(i = 5 ; i < screenWidth ; i+=5){
			scope = {x: i/screenScale + screenx , t: frameTime , z: 20};
			ctx.lineTo(i , (-equ.eval(scope) + screeny)*screenScale);
		}
		ctx.stroke();

		ctx.strokeStyle="#70BB60";
		ctx.beginPath();
		scope = {x: screenx , t: frameTime , z: -20};
		ctx.moveTo(0 , (-equ.eval(scope) + screeny)*screenScale);
	
		for(i = 5 ; i < screenWidth ; i+=5){
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
	
	for(i = 5 ; i < screenWidth ; i+=5){
		ctx.lineTo(i , (-equation(i/screenScale + screenx) + screeny)*screenScale);
	}
	ctx.stroke();
}

//	----------------------------------		[   Display coordinates on line near cursor   ]		----------------------------------
function cursorPosition(){
	dx = mouseX/screenScale + screenx;
	dy = equation(dx);
	ctx.fillText( "X = " + (Math.round(dx*100)/100).toString() + " Y = " + (Math.round(dy*100)/100).toString(),
		Math.max(Math.min(mouseX , Math.round(screenWidth - 600)) , 10) ,
		Math.max(Math.min(mouseY , Math.round(screenHeight - 140)) , 50));
	
	if(equation(dx + 0.15) < dy && equation(dx - 0.15) < dy){//		close to a local maxima
		ltmp = dx - 0.15;//		left x value
		dydt = equation(ltmp);//	left y value
		rtmp = dx + 0.15;//	right x value
		tmspy = equation(rtmp);//		right y value
		ftmp = 0.15;//		2x gap between ltmp and rtmp
		dtmp = dy;//		center y value
		for(i = 0 ; i < 11 ; i++){//		covering an area of 0.3 (0.15*2), the precision will be 0.3/2^11 = 0.00015
			if(Math.abs(dydt - dtmp) < Math.abs(tmspy - dtmp)){//		slope is less (closer to maxima) on the left side
				dtmp = equation(dydt + ftmp/2);//		shift center y ftmp/2 to the left
				
				rtmp -= ftmp;//		shift right point to where the center used to be
				tmspy = dtmp;//		set right y value to center y value
			}else{
				dtmp = equation(ftmp - ftmp/2);
				
				ltmp += ftmp;
				dydt = dtmp;
			}
			ftmp *= 0.5;//		half the gap between left and right
		}

		ctx.fillText( "Local Maxima:",
			Math.max(Math.min(mouseX , Math.round(screenWidth - 400)) , 10) ,
			Math.max(Math.min(mouseY-100 , Math.round(screenHeight - 200)) , 50));

		ctx.fillText( "X = " + (Math.round((ltmp+rtmp)/2*1000)/1000).toString() + "\nY = " + (Math.round(dtmp*1000)/1000).toString(),
			Math.max(Math.min(mouseX , Math.round(screenWidth - 400)) , 10) ,
			Math.max(Math.min(mouseY-50 , Math.round(screenHeight - 250)) , 100));
		
		ctx.beginPath();
		ctx.arc( ((ltmp+rtmp)/2-screenx)*screenScale , -(dtmp-screeny)*screenScale , 4 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

	}else if(equation(dx + 0.15) > dy && equation(dx - 0.15) > dy){

	}
	
	ctx.beginPath();
	ctx.arc( mouseX , -(dy-screeny)*screenScale , 4 , 0 , endAngle);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}


function equation(input){
	if(useZ){
		scope = {x: input , t: frameTime , z: tempZ};
	}else{
		scope = {x: input , t: frameTime};
	}
	return equ.eval(scope);//		negative because in canvas, down is posative
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

