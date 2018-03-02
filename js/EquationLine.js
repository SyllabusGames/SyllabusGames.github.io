/*		contains line from equation
 *			euqation text input
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
	$("#dinput").text(defaultEqu);
	scope = {x: 0 , t: 0};
	eqinput = math.parse(equRaw , scope);
	equ = eqinput.compile();
	//$("div").keyup();//		update equation line to match the default equation.
	//$('#div').trigger('keyup');
	$('#dinput').focus();

	//		https://stackoverflow.com/questions/20830353/how-to-make-an-elements-content-editable-with-javascript-or-jquery
}


//		-----------------------------------------------------------------------		[   Draw Grid   ]		-----------------------------------------------------------------------
function drawGrid(){//		draw a line at every 10 units
	ctx.strokeStyle="#C0C0C0";
	for(i = Math.round(-screenx/10) ; i < -screenx/10+160/screenScale ; i++){//		vertical lines
		if(i%10 == 0){
			ctx.lineWidth = 3;
		}else{
			ctx.lineWidth = 1;
		}
		ctx.beginPath();
		ctx.moveTo((screenx + i*10) * screenScale , 0);//		(graph left edge + line number*line spacing(10))*scale
		ctx.lineTo((screenx + i*10) * screenScale , 800);
		ctx.stroke();
	}
	for(i = Math.round(screeny/10) ; i < screeny/10+80/screenScale ; i++){//		horizontal lines
		if(i%10 == 0){
			ctx.lineWidth = 3;
		}else{
			ctx.lineWidth = 1;
		}
		ctx.beginPath();
		ctx.moveTo(0 , (-screeny + i*10) * screenScale);
		ctx.lineTo(1600 , (-screeny + i*10) * screenScale);
		ctx.stroke();
	}

//		-----------------------------------------------------------------------		[   Draw y = next to equation input   ]		-----------------------------------------------------------------------

	//		write equation the line is using if the equation in the input box is invalid and therefore, is not being used
	if(equInvalid){//		invalid equation, show y = old equation
		ctx.fillStyle = "#888888";
		ctx.fillText("y = " + equLast ,185,670);
	}else{
		ctx.fillStyle = "black";
		ctx.fillText("y =", 185, 742);
	}
}

//		-----------------------------------------------------------------------		[   Draw Line   ]		-----------------------------------------------------------------------
function drawLine(){
	//		graph time independent curve
	ctx.strokeStyle="#AAAAAA";
	ctx.lineWidth = 4;
	i = -screenx/10;
	ftmp = 160/screenScale - screenx/10;
	//		draw first point since it uses moveTo() instead of lineTo()
	ctx.beginPath();
	ctx.moveTo(screenx * screenScale + (i * 10) * screenScale, -((screenScale*equ.eval(scope) + screeny * screenScale)));
	i += graphResolution/screenScale;

	while(i < ftmp){
		i += graphResolution/screenScale;
		scope = {x: i*10.0 , t: 0};
		ctx.lineTo(screenx * screenScale + (i * 10) * screenScale, -(screenScale*equ.eval(scope) + screeny * screenScale));
	}
	ctx.stroke();
	//		graph time independent curve

	
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 4;
	i = -screenx/10;// Offset by screenx to keep left end of line on screen
	ftmp = 160/screenScale - screenx/10;//		adapt total point count to match spacing of points. Offset by screenx to keep right end of line on screen
	
	ctx.beginPath();
	ctx.moveTo(screenx * screenScale + (i * 10) * screenScale, equation(i*10.0 + screenx));
	i += graphResolution/screenScale;
	
	while(i < ftmp){
		//		space vertecies 10 pixels appart on the x
		ctx.lineTo(screenx * screenScale + (i * 10) * screenScale, equation(i*10.0 + screenx));
		//i++;//= c.width/200;
		i += graphResolution/screenScale;//		adaptive line resolution keeps points at the same spacing at every scale
		ctx.lineTo(screenx * screenScale + (i * 10) * screenScale, equation(i*10.0 + screenx));
	}
	ctx.stroke();
}

function equation(input){
	scope = {x: input - screenx , t: frameTime};
	return -((screenScale*equ.eval(scope) + screeny * screenScale));//		negative because in canvas, down is posative
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

