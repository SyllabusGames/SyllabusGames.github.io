//	-----	[  This is free and unencumbered software released into the public domain  ]	-----

var pieEquCompiled  = ["0" , "0" , "0" , "0" , "0" , "0"];//		these are the compiled Math.js parsers. They are initialized as strings just to get length=10

var pieEquInputsUsed = 1;
var pieEquInput = [];//		input fields containing the equations
var pieLeftInput = [];//		the limit input boxes to the left in the format __ < x < __ (Input field is never used for anything else)
var pieLeftInputCompiled = [false,false,false,false,false];
var pieLeftNumeric = [true,true,true,true,true];//		left input is just a number. If false, it is an equation containing t and must be updated every frame.
var pieRightInput = [];//		the limit input boxes to the right in the format __ < x < __ (Input field is never used for anything else)
var pieRightInputCompiled = [false,false,false,false,false];
var pieRightNumeric = [true,true,true,true,true];
var pieLimitsText = [];//		elements holding the "< x <" text on screen

var pieLeftLimit = [0,0,0,0,0];
var pieRightLimit = [0,0,0,0,0];
var pieRaw = ["","","","",""];
var pieLast = ["0","1","2","3","4"];

//		-----------------------------------------------------------------------		[   Set up Equation Input Box   ]		-----------------------------------------------------------------------
function pieInitialize(){
	mainInput.focus();
	//		reset compiled limit equations or they may be used instead of the limits entered by the level setup
	pieLeftInputCompiled = [false,false,false,false,false];
	pieRightInputCompiled = [false,false,false,false,false];
	yEqualsText.innerHTML = '<text class="unselectable" style="font-size: 35px; font-family: Arial; color: black;">y=</text>';
	pieScreenResize();
}

function pieScreenResize(){
	k = screenWidth-400+80;	console.log('pieScreenResize');

	for(i = 0 ; i < pieEquInputsUsed ; i++){//		check all equation input fields and set whichever is avtive as activeInput
		//		move and resize equation input fields
		equInputField = pieEquInput[i].style;
		equInputField.left = "55px";
		equInputField.top = (screenHeight  - 85 - i * 45) + "px";
		equInputField.width = (k-65) + "px";
		//		move left limit input fields
		pieLeftInput[i].style.left = (k + 20) + "px";
		pieLeftInput[i].style.top = (screenHeight  - 85 - i * 45) + "px";
		//		move right limit input fields
		pieRightInput[i].style.left = (k + 210) + "px";
		pieRightInput[i].style.top = (screenHeight  - 85 - i * 45) + "px";
		//		move text
		pieLimitsText[i].style.left = k + "px";
		pieLimitsText[i].style.top = (screenHeight  - 85 - i * 45) + "px";
	}
	if(equInvalid || !containsVariables)
		yEqualsText.style.top = (screenHeight-95) + "px";
	else
		yEqualsText.style.top = (screenHeight-50 - (pieEquInputsUsed-1)*23) + "px";
	
	
	if(useDerivative){
		yPrimeEqualsText.style.top = (screenHeight - 95 - (pieEquInputsUsed-1) * 46) + "px";
	}
}

function pieShowHideInputs(showHide){
	for(i = pieEquInputsUsed ; i > -1 ; i--){
		pieEquInput[i].style.display = showHide;
		pieLeftInput[i].style.display = showHide;
		pieRightInput[i].style.display = showHide;
		pieLimitsText[i].style.display = showHide;
	}
}

//		-----------------------------------------------------------------------		[   Undo / Redo   ]		-----------------------------------------------------------------------
function pieUndoRedo(undo){//		true = undo, false = redo
	//		equExecutingUndo	is set to true in KeybordMouseInput.js right before calling this function
	if(undo){
		if(equCurrentUndo == 0){//		nothing available to undo
			equExecutingUndo = false;
			return;
		}
		equCurrentUndo--;
		equUndo[equCurrentUndo][0].innerHTML = equUndo[equCurrentUndo][1];//		replace input with old value
		pieCheckInput(equUndo[equCurrentUndo][0]);// is called from OnKeyUp, so this call is unnecessary except for when someone holds Ctrl+Z
	}else{
		if(equCurrentUndo > equUndo.length - 1){//		nothing available to redo
			equExecutingUndo = false;
			return;
		}
		equUndo[equCurrentUndo][0].innerHTML = equUndo[equCurrentUndo][2];//		replace input with future value
		pieCheckInput(equUndo[equCurrentUndo][0]);// is called from OnKeyUp, so this call is unnecessary except for when someone holds Ctrl+Z
		equCurrentUndo++;
	}
}

//		this is run before new values are assigned so it has access to both the old and new values for the input field
function pieUndoListAdd(inputElement , oldValue , newValue){
	//		Undo
	if(!equExecutingUndo){//		if not currently executing an undo/redo function, add current input to the undo list.
	
		//		Input has not changed
		if(oldValue == newValue){
			return;
		}
		
		if(equCurrentUndo < equUndo.length-1){//		undo has been used. Delete all undo list items after the one currently active
			equUndo.length = equCurrentUndo;
		}
		
		equUndo.push([inputElement , oldValue , newValue]);//		add old value of current equation to list for undo and new value for redo
		equCurrentUndo = equUndo.length;
	}
	equExecutingUndo = false;
}

//		-----------------------------------------------------------------------		[   Update Equations from input fields   ]		-----------------------------------------------------------------------
function pieCheckInput(selectedElement){

	var inputNum = -1;
	//		check all equation input fields and set whichever is active as activeInput.
	//		if a left or right limit field was selected, update the field in the for loop and return
	for(i = 0 ; i < pieEquInputsUsed ; i++){
		if(pieEquInput[i] == selectedElement){
			inputNum = i;
			break;
		}
		
		//		if a limit input field was changed, update the limit if a valid number was entered, then return.
		if(pieLeftInput[i] == selectedElement){
			stmp = pieLeftInput[i].innerText;
			pieUndoListAdd(selectedElement , pieLeftLimit[i] , stmp);
			if(!isNaN(stmp)){//		just a number
				pieLeftLimit[i] = parseFloat(stmp);
				pieLeftInputCompiled[i] = false;
			}else if(stmp.indexOf("t") != -1){//		equation contains t. Mark as not numeric and compile for the graph function to animate the limit through time
				try{//		parse the input text to check if it is a valid equation, if not, reenter the last valid equation
					equInput = math.parse(stmp , {t: 0});
					equCompiled = equInput.compile();
					equInvalid = false;
				}catch(err){
					equInvalid = true;	
				}
				if(!equInvalid){
					pieLeftInputCompiled[i] = equCompiled;
					pieLeftLimit[i] = stmp;//		this is done only so the undo function can pull this value. pieLeftInputCompiled is used in calculations.
				}
			}else{//		input is an equation not containing time or invalid data
				//		if input can be computed (12+7) convert it to its solution (19)
				try{//		parse the input text to check if it is a valid equation, if not, reenter the last valid equation
					stmp = math.eval(stmp);
					equInvalid = false;
				}catch(err){
					equInvalid = true;	
				}
				if(!equInvalid){
					pieLeftInput[i].innerText = stmp;
					pieLeftLimit[i] = parseFloat(stmp);
					pieLeftInputCompiled[i] = false;
				}
			}
			return;
		}
		
		
		//		duplicate of left limit input but using right inputs
		if(pieRightInput[i] == selectedElement){
			stmp = pieRightInput[i].innerText;
			pieUndoListAdd(selectedElement , pieRightLimit[i] , stmp);
			if(!isNaN(stmp)){
				pieRightLimit[i] = parseFloat(stmp);
				pieRightInputCompiled[i] = false;
			}else if(stmp.indexOf("t") != -1){
				try{
					equInput = math.parse(stmp , {t: 0});
					equCompiled = equInput.compile();
					equInvalid = false;
				}catch(err){
					equInvalid = true;	
				}
				if(!equInvalid){
					pieRightInputCompiled[i] = equInput.compile();
					pieRightLimit[i] = stmp;
				}
			}else{
				try{
					stmp = math.eval(stmp);
					equInvalid = false;
				}catch(err){
					equInvalid = true;	
				}
				if(!equInvalid){
					pieRightInput[i].innerText = stmp;
					pieRightLimit[i] = parseFloat(stmp);
					pieRightInputCompiled[i] = false;
				}
			}
			return;
		}
	}

	if (inputNum == -1)//		a non-input field element was active when this function was called
		return;
	
	activeInput = pieEquInput[inputNum];
	equInputField = activeInput.style;
	activeInput.setAttribute("z-index" , ++inputZ);

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
			equCompiled = equInput.compile();
			pieEquCompiled[inputNum] = equCompiled;
			equInvalid = false;
		}catch(err){
			console.log()
			equInput = math.parse(pieLast[inputNum] , scope);
			equCompiled = equInput.compile();
			pieEquCompiled[inputNum] = equCompiled;
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
	equRaw = pieRaw[inputNum];//		set equRaw so if the level is using derivatives or integrals, it will display correctly
}
