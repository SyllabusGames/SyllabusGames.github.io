var dragVariables = true;
var dragLast = "1";
var dragNew = "";
var varChange;
var dragStringLength = 50;
var stringXScreen = 50;
var stringYScreen = 50;

var dragAnyNumber = true;

var dragString0;
var dragVar1;
var dragString2;
var dragAddPlus = false;
var dragY = 0;
var dragHold = false;
var dragFirst = false;//		dragging but no variables have changed yet.



//		----------------------------------------------------		[   Scroll Wheel (Incrament Variable)   ]		----------------------------------------------------
document.addEventListener('wheel', function(e){
	if(dragHold)//		scrolling the mouse wheel does nothing while dragging a variable
		return;
	var evt = e==null ? event : e;//		firefox compatibility	
	
	//		get length of text being replaced
	stringYScreen = parseInt(mainInput.style.top) + 57;

	if(Math.abs(evt.clientY - stringYScreen) < 32){//		skip all if cursor is not at the right Y position to be over any variables
		//		variables needed by both versions
		stmp = mainInput.innerText;
		ctx.font="35px Arial";
		stringXScreen = parseInt(mainInput.style.left);//		left edge of textBox in screen coordinates

		if(dragAnyNumber){
			//	/-?\d+/g
			//		find which numbers in the mainInput are beneath the cursor and incrament them by 1
			mainInput.innerText = stmp.replace(/\+?-?\d+\.?\d*/g , function (charMatch , index) {//		replace any number in the string
				ftmp = ctx.measureText(stmp.substring(0 , index)).width;//		get length of text that is left of the target string
				dragStringLength = ctx.measureText(charMatch).width;//		screen length of string to be selected
				if(Math.abs(evt.clientX - stringXScreen - dragStringLength/2 - ftmp) < dragStringLength/2 + 2){//		cursor is over this text
					dragVar1 = parseFloat(charMatch);
//					xtmp = Math.round((parseFloat(charMatch) - Math.sign(e.deltaY) * (writeCursor?0.1:1))*100)/100;//		incrament by 0.1 if shift is held, otherwise, incrament by 1

					if(writeCursor){//		holding shift, incrament by 0.01
						dragVar1 = Math.round(dragVar1*100 - Math.sign(e.deltaY) )/100;
					}else if(ctrlHeld){//		holding ctrl, incrament by 1
						dragVar1 = Math.round(dragVar1*100 - Math.sign(e.deltaY)*100 )/100;
					}else{//		holding only the mouse button, incrament by 0.1
						dragVar1 = Math.round(dragVar1*100 - Math.sign(e.deltaY)*10 )/100;
					}


					dragNew = stmp.charAt(index - 1);//		get character before number
					if(dragVar1 < 0){
						return dragVar1;
					}else{//		for posative numbers, add a + if the number is not proceeded by another opperation
						if(index == 0 || dragNew == '*' || dragNew == '/' || dragNew == '^' || dragNew == '%' || dragNew == '('){
							return dragVar1;
						}else{//		if the number is posative and may not have an opperation before it, add a +
							return "+" + dragVar1;
						}
					}
				}else{
					return charMatch;
				}
			}); 

			checkInputFields();

		}else{//		drag only designated text
			dragStringLength = ctx.measureText(dragLast).width;
			ftmp = ctx.measureText(stmp.substring(0 , stmp.indexOf(dragLast))).width;//		get length of text that is left of the target string
			//		get location of text in question
			stringXScreen += parseInt(mainInput.style.left) + ftmp + dragStringLength/2;//		middle of string being selected (textBox.x + length of text before dragLast + half of dragLast)
	

			//		log to screen	
			ctx.strokeStyle = "#00FF00";
			ctx.fillStyle = "#00FF00";
			ctx.beginPath();
			ctx.arc(stringXScreen , stringYScreen , dragStringLength/2 + 5 , 0 , endAngle);
			ctx.stroke();
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			console.log(stringXScreen + " - " + stringYScreen + " - " + evt.clientX + " - " + evt.clientY);


			//		check if cursor is over text when scrolling
			if(Math.abs(evt.clientX - stringXScreen) < dragStringLength/2 + 5){

				varChange = -Math.sign(e.deltaY);//		makes scroll speed brouser independent.

				dragNew = Math.round(parseFloat(dragLast) + varChange).toString();
				mainInput.innerText = mainInput.innerText.replace(dragLast , dragNew);
				dragLast = dragNew;


				checkInputFields();
			}
		}
	}
});


//		----------------------------------------------------		[   Mouse Down   ]		----------------------------------------------------
document.addEventListener('mousedown', function(e){
	var evt = e==null ? event : e;//		firefox compatibility	
	
	if( evt.which == 1 ){//		left click
		
		stringYScreen = parseInt(mainInput.style.top) + 57;
		if(Math.abs(evt.clientY - stringYScreen) < 32){//		skip all if cursor is not at the right Y position to be over any variables
			
			stmp = mainInput.innerText;
			ctx.font="35px Arial";
			stringXScreen = parseInt(mainInput.style.left);//		left edge of textBox in screen coordinates


//			var results = stmp.match(/\+?-?\d+\.?\d*/g);
	//			console.log("loging " + results);
		//	console.log("drag");


			var regex = /\+?-?\d+\.?\d*/g;

			while(match = regex.exec(stmp)){
			//for(i = results.length-1 ; i > -1 ; i--){
				ftmp = ctx.measureText(stmp.substring(0 , match.index)).width;//		get length of text that is left of the target string
				dragStringLength = ctx.measureText(match).width;//		screen length of string to be selected
				if(Math.abs(evt.clientX - stringXScreen - dragStringLength/2 - ftmp) < dragStringLength/2 + 2){//		cursor is over this text
					//		record variables so moving the cursor will incrament this variable.
					dragHold = true;
					dragFirst = true;
				//	dragIndex = results[i].index;
				//	dragLength = results[i].length;
					dragString0 = stmp.substring(0 , match.index);//		string before the bit being changed
					dragVar1 = parseFloat(match);//		store the number being dragged
					dragString2 = stmp.substring(match.index + match.toString().length);
					//	only add a plus if not the first text || not preceded by * || not preceded by * / etc.
					dragAddPlus = !(match.index == 0 || stmp[match.index-1] == '*' || stmp[match.index-1] == '/' || stmp[match.index-1] == '^' || stmp[match.index-1] == '%' || stmp[match.index-1] == '(');
					dragY = evt.clientY;
					console.log(dragAddPlus + " at " + stmp[match.index-1]);
					console.log(dragString0 + " - " +  dragVar1  + " - " + dragString2);
					document.body.style.cursor = "ns-resize";
					break;
				}
			}
		}
	}
});


//		----------------------------------------------------		[   Touch Down   ]		----------------------------------------------------
document.addEventListener('touchstart', function(e){
	var evt = e==null ? event : e;//		firefox compatibility	
		
	stringYScreen = parseInt(mainInput.style.top) + 57;
	if(Math.abs(evt.clientY - stringYScreen) < 32){//		skip all if cursor is not at the right Y position to be over any variables
			
		stmp = mainInput.innerText;
		ctx.font="35px Arial";
		stringXScreen = parseInt(mainInput.style.left);//		left edge of textBox in screen coordinates

		var regex = /\+?-?\d+\.?\d*/g;

		while(match = regex.exec(stmp)){
			ftmp = ctx.measureText(stmp.substring(0 , match.index)).width;//		get length of text that is left of the target string
			dragStringLength = ctx.measureText(match).width;//		screen length of string to be selected
			if(Math.abs(evt.clientX - stringXScreen - dragStringLength/2 - ftmp) < dragStringLength/2 + 2){//		cursor is over this text
				dragHold = true;
				dragFirst = true;
				dragString0 = stmp.substring(0 , match.index);//		string before the bit being changed
				dragVar1 = parseFloat(match);//		store the number being dragged
				dragString2 = stmp.substring(match.index + match.toString().length);
				dragAddPlus = !(match.index == 0 || stmp[match.index-1] == '*' || stmp[match.index-1] == '/' || stmp[match.index-1] == '^' || stmp[match.index-1] == '%' || stmp[match.index-1] == '(');
				dragY = evt.clientY;
				console.log(dragAddPlus + " at " + stmp[match.index-1]);
				console.log(dragString0 + " - " +  dragVar1  + " - " + dragString2);
				document.body.style.cursor = "ns-resize";
				break;
			}
		}
	}
});

//		----------------------------------------------------		[   Mouse Up   ]		----------------------------------------------------
document.addEventListener('mouseup', function(e){
	var evt = e==null ? event : e;//		firefox compatibility	

	if( evt.which == 1 ){//		left click
		dragHold = false;
		document.body.style.cursor = "auto";
	}
});


//		----------------------------------------------------		[   Touch Up   ]		----------------------------------------------------
document.addEventListener('touchend', function(e){
	dragHold = false;
});

//		----------------------------------------------------		[   Mouse Move   ]		----------------------------------------------------
document.addEventListener('mousemove', dragMouseMove);
document.addEventListener('touchmove', dragMouseMove);

function dragMouseMove(e){
	if(dragHold){//		if dragging a variable, incrament that variable
		var evt = e==null ? event : e;//		firefox compatibility	
		//		require the cursor to move 45 before changing the variable initially so you don't accidentally change variables while highlighting.
		if(Math.abs(evt.clientY - dragY) > (dragFirst?25:5)){//		cursor has moved enough for at least a change of 1 incrament (> 10 pixels)
			xtmp = dragVar1;
			if(writeCursor){//		holding shift, incrament by 0.01
				dragVar1 = Math.round(dragVar1*100 + Math.round((dragY - evt.clientY)*0.05) )/100;
			}else if(ctrlHeld){//		holding ctrl, incrament by 1
				dragVar1 = Math.round(dragVar1*100 + Math.round((dragY - evt.clientY)*0.05)*100 )/100;
			}else{//		holding only the mouse button, incrament by 0.1
				dragVar1 = Math.round(dragVar1*100 + Math.round((dragY - evt.clientY)*0.05)*10 )/100;
			}
			if(dragVar1 != xtmp){//		only update if variables changed
				dragY = evt.clientY;
				//mainInput.innerText = dragString0 + dragVar1 + dragString2;
				mainInput.innerText = dragString0 + ((dragAddPlus && dragVar1 >= 0) ?"+":"") + dragVar1 + dragString2;
				checkInputFields();
				dragFirst = false;
			}
		}
	}
});