/*
	Click and drag on any number in the input field.
	Drag up to increase and down to decrease
	Hold Ctrl to incrament by 1
	Hold Shift to incrament by 0.01
	Hold nothing to incrament by 0.1
	Hit escape while holding the mouse button to reset to the value it was before you started dragging
*/

var drLast = "1";
var drNew = "";
var drVarChange;
var drStringLength = 50;
var drStringXScreen = 50;
var drStringYScreen = 50;

var drStringInitial;
var drString0;
var drVar1;
var drString2;
var drAddPlus = false;
var drY = 0;
var drHold = false;
var drFirst = false;//		dragging but no variables have changed yet.
var drInputField;

var drOnScreenBottom = false;
var rdBottomFrame = 0;


//		----------------------------------------------------		[   Scroll Wheel (Incrament Variable)   ]		----------------------------------------------------
document.addEventListener('wheel', function(e){
	if(drHold || isDrag)//		scrolling the mouse wheel does nothing while dragging a variable
		return;
	var evt = e==null ? event : e;//		firefox compatibility	

	//		check if the player is trying to edit an actual input field
	if(document.activeElement.contentEditable != "true")
		return;
	
	drInputField = document.activeElement;
	//		get length of text being replaced
	drStringYScreen = parseInt(drInputField.style.top) + 57;

	if(Math.abs(evt.clientY - drStringYScreen) < 32){//		skip all if cursor is not at the right Y position to be over any variables
		//		variables needed by both versions
		stmp = drInputField.innerText;
		ctx.font="35px Arial";
		drStringXScreen = parseInt(drInputField.style.left);//		left edge of textBox in screen coordinates

		//if(dragAnyNumber){
			//	/-?\d+/g
			//		find which numbers in the drInputField are beneath the cursor and incrament them by 1
			drInputField.innerText = stmp.replace(/\+?-?\d+\.?\d*/g , function (charMatch , index) {//		replace any number in the string
				ftmp = ctx.measureText(stmp.substring(0 , index)).width;//		get length of text that is left of the target string
				drStringLength = ctx.measureText(charMatch).width;//		screen length of string to be selected
				if(Math.abs(evt.clientX - drStringXScreen - drStringLength/2 - ftmp) < drStringLength/2 + 2){//		cursor is over this text
				
				
				
		//			NEED TO FIND A WAY TO STOP THE SCREEN FROM ZOOMING HERE IN PIECEWISE LEVELS
				
				
				
					drVar1 = parseFloat(charMatch);
//					xtmp = Math.round((parseFloat(charMatch) - Math.sign(e.deltaY) * (shiftHeld?0.1:1))*100)/100;//		incrament by 0.1 if shift is held, otherwise, incrament by 1

					if(shiftHeld){//		holding shift, incrament by 0.01
						drVar1 = Math.round(drVar1*100 - Math.sign(e.deltaY) )/100;
					}else if(ctrlHeld){//		holding ctrl, incrament by 1
						drVar1 = Math.round(drVar1*100 - Math.sign(e.deltaY)*100 )/100;
					}else{//		holding only the mouse button, incrament by 0.1
						drVar1 = Math.round(drVar1*100 - Math.sign(e.deltaY)*10 )/100;
					}

					drNew = stmp.charAt(index - 1);//		get character before number
					if(drVar1 < 0){
						return drVar1;
					}else{//		for posative numbers, add a + if the number is not proceeded by another opperation
						if(index == 0 || drNew == '*' || drNew == '/' || drNew == '^' || drNew == '%' || drNew == '('){
							return drVar1;
						}else{//		if the number is posative and may not have an opperation before it, add a +
							return "+" + drVar1;
						}
					}
				}else{
					return charMatch;
				}
			}); 

			checkInputFields(drInputField);
	}
});


//		----------------------------------------------------		[   Mouse Down   ]		----------------------------------------------------
document.addEventListener('mousedown', function(e){
	var evt = e==null ? event : e;//		firefox compatibility	
	
	if(isDrag)//		cannot drag text input while using drag based input
		return;
	if( evt.which == 1 ){//		left click
		
		
		//		check if the player is trying to edit an actual input field
		if(document.activeElement.contentEditable != "true")
			return;
		
		drInputField = document.activeElement;
		
		drStringYScreen = parseInt(drInputField.style.top) + 57;
		if(Math.abs(evt.clientY - drStringYScreen) < 32){//		skip all if cursor is not at the right Y position to be over any variables
			
			drStringInitial = drInputField.innerText;
			ctx.font="35px Arial";
			drStringXScreen = parseInt(drInputField.style.left);//		left edge of textBox in screen coordinates


//			var results = drStringInitial.match(/\+?-?\d+\.?\d*/g);
	//			console.log("loging " + results);
		//	console.log("drag");


			var regex = /\+?-?\d+\.?\d*/g;

			while(match = regex.exec(drStringInitial)){
			//for(i = results.length-1 ; i > -1 ; i--){
				ftmp = ctx.measureText(drStringInitial.substring(0 , match.index)).width;//		get length of text that is left of the target string
				drStringLength = ctx.measureText(match).width;//		screen length of string to be selected
				if(Math.abs(evt.clientX - drStringXScreen - drStringLength/2 - ftmp) < drStringLength/2 + 2){//		cursor is over this text
					//		record variables so moving the cursor will incrament this variable.
					drHold = true;
					drFirst = true;
				//	dragIndex = results[i].index;
				//	dragLength = results[i].length;
					drString0 = drStringInitial.substring(0 , match.index);//		string before the bit being changed
					drVar1 = parseFloat(match);//		store the number being dragged
					drString2 = drStringInitial.substring(match.index + match.toString().length);
					//	only add a plus if not the first text || not preceded by * || not preceded by * / etc.
					drAddPlus = !(match.index == 0 || drStringInitial[match.index-1] == '*' || drStringInitial[match.index-1] == '/' || drStringInitial[match.index-1] == '^' || drStringInitial[match.index-1] == '%' || drStringInitial[match.index-1] == '(');
					drY = evt.clientY;
//					console.log(drAddPlus + " at " + drStringInitial[match.index-1]);
//					console.log(drString0 + " - " +  drVar1  + " - " + drString2);
					document.body.style.cursor = "ns-resize";
					break;
				}
			}
		}
	}
});

//		----------------------------------------------------		[   Mouse Up   ]		----------------------------------------------------
document.addEventListener('mouseup', function(e){
	var evt = e==null ? event : e;//		firefox compatibility	

	if( evt.which == 1 ){//		left click
		drHold = false;
		document.body.style.cursor = "auto";
	}
});


//		----------------------------------------------------		[   Key Down   ]		----------------------------------------------------
document.addEventListener("keydown", function(e){
	if(e.keyCode == 27 && drHold){//		Escape	//		Escape has been pressed, reset value to what it was before the player changed it
		drHold = false;
		mainInput.innerText = drStringInitial;
		checkInputFields(mainInput);
	}
});

//		----------------------------------------------------		[   Mouse Move   ]		----------------------------------------------------
document.addEventListener('mousemove', dragMouseMove);
document.addEventListener('touchmove', dragMouseMove);

function dragMouseMove(e){
	if(paused)//	cancel on pause
		drHold = false;
	
	if(drHold){//		if dragging a variable, increment that variable
		equExecutingUndo = false;//		activate undo mode so all the values you scroll through before releasing the mouse are not added of the undo list
		var evt = e==null ? event : e;//		firefox compatibility	
		//		require the cursor to move 45 before changing the variable initially so you don't accidentally change variables while highlighting.
		if(Math.abs(evt.clientY - drY) > (drFirst?25:5)){//		cursor has moved enough for at least a change of 1 increment (> 10 pixels)
			var ytmp = drVar1;
			if(shiftHeld){//		holding shift, increment by 0.01
				drVar1 = Math.round(drVar1*100 + Math.round((drY - evt.clientY)*0.05) )/100;
			}else if(ctrlHeld){//		holding ctrl, increment by 1
				drVar1 = Math.round(drVar1*100 + Math.round((drY - evt.clientY)*0.05)*100 )/100;
			}else{//		holding only the mouse button, increment by 0.1
				drVar1 = Math.round(drVar1*100 + Math.round((drY - evt.clientY)*0.05)*10 )/100;
			}
			if(drVar1 != ytmp){//		only update if variables changed
				drY = evt.clientY;
				//mainInput.innerText = drString0 + drVar1 + drString2;
				drInputField.innerText = drString0 + ((drAddPlus && drVar1 >= 0) ?"+":"") + drVar1 + drString2;
				checkInputFields(drInputField);
				drFirst = false;
			}
		}
		
		if(screenHeight - evt.clientY < 15){//		within 10 pixels of the bottom of the screen
			if(!drOnScreenBottom){
				window.requestAnimationFrame(bottomOfScreenScroll);
				drOnScreenBottom = true;
			}
		}else{
			drOnScreenBottom = false;
		}
	}
}

//		----------------------------------------------------		[   Bottom of Screen Hold   ]		----------------------------------------------------
function bottomOfScreenScroll(){
	if(paused)//	cancel on pause
		return;
	//		every frame the cursor remains within 15 pixels of the bottom of the screen, increment the value
	if(drOnScreenBottom){
		if(rdBottomFrame > 7){//		only increment every 7th frame
			if(shiftHeld){//		holding shift, increment by 0.01
				drVar1 = Math.round(drVar1*100 - 1)/100;
			}else if(ctrlHeld){//		holding ctrl, increment by 1
				drVar1 = Math.round(drVar1*100 - 100)/100;
			}else{//		holding only the mouse button, increment by 0.1
				drVar1 = Math.round(drVar1*100 - 10)/100;
			}
			drInputField.innerText = drString0 + ((drAddPlus && drVar1 >= 0) ?"+":"") + drVar1 + drString2;
			checkInputFields(drInputField);
			rdBottomFrame = 0;
		}else{
			rdBottomFrame++;//		this may make bottom screen scrolling framerate dependant
		}
		window.requestAnimationFrame(bottomOfScreenScroll);
	}
}

