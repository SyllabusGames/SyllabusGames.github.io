//	-----	[  This is free and unencumbered software released into the public domain  ]	-----


//		-----------------------------------------------------------------------		[   Set up Equation Input Box   ]		-----------------------------------------------------------------------
function multiInitialize(){
	mainInput.focus();
	//		reset compiled limit equations or they may be used instead of the limits entered by the level setup
	pieLeftInputCompiled = [false,false,false,false,false];
	pieRightInputCompiled = [false,false,false,false,false];
	yEqualsText.innerHTML = '<text class="unselectable" style="font-size: 35px; font-family: Arial; color: black;">y=</text>';
	yEqualsText.style.display = "block";
	multiScreenResize();
	
	//		set up y= text in the correct colors
	console.log(pieEquInputsUsed);
	switch(pieEquInputsUsed){
		case 5:
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;"><a style="color:'+_colors[4]+
			'">y=</a><br><a style="color:'+_colors[3]+'">y=</a><br><a style="color:'+_colors[2]+
			'">y=</a><br><a style="color:'+_colors[1]+'">y=</a><br><a style="color:'+_colors[0]+'">y=</a></p>';
			break;
		case 4:
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;"><a style="color:'+_colors[3]+
			'">y=</a><br><a style="color:'+_colors[2]+
			'">y=</a><br><a style="color:'+_colors[1]+'">y=</a><br><a style="color:'+_colors[0]+'">y=</a></p>';
			break;
		case 3:
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;"><a style="color:'+_colors[2]+
			'">y=</a><br><a style="color:'+_colors[1]+'">y=</a><br><a style="color:'+_colors[0]+'">y=</a></p>';
			break;
		default://	2
			yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;"><a style="color:'+_colors[1]+
			'">y=</a><br><a style="color:'+_colors[0]+'">y=</a></p>';

	}
	
}

function multiScreenResize(){
	stmp = (screenWidth-120) + "px";
	console.log('multiScreenResize');

	for(i = 0 ; i < pieEquInputsUsed ; i++){//		check all equation input fields and set whichever is avtive as activeInput
		//		move and resize equation input fields
		equInputField = pieEquInput[i].style;
		equInputField.left = "55px";
		equInputField.top = (screenHeight  - 85 - i * 45) + "px";
		equInputField.width = stmp;
		//		move text
	}
	
	yEqualsText.style.top = (screenHeight - 90 - (pieEquInputsUsed-1) * 45) + "px";
	
	
	if(useDerivative){
		yPrimeEqualsText.style.top = (screenHeight - 95 - (pieEquInputsUsed-1) * 46) + "px";
	}
}

function multiShowHideInputs(showHide){
	for(i = pieEquInputsUsed-1 ; i > -1 ; i--){
		pieEquInput[i].style.display = showHide;
	}
}

//		-----------------------------------------------------------------------		[   Update Equations from input fields   ]		-----------------------------------------------------------------------
function multiCheckInput(selectedElement){
	var inputNum = -1;
	//		check all equation input fields and set whichever is active as activeInput.
	//		if a left or right limit field was selected, update the field in the for loop and return
	for(i = 0 ; i < pieEquInputsUsed ; i++){
		if(pieEquInput[i] == selectedElement){
			inputNum = i;
			break;
		}
	}

	if (inputNum == -1)//		a non-input field element was active when this function was called
		return;
	
	activeInput = pieEquInput[inputNum];
	equInputField = activeInput.style;

	pieUndoListAdd(selectedElement , pieRaw[inputNum] , activeInput.innerText);

	pieRaw[inputNum] = activeInput.innerText.toLowerCase().replace("π" , "pi");
	
	
	if(useRender)//		clear this canvas so if it isn't used, it won't still be shown
		renderCanvas.clearRect(0, 0, xyzWidth, xyzHeight);
	useRender = (pieRaw[inputNum].indexOf('=')+pieRaw[inputNum].indexOf('<')+pieRaw[inputNum].indexOf('>') > -3);//		start full screen renderer if the equation contains = < or >
	if(useRender){//		start the first render pass to load in the new equation
		document.getElementById('render').width = screenWidth;
		document.getElementById('render').height = screenHeight;
		render2d();
	}
	
	
	ftmp = getCaretLocation(activeInput);//		ftmp is current caret position
	activeInput.innerHTML = formatTypedInput(pieRaw[inputNum]);
	restoreSelection();
	
	
	//		the following change is made for the parser, not for the player to see
	pieRaw[inputNum] = absBarToFunction(pieRaw[inputNum]);
	//	----------------------------------		[   /Recolor Input Text   ]		----------------------------------
	if(!simulating){//		Only update the equation if the simulation is not running
		try{//		parse the input text to check if it is a valid equation, if not, reenter the last valid equation
			equInput = math.parse(pieRaw[inputNum] , scope);
			pieEquCompiled[inputNum] = equInput.compile();
			equInvalid = false;
		}catch(err){
			equInput = math.parse(pieLast[inputNum] , scope);
			pieEquCompiled[inputNum] = equInput.compile();
			equInvalid = true;
			equInputField.borderColor = _inputBorderBadColor;
			equInputField.borderWidth = "3px";			
		}
		if(!equInvalid){
		//	console.log("Equation #" + inputNum + " is valid");
			pieLast[inputNum] = pieRaw[inputNum];
			equInputField.borderColor = _inputBorderGoodColor
			equInputField.borderWidth = "1px";
		}
	}
	if(hideMultiMax)
		return;
	
	//		now build the actual equation which will be max(all pie equations)
	stmp = "max("
	for(i = pieEquInputsUsed-1 ; i > -1 ; i--){
		stmp += absBarToFunction(pieRaw[i]);
		if(i != 0)
			stmp += ',';
	}
	
	equRaw = stmp + ')';

	if(!simulating){//		Only update the equation if the simulation is not running
		try{//		parse the input text to check if it is a valid equation, if not, reenter the last valid equation
			equInput = math.parse(equRaw , scope);
			equCompiled = equInput.compile();
		}catch(err){
			equInput = math.parse(equLast , scope);
			equCompiled = equInput.compile();
			equInvalid = true;
		}
		if(!equInvalid){
			equLast = equRaw;
		}
	}
}
