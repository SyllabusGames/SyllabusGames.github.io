//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var equChars;
var containsVariables = false;
var pieEquInput = [];//		used when multiple input fields are needed but input field widths and y positions will not be changed.
var yEqualsText;
var yPrimeEqualsText;
var parenOpen = 0;

var equRaw = "0";
var equLast = "0";

var equUndo = [];
var equExecutingUndo = false;
var equCurrentUndo = 0;

function setUpAllInputs(){
	//	----------------------------------		[   Main Input field   ]		----------------------------------
//		create main input field
	mainInput = document.createElement("p");
	mainInput.setAttribute("contentEditable" , "true");
	mainInput.style = "position:absolute;left:60px;top:720px;width:1480px;font-size:35px; font-family:'Arial'; background-color: #FFFFFFBB; border:1px solid #AAAAAA;";
	mainInput.innerHTML = "-x";
	mainInput.style.display = "none";
	mainInput.style.zIndex = "990";//		input field should always be above everything except Play/Pause button which is on 991 (and so will any input fields made by cloning it)
	document.body.appendChild(mainInput);
	
	//		create y= text left of the input field
	yEqualsText = document.createElement("g");
	yEqualsText.style.position = "absolute";
	yEqualsText.style.left = "6px";
	yEqualsText.innerHTML = '<text class="unselectable" style="font-size: 35px; font-family: Arial; color: black;">y=</text>';//		class"unselectable" declared in CoSineRider.html"
	// yEqualsText.style.top = (screenHeight-50) + "px";
	document.body.appendChild(yEqualsText);
	
	yPrimeEqualsText = yEqualsText.cloneNode(true);
//	yPrimeEqualsText.style.display = "none";
	document.body.appendChild(yPrimeEqualsText);
	
	//	----------------------------------		[   piecewise inputs   ]		----------------------------------

	//		add MainInput as the first piecwise input
	pieEquInput.push(mainInput);
	
	//		create elements holding the "< x <" text on screen allong with the , between the input and piecewise range limits. Class is set to "unselectable". See "CoSineRider.html"
	pieTmp = document.createElement("g");
	pieTmp.innerHTML = '<pre class="unselectable" style="font-size: 35px; font-family: Arial;">,            < x < </pre>';
	pieTmp.style.position = "absolute";
	document.body.appendChild(pieTmp);
	pieLimitsText.push(pieTmp);

	pieTmp = pieTmp.cloneNode(true);		document.body.appendChild(pieTmp);		pieLimitsText.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);		document.body.appendChild(pieTmp);		pieLimitsText.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);		document.body.appendChild(pieTmp);		pieLimitsText.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);		document.body.appendChild(pieTmp);		pieLimitsText.push(pieTmp);

	//		create 4 more equation input fields for piecewise levels
	var pieTmp = mainInput.cloneNode(true);
	pieEquInput.push(pieTmp);
	document.body.appendChild(pieTmp);

	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieEquInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieEquInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieEquInput.push(pieTmp);
	
	//		create the 5 right limit input fields
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.width = "100px";	pieTmp.style.overflow = "hidden"; pieTmp.style.whiteSpace = "nowrap";	document.body.appendChild(pieTmp);	pieRightInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieRightInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieRightInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieRightInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieRightInput.push(pieTmp);

	//		create the 5 left limit input fields
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieLeftInput.push(pieTmp);
	pieTmp.style.textAlign = "right";//		left inputs have right justified text
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieLeftInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieLeftInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieLeftInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	document.body.appendChild(pieTmp);	pieLeftInput.push(pieTmp);

	equInputField = mainInput.style;//		used to set the border color when the equation contains errors
	
	
	
	//	----------------------------------		[   fill-in-the-blanks inputs   ]		----------------------------------

	//		create elements holding the unchangeable equation text between the fillable blanks
	blankTmp = document.createElement("g");
	blankTmp.innerHTML = '<pre class="unselectable" style="font-size: 35px; font-family: Arial;">|  p|</pre>';
	blankTmp.style.position = "absolute";
	document.body.appendChild(blankTmp);
	blankEquText.push(blankTmp);

	blankTmp = blankTmp.cloneNode(true);		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);

	//		create equation input fields
	blankTmp = mainInput.cloneNode(true);
	blankTmp.setAttribute("contentEditable" , "true");
	blankTmp.innerHTML = "2";
	blankTmp.style.width = "80px";
	blankTmp.style.whiteSpace = "nowrap";
	blankTmp.style.overflow = "hidden";
	blankTmp.style.color = _colors[0];
	document.body.appendChild(blankTmp);
	blankEquInput.push(blankTmp);
	//		create 7 more input fields
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.color = _colors[1];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.color = _colors[2];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.color = _colors[3];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.color = _colors[4];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.color = _colors[5];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.color = _colors[6];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.color = _colors[7];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	
	blankEquText.push()
	//		hide main input
	mainInput.style.display = "none";
	
}

var q = 0;//	integer to only be used in equation()
function equation(input){
	if(useZ){
		scope = {x: input , t: frameTime , z: tempZ};
	}else{
		scope = {x: input , t: frameTime};
	}
	
	
	if(isPiecewise){
		for(q = 0 ; q < pieEquInputsUsed ; q++){
			//		check that the x position (input) is between the limits. If pieLeftInputCompiled[q] equals false, a constant value is used. Otherwise
			//			the limit is time dependent and must be evaluated.
			if(input < ((pieRightInputCompiled[q] == false)? pieRightLimit[q]:pieRightInputCompiled[q].eval({t: frameTime})) && 
				input >= ((pieLeftInputCompiled[q] == false)? pieLeftLimit[q]:pieLeftInputCompiled[q].eval({t: frameTime}))){
				if(useDerivative)
					return (pieEquCompiled[q].eval({x: input , t: frameTime , z: tempZ}) - pieEquCompiled[q].eval({x: input - 0.001 , t: frameTime , z: tempZ}))*1000;
				else
					return pieEquCompiled[q].eval(scope);
			}
		}
		//		current X position is not within a range so set to very low value to make a pit.
		return (-9001);
	}else{
		if(useDerivative)
			return (equCompiled.eval({x: input , t: frameTime , z: tempZ}) - equCompiled.eval({x: input - 0.001 , t: frameTime , z: tempZ}))*1000;
		else
			return equCompiled.eval(scope);
	}
}

//	copied from		http://jsfiddle.net/WeWy7/3/
function restoreSelection(){
	var charIndex = 0
	var range = document.createRange();
	range.setStart(activeInput, 0);
	range.collapse(true);
	var nodeStack = [activeInput], node, foundStart = false, stop = false;
        
	while (!stop && (node = nodeStack.pop())) {
		if (node.nodeType == 3) {
			var nextCharIndex = charIndex + node.length;
			if (!foundStart && lyy >= charIndex && lyy <= nextCharIndex) {
				range.setStart(node, lyy - charIndex);
				foundStart = true;
			}
			if (foundStart && ryy >= charIndex && ryy <= nextCharIndex) {
				range.setEnd(node, ryy - charIndex);
				stop = true;
			}
			charIndex = nextCharIndex;
		} else {
			var i = node.childNodes.length;
			while (i--){
				nodeStack.push(node.childNodes[i]);
			}
		}
	}

	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

//		reference: http://jsfiddle.net/timdown/vXnCM/
//		setEnd reference: http://jsfiddle.net/WeWy7/3/

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

//		hides the input fields when a menu is opened
function showHideInputs(show){//		"none" / "block"
	if(isPiecewise){
		pieShowHideInputs(show);
	}else if(isMulti){
		multiShowHideInputs(show);
	}else if(isProxyVar){
		pVarShowHideInputs(show);
	}else if(isProxyFunction){
		pFunShowHideInputs(show);
	}else if(isDrag){
		dragShowHideInputs(show);
	}else if(isFillBlanks){
		blankShowHideInputs(show);
	}else if (isProgramming){
		proShowHideInputs(show);
	}else if(isCutscene){
		//		no input to show/hide
	}else{
		typeShowHideInputs(show);
	}
	
	playPauseButton.style.display = show;
	yEqualsText.style.display = show;
	if(useDerivative)
		yPrimeEqualsText.style.display = show;
}

	//	----------------------------------		[   Equation Changed   ]		----------------------------------
var inputZ = 0;
function checkInputFields(selectedElement){
	if(selectedElement == "all"){
		if(isPiecewise){
			for(var num = pieEquInputsUsed-1 ; num > -1 ; num--){//		for each input field including the main input [0]
				pieCheckInput(pieEquInput[num]);
			}
			return;
		}else if(isMulti){
			for(var num = pieEquInputsUsed ; num > -1 ; num--){//		for each input field excluding the main input [0]
				multiCheckInput(pieEquInput[num]);
			}
			return;
		}else if(isProxyVar){
			for(var num = pieEquInputsUsed ; num > 0 ; num--){//		for each input field excluding the main input [0]
				pVarCheckInput(pieEquInput[num]);
			}
			return;
		}else if(isProxyFunction){
			for(var num = pieEquInputsUsed ; num > 0 ; num--){//		for each input field excluding the main input [0]
				pFunCheckInput(pieEquInput[num]);
			}
			return;
		}else if(isProgramming){
			for(var num = pieEquInputsUsed ; num > -1 ; num--){//		for each input field including the main input [0]
				proCheckInput(pieEquInput[num]);
			}
			return;
		}
	}
	
	if(isPiecewise){
		pieCheckInput(selectedElement);
	}else if(isMulti){
		multiCheckInput(selectedElement);
	}else if(isProxyVar){
		pVarCheckInput(selectedElement);
	}else if(isProxyFunction){
		pFunCheckInput(selectedElement);
	}else if(isDrag){
		//		run nothing. Drag input is always updated within InputDrag.js
	}else if(isFillBlanks){
		blankCheckInput(selectedElement);
	}else if(isProgramming){
		proCheckInput(selectedElement);
	}else if(isCutscene){
		//		no input to check
	}else{
		typeCheckInput();
	}
	//		update the displayed derivative equation
	if(useDerivative){
		yPrimeEqualsText.innerHTML = '<text class="unselectable" style="font-size: 35px; font-family: Arial; color: black;">y(dx)=' + 
		formatTypedInput((math.derivative( equRaw , 'x' ) + " " )) + '</text>';//		class"unselectable" declared in CoSineRider.html"
		//		add a blank space to the end to convert it to a string
	}
}

function absBarToFunction(equString){
	//		the following change is made for the parser, not for the player to see
	if((equString.match(/\|/g) || []).length > 0){//		equation contains |-x| (absolute value bars)
		ftmp = 0;
		equString = equString.replace(/\|/g, (match, $1) => {
			if(ftmp++ % 2 == 0)
				return "abs(";
			else
				return ")";
		});
	}
	return equString;
}

//	----------------------------------		[   Recolor Input Text   ]		----------------------------------
function formatTypedInput(equChars){
	equChars = equChars.replace("**" , "^");
		
	equChars = equChars.split("");//		break input string into a character array
	k = equChars.length;
	parenOpen = 0;
	
	dtmp = -window.getSelection().toString().length;//		dtmp is current selection end position
	rtmp = 0;//		rtmp is the number of characters over the caret is in the current node (current font style/color)
	containsVariables = false;
	var equColored = "";
	if(ftmp == 0){//		caret is at 0 , 0
		lyy = 0;//		right end of selection. lyy is left end of selection.
	}
	for(i = 0 ; i < k ; i++){
		switch(equChars[i]){
			case 'x':
				equColored += '<a style="color:#FF0000">x</a>';
				rtmp++;
				containsVariables = true;
				break;
			case 't':
				equColored += '<a style="color:#00A000">t</a>';
				rtmp++;
				containsVariables = true;
				break;
			case 'z':
				equColored += '<a style="color:#0000FF">z</a>';
				rtmp++;
				containsVariables = true;
				break;
			case '(':
				equColored += '<a style="color:' + _colors[parenOpen%10] + '">(</a>';
				parenOpen++;
				rtmp++;
				break;
			case ')':
				parenOpen--;
				if(parenOpen < 0){//		more ( than )
					equColored += '<i><b>)</b></i>';
					parenOpen++;//		this makes the extra ) not effect the rest of the equation's )s coloring
				}else
					equColored += '<a style="color:' + _colors[parenOpen%10] + '">)</a>';
				rtmp++;
				break;
			case ' ':
				break;//		remove spaces
			case 'p':
				if(i < equChars.length-1 && equChars[i+1] == 'i'){
					equColored += '<a style="color:#F08030">π</a>';
					//rtmp--;//		back the slelection up one character left since the i has been removed
					i++;//		the character i is skipped
				}else{//		run default
					equColored += equChars[i];
				}
				rtmp++;
				break;
			case 'e':
				equColored += '<a style="color:#F08030">e</a>';
				rtmp++;
				break;
			case '<':
				equColored += '&lt';
				rtmp++;
				break;
			case 'i'://		this has to be last so it can fall through to default
				if(i == 0 || equChars[i-1] != 's'){//		only color i as an imaginary number if it is not part of the word sin
					if(equChars[i-1] == 'p')//		this is the i in pi
						equColored += '<a style="color:#F08030">i</a>';
					else//		this i is immaginary
						equColored += '<a style="color:#F08030"><em>i</em></a>';
					rtmp++;
					break;
				}
			default:
				equColored += equChars[i];
				rtmp++;
				break;
		}
		ftmp--;
	}
	lyy = rtmp + ftmp;//		set caret position
	ryy = rtmp + ftmp;//		set end of selection
	return equColored;
}






