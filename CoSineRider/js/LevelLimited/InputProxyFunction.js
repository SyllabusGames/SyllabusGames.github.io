<<<<<<< HEAD
﻿//	-----	[  This is free and unencumbered software released into the public domain  ]	-----

var pFunCompileTmp;

//		-----------------------------------------------------------------------		[   Set up Equation Input Box   ]		-----------------------------------------------------------------------
function pFunInitialize(){
	equUndo = [];
	equCurrentUndo = 0;
	//		if they add a D to input 0 and there is no D input field, this ↓ makes sure they won't pull in input D from the last level
	pieRaw[2] = "";
	pieRaw[4] = "";
	pieRaw[5] = "";
	pFunScreenResize();//		move input field to the correct place on the screen
}

function pFunScreenResize(){
	k = screenWidth-80;
	for(i = 0 ; i < pieEquInputsUsed + 1 ; i++){//		check all equation input fields and set whichever is avtive as activeInput
		//		move and resize equation input fields
		equInputField = pieEquInput[i].style;
		equInputField.left = "100px";
		equInputField.top = (screenHeight  - 85 - i * 45) + "px";
		equInputField.width = (screenWidth - 120) + "px";
	//	console.log(i);
	//	console.log(pieEquInput[i]);
	}
	pFunUpdateEquDisplay();
//	pieEquInput[0].style.top = "100px"
	
	if(useDerivative){
		yPrimeEqualsText.style.top = (parseInt(yEqualsText.style.top) - 0) + "px";
	}
}

function pFunUpdateEquDisplay(){
	yEqualsText.style.top = (screenHeight-137 - 45 * pieEquInputsUsed) + "px";
	//		class"unselectable" declared in CoSineRider.html"
	switch(pieEquInputsUsed){
		case 4:
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+
				'<br><a style="color:'+_pFunLineColor[3]+'">k(a)=</a><br><a style="color:'+_pFunLineColor[2]+'">h(a)=</a><br><a style="color:'+_pFunLineColor[1]+'">g(a)=</a><br><a style="color:'+_pFunLineColor[0]+'">f(a)=</a><br>y = </p>';
			break;
		case 3:
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+
				'<br><a style="color:'+_pFunLineColor[2]+'">h(a)=</a><br><a style="color:'+_pFunLineColor[1]+'">g(a)=</a><br><a style="color:'+_pFunLineColor[0]+'">f(a)=</a><br>y = </p>';
			break;
		case 2:
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+
				'<br><a style="color:'+_pFunLineColor[1]+'">g(a)=</a><br><a style="color:'+_pFunLineColor[0]+'">f(a)=</a><br>y = </p>';
			break;
		default://	1
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+
				'<br><a style="color:'+_pFunLineColor[0]+'">f(a)=</a><br>y = </p>';

	}
}

function pFunShowHideInputs(showHide){
	for(i = pieEquInput.length-1 ; i > -1 ; i--){
		pieEquInput[i].style.display = showHide;
	}
}

function pFunCheckInput(selectedElement){


	//	----------------------------------		[   Find what input field was selected   ]		----------------------------------
	var inputNum = -1;
	
	for(i = 0 ; i < pieEquInputsUsed+1 ; i++){
		//		check all equation input fields and set whichever is active as activeInput
		if(pieEquInput[i] == selectedElement){
			inputNum = i;
			break;
		}
	}
	//		something other than a piecewise input field was selected.
	if(inputNum == -1)
		return;

	
	//	----------------------------------		[   Reformat Input for Readability   ]		----------------------------------
	activeInput = pieEquInput[i];
	ftmp = getCaretLocation(activeInput);//		ftmp is current caret position
	activeInput.innerHTML = pFunFormatTypedInput(activeInput.innerText);
	restoreSelection();
	
	pieUndoListAdd(selectedElement , pieRaw[inputNum] , activeInput.innerText);
	
	//	----------------------------------		[   Recolor Input Text   ]		----------------------------------
	if(!simulating){//		Only update the equation if the simulation is not running
		equInputField = activeInput.style;
		try{//		parse the input text to check if it is a valid equation to update the input border color to denote a valid/invalid equation
			equInput = math.parse(absBarToFunction(activeInput.innerText) , {a: 2});
			pFunCompileTmp = pieEquCompiled[inputNum];//		store previous compiled equation in case this one is invalid
			pieEquCompiled[inputNum] = equInput.compile();
			equInvalid = false;
		}catch(err){
			equInvalid = true;
			pieEquCompiled[inputNum] = pFunCompileTmp;//		restore previous compiled equation
			equInputField.borderColor = _inputBorderBadColor;
			equInputField.borderWidth = "3px";
		}

		//	----------------------------------		[   Update consolidated equation (input 0)   ]		----------------------------------
		//		last input field changed was a valid equation. Check if the composite equation is also valid and update if so.
		if(!equInvalid){
			//		last input changed was valid. Change input border to reflect this.
			equInputField.borderColor = _inputBorderGoodColor;
			equInputField.borderWidth = "1px";
			
			//		only update pieRaw (read into the display for the y= equation) when an equation is valid
			pieRaw[inputNum] = activeInput.innerText.toLowerCase().replace("π" , "pi");
			equRaw = mainInput.innerText.toLowerCase().replace("π" , "pi");
			//		substitute a,b,c, and d with the inputs for those fields. It doesn't mater if they don't use D because there just won't be and D in the equation.
			//		do not add a ) at the end since I cannot delete the one left from f()
			
			equRaw = equRaw.replace(/f\[(.*?)\]/g , (match, $1) => {//		for each instance of f[]
				stmp = match.substring(2 , match.length-1);//		get the text between [ and ] and remove f[ and ] from the ends
				if(stmp.length > 1)//		string inside [] is more than 1 character. Add () around it so it computes correctly
					stmp = '(' + stmp + ')';
					
				return ('(' +pieRaw[1].replace(/a/g , stmp) + ')');//		replace f[] with the contents of f() with 'a' replaced with the text between 'f[' and ']'
			});
			equRaw = equRaw.replace(/\g\[(.*?)\]/g , (match, $1) => {//		for each instance of g[]
				stmp = match.substring(2 , match.length-1);
				if(stmp.length > 1)
					stmp = '(' + stmp + ')';
					
				return ('(' +pieRaw[2].replace(/a/g , stmp) + ')');
			});
			equRaw = equRaw.replace(/h\[(.*?)\]/g , (match, $1) => {//		for each instance of h[]
				stmp = match.substring(2 , match.length-1);
				if(stmp.length > 1)
					stmp = '(' + stmp + ')';
				return ('(' +pieRaw[3].replace(/a/g , stmp) + ')');
			});
			equRaw = equRaw.replace(/k\[(.*?)\]/g , (match, $1) => {//		for each instance of k[]
				stmp = match.substring(2 , match.length-1);
				if(stmp.length > 1)
					stmp = '(' + stmp + ')';
				return ('(' +pieRaw[4].replace(/a/g , stmp) + ')');
			});
			
			scope = {x: 2 , t: 2 , z: 0};
			//		now run the standard compile function (used in InputText) to compile to composite equation
			try{
				equInput = math.parse(equRaw , scope);
				equCompiled = equInput.compile();
				equInvalid = false;
			}catch(err){
				equInput = math.parse(equLast , scope);
				equCompiled = equInput.compile();
				equInvalid = true;
			}
			if(!equInvalid){//		if the new piece of the equation is not invalid, update the consolidated equation (input 0)
				equLast = equRaw;
			}
		}
	}
	pFunUpdateEquDisplay();
}



//	----------------------------------		[   Recolor Input Text but with only A as a variable   ]		----------------------------------
function pFunFormatTypedInput(equChars){
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
			case 'a':
				equColored += '<a style="color:#FF0000">a</a>';
				rtmp++;
				break;
			//		delete x, t, and z if they are entered. Only a is allowed in sub-functions
			case 'x':
				break;
			case 't':
				break;
			case 'z':
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
		/*if(ftmp == 0){//		current character is the caret position
			lyy = rtmp;
		}
		if(ftmp == dtmp){//	current character is the end of the selection
			ryy = rtmp;
		}*/
	}
	lyy = rtmp + ftmp;//		set caret position
	ryy = rtmp + ftmp;//		set end of selection
	return equColored;
=======
﻿//	-----	[  This is free and unencumbered software released into the public domain  ]	-----

var pFunCompileTmp;

//		-----------------------------------------------------------------------		[   Set up Equation Input Box   ]		-----------------------------------------------------------------------
function pFunInitialize(){
	equUndo = [];
	equCurrentUndo = 0;
	//		if they add a D to input 0 and there is no D input field, this ↓ makes sure they won't pull in input D from the last level
	pieRaw[2] = "";
	pieRaw[4] = "";
	pieRaw[5] = "";
	pFunScreenResize();//		move input field to the correct place on the screen
}

function pFunScreenResize(){
	k = screenWidth-80;
	for(i = 0 ; i < pieEquInputsUsed + 1 ; i++){//		check all equation input fields and set whichever is avtive as activeInput
		//		move and resize equation input fields
		equInputField = pieEquInput[i].style;
		equInputField.left = "100px";
		equInputField.top = (screenHeight  - 85 - i * 45) + "px";
		equInputField.width = (screenWidth - 120) + "px";
	//	console.log(i);
	//	console.log(pieEquInput[i]);
	}
	pFunUpdateEquDisplay();
//	pieEquInput[0].style.top = "100px"
	
	if(useDerivative){
		yPrimeEqualsText.style.top = (parseInt(yEqualsText.style.top) - 0) + "px";
	}
}

function pFunUpdateEquDisplay(){
	yEqualsText.style.top = (screenHeight-137 - 45 * pieEquInputsUsed) + "px";
	//		class"unselectable" declared in CoSineRider.html"
	switch(pieEquInputsUsed){
		case 4:
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+
				'<br><a style="color:'+_pFunLineColor[3]+'">k(a)=</a><br><a style="color:'+_pFunLineColor[2]+'">h(a)=</a><br><a style="color:'+_pFunLineColor[1]+'">g(a)=</a><br><a style="color:'+_pFunLineColor[0]+'">f(a)=</a><br>y = </p>';
			break;
		case 3:
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+
				'<br><a style="color:'+_pFunLineColor[2]+'">h(a)=</a><br><a style="color:'+_pFunLineColor[1]+'">g(a)=</a><br><a style="color:'+_pFunLineColor[0]+'">f(a)=</a><br>y = </p>';
			break;
		case 2:
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+
				'<br><a style="color:'+_pFunLineColor[1]+'">g(a)=</a><br><a style="color:'+_pFunLineColor[0]+'">f(a)=</a><br>y = </p>';
			break;
		default://	1
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+
				'<br><a style="color:'+_pFunLineColor[0]+'">f(a)=</a><br>y = </p>';

	}
}

function pFunShowHideInputs(showHide){
	for(i = pieEquInput.length-1 ; i > -1 ; i--){
		pieEquInput[i].style.display = showHide;
	}
}

function pFunCheckInput(selectedElement){


	//	----------------------------------		[   Find what input field was selected   ]		----------------------------------
	var inputNum = -1;
	
	for(i = 0 ; i < pieEquInputsUsed+1 ; i++){
		//		check all equation input fields and set whichever is active as activeInput
		if(pieEquInput[i] == selectedElement){
			inputNum = i;
			break;
		}
	}
	//		something other than a piecewise input field was selected.
	if(inputNum == -1)
		return;

	
	//	----------------------------------		[   Reformat Input for Readability   ]		----------------------------------
	activeInput = pieEquInput[i];
	ftmp = getCaretLocation(activeInput);//		ftmp is current caret position
	activeInput.innerHTML = pFunFormatTypedInput(activeInput.innerText);
	restoreSelection();
	
	pieUndoListAdd(selectedElement , pieRaw[inputNum] , activeInput.innerText);
	
	//	----------------------------------		[   Recolor Input Text   ]		----------------------------------
	if(!simulating){//		Only update the equation if the simulation is not running
		equInputField = activeInput.style;
		try{//		parse the input text to check if it is a valid equation to update the input border color to denote a valid/invalid equation
			equInput = math.parse(absBarToFunction(activeInput.innerText) , {a: 2});
			pFunCompileTmp = pieEquCompiled[inputNum];//		store previous compiled equation in case this one is invalid
			pieEquCompiled[inputNum] = equInput.compile();
			equInvalid = false;
		}catch(err){
			equInvalid = true;
			pieEquCompiled[inputNum] = pFunCompileTmp;//		restore previous compiled equation
			equInputField.borderColor = _inputBorderBadColor;
			equInputField.borderWidth = "3px";
		}

		//	----------------------------------		[   Update consolidated equation (input 0)   ]		----------------------------------
		//		last input field changed was a valid equation. Check if the composite equation is also valid and update if so.
		if(!equInvalid){
			//		last input changed was valid. Change input border to reflect this.
			equInputField.borderColor = _inputBorderGoodColor;
			equInputField.borderWidth = "1px";
			
			//		only update pieRaw (read into the display for the y= equation) when an equation is valid
			pieRaw[inputNum] = activeInput.innerText.toLowerCase().replace("π" , "pi");
			equRaw = mainInput.innerText.toLowerCase().replace("π" , "pi");
			//		substitute a,b,c, and d with the inputs for those fields. It doesn't mater if they don't use D because there just won't be and D in the equation.
			//		do not add a ) at the end since I cannot delete the one left from f()
			
			equRaw = equRaw.replace(/f\[(.*?)\]/g , (match, $1) => {//		for each instance of f[]
				stmp = match.substring(2 , match.length-1);//		get the text between [ and ] and remove f[ and ] from the ends
				if(stmp.length > 1)//		string inside [] is more than 1 character. Add () around it so it computes correctly
					stmp = '(' + stmp + ')';
					
				return ('(' +pieRaw[1].replace(/a/g , stmp) + ')');//		replace f[] with the contents of f() with 'a' replaced with the text between 'f[' and ']'
			});
			equRaw = equRaw.replace(/\g\[(.*?)\]/g , (match, $1) => {//		for each instance of g[]
				stmp = match.substring(2 , match.length-1);
				if(stmp.length > 1)
					stmp = '(' + stmp + ')';
					
				return ('(' +pieRaw[2].replace(/a/g , stmp) + ')');
			});
			equRaw = equRaw.replace(/h\[(.*?)\]/g , (match, $1) => {//		for each instance of h[]
				stmp = match.substring(2 , match.length-1);
				if(stmp.length > 1)
					stmp = '(' + stmp + ')';
				return ('(' +pieRaw[3].replace(/a/g , stmp) + ')');
			});
			equRaw = equRaw.replace(/k\[(.*?)\]/g , (match, $1) => {//		for each instance of k[]
				stmp = match.substring(2 , match.length-1);
				if(stmp.length > 1)
					stmp = '(' + stmp + ')';
				return ('(' +pieRaw[4].replace(/a/g , stmp) + ')');
			});
			
			scope = {x: 2 , t: 2 , z: 0};
			//		now run the standard compile function (used in InputText) to compile to composite equation
			try{
				equInput = math.parse(equRaw , scope);
				equCompiled = equInput.compile();
				equInvalid = false;
			}catch(err){
				equInput = math.parse(equLast , scope);
				equCompiled = equInput.compile();
				equInvalid = true;
			}
			if(!equInvalid){//		if the new piece of the equation is not invalid, update the consolidated equation (input 0)
				equLast = equRaw;
			}
		}
	}
	pFunUpdateEquDisplay();
}



//	----------------------------------		[   Recolor Input Text but with only A as a variable   ]		----------------------------------
function pFunFormatTypedInput(equChars){
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
			case 'a':
				equColored += '<a style="color:#FF0000">a</a>';
				rtmp++;
				break;
			//		delete x, t, and z if they are entered. Only a is allowed in sub-functions
			case 'x':
				break;
			case 't':
				break;
			case 'z':
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
		/*if(ftmp == 0){//		current character is the caret position
			lyy = rtmp;
		}
		if(ftmp == dtmp){//	current character is the end of the selection
			ryy = rtmp;
		}*/
	}
	lyy = rtmp + ftmp;//		set caret position
	ryy = rtmp + ftmp;//		set end of selection
	return equColored;
>>>>>>> a3503f6d8084bec8645c5c94b584ec9e6b4120a9
}