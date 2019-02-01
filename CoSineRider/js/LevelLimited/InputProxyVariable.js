//	-----	[  This is free and unencumbered software released into the public domain  ]	-----

//		-----------------------------------------------------------------------		[   Set up Equation Input Box   ]		-----------------------------------------------------------------------
function pVarInitialize(){
	equUndo = [];
	equCurrentUndo = 0;
	pVarScreenResize();//		move input field to the correct place on the screen
	//		if they add a D to input 0 and there is no D input field, this ↓ makes sure they won't pull in input D from the last level
	pieRaw[2] = "";
	pieRaw[4] = "";
	pieRaw[5] = "";
}

function pVarScreenResize(){
	k = screenWidth-80;	console.log('PVarScreenResize');

	for(i = 0 ; i < pieEquInputsUsed + 1 ; i++){//		check all equation input fields and set whichever is avtive as activeInput
		//		move and resize equation input fields
		equInputField = pieEquInput[i].style;
		equInputField.left = "55px";
		equInputField.top = (screenHeight  - 85 - i * 45) + "px";
		equInputField.width = (screenWidth - 120) + "px";
	}
	pVarUpdateEquDisplay();
//	pieEquInput[0].style.top = "100px"
	
	
	if(useDerivative){
		yPrimeEqualsText.style.top = (parseInt(yEqualsText.style.top) - 0) + "px";
	}
}

function pVarUpdateEquDisplay(){
	//if(equInvalid || !containsVariables){
	//	yEqualsText.style.top = (screenHeight-95) + "px";
	//}else{
		yEqualsText.style.top = (screenHeight-137 - 45 * pieEquInputsUsed) + "px";
		//		class"unselectable" declared in CoSineRider.html"
		switch(pieEquInputsUsed){
			case 4:
				yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+'<br>D=<br>C=<br>B=<br>A=<br>y=</p>';
				break;
			case 3:
				yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+'<br>C=<br>B=<br>A=<br>y=</p>';
				break;
			case 2:
				yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+'<br>B=<br>A=<br>y=</p>';
				break;
			default://	1
				yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;">y='+formatTypedInput(equRaw)+'<br>A=<br>y=</p>';

		}
	// }
}

function pVarShowHideInputs(showHide){
	for(i = pieEquInput.length-1 ; i > -1 ; i--){
		pieEquInput[i].style.display = showHide;
	}
}

function pVarCheckInput(selectedElement){


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
	activeInput.innerHTML = formatTypedInput(activeInput.innerText);
	restoreSelection();
	
	pieUndoListAdd(selectedElement , pieRaw[inputNum] , activeInput.innerText);
	
	//	----------------------------------		[   Recolor Input Text   ]		----------------------------------
	if(!simulating){//		Only update the equation if the simulation is not running
		equInputField = activeInput.style;
		try{//		parse the input text to check if it is a valid equation to update the input border color to denote a valid/invalid equation
			equInput = math.parse(absBarToFunction(activeInput.innerText) , scope);
			pieEquCompiled[inputNum] = equInput.compile();
			equInvalid = false;
		}catch(err){
			equInvalid = true;
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
			pieRaw[inputNum] = activeInput.innerText;
			equRaw = mainInput.innerText;
			//		substitute a,b,c, and d with the inputs for those fields. It doesn't mater if they don't use D because there just won't be and D in the equation.
			equRaw = equRaw.replace("A" , "(" + absBarToFunction(pieRaw[1]) + ")");
			equRaw = equRaw.replace("B" , "(" + absBarToFunction(pieRaw[2]) + ")");
			equRaw = equRaw.replace("C" , "(" + absBarToFunction(pieRaw[3]) + ")");
			equRaw = equRaw.replace("D" , "(" + absBarToFunction(pieRaw[4]) + ")");
			
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
			if(!equInvalid){//		if the new piece of the equation is not invalid, update the consolidate equation (input 0)
				equLast = equRaw;
			}
		}
	}
	pVarUpdateEquDisplay();
}


