
function typeInitialize(){
	equInputField = mainInput.style;//		used to set the border color when the equation contains errors
	equLast = equRaw;
	//mainInput.innerHTML = defaultEqu;//		set the input field to have the default equation. Then update it and set it active (focus).
	mainInput.focus();
	scope = {x: 0 , t: 0};
	equInput = math.parse(equRaw , scope);
	equCompiled = equInput.compile();
	yEqualsText.style.display = "block";
	//		reset undo list
	equUndo = [];
	equCurrentUndo = 0;
	typeScreenResize();//		move input field to the correct place on the screen
}

function typeScreenResize(){
	equInputField = mainInput.style;
	console.log('typeScreenResize');
	equInputField.left = "55px";
	equInputField.top = Math.round(screenHeight  - 85) + "px";
	equInputField.width = Math.round(screenWidth - 120) + "px";
	if(equInvalid || !containsVariables)
		yEqualsText.style.top = (screenHeight-95) + "px";
	else
		yEqualsText.style.top = (screenHeight-50) + "px";
	
	if(useDerivative){
		yPrimeEqualsText.style.top = (parseInt(yEqualsText.style.top) - 50) + "px";
	}
}


function typeShowHideInputs(showHide){
	mainInput.style.display = showHide;
}

function equUndoRedo(undo){//		true = undo, false = redo
	if(undo){
		if(equCurrentUndo == 0){//		nothing available to undo
			equExecutingUndo = false;
			return;
		}
		if(equCurrentUndo == equUndo.length){//		this is currently the last entry in the undo list, so add the input field's current contents to the list's end
			if(mainInput.innerText != equUndo[equUndo.length-1]){//		current input not on undo list
				equUndo.push(mainInput.innerText);
			}
		}
		if(equUndo[equCurrentUndo-1] == equUndo[equCurrentUndo-2]){//		the previous if statement can cause duplicate entries if undo then full redo are executed
			equUndo.splice(equCurrentUndo-1 , 1);//		remove the duplicated element
			equCurrentUndo--;//		shift to compensate for the list being 1 element shorter
		}
		equCurrentUndo--;
	}else{
		if(equCurrentUndo > equUndo.length-2){//		nothing available to redo
			equExecutingUndo = false;
			return;
		}
		equCurrentUndo++;
	}
	mainInput.innerHTML = equUndo[equCurrentUndo];
	typeCheckInput();// is called from OnKeyUp, so this call is unnessisary except for when someone holds Ctrl+Z
}


//		called every time the input field changes
function typeCheckInput(){
	
	//		Update Undo/Redo list
	if(!equExecutingUndo){//		if not currently executing an undo/redo function, add current input to the undo list.
	
		//		Not using undo and equation has not changed (undo list is not empty and current input is the same as latest entry). Return.
		if(equUndo.length != 0 && equRaw == mainInput.innerText){
			//		Input has not changed
			return;
		}
	
		if(equCurrentUndo < equUndo.length-1){//		undo has been used. Delete all undo list items after the one currently active
			equUndo.length = equCurrentUndo;
		}
		equUndo.push(equRaw);//		add current equation to undo list
		equCurrentUndo = equUndo.length;
	}
	equExecutingUndo = false;
	
	
	equInputField = mainInput.style;

	//		only run on typed inputs
	
	equRaw = mainInput.innerText.toLowerCase().replace("π" , "pi");//		this is done for the parser and is undone by formatTypedInput() for display to the player

	//		Test Equation		1+3-4*2^1%3+abs(4)+log(10)-sqrt(4)+ceil(3)+floor(1)+round(5)+tan(1)+sin(6)+cos(4)+acos(0.2)+asin(1)+atan(5)+atan2(1,2)+max(3,1)+min(5,2,-3)+pi+e+(2)+3.1+x+z+t
	//		check if any characters in the string are not listed
/*	if (/^[0-9|\+|\-|\*|\^|/|%|abs|log|sqrt|ceil|floor|round|tan|sin|cos|acos|asin|atan|atan2|max|min|pi|π|e|\(|\)|,|\.|x|z|t|y|<|>|=]+$/.test(equRaw)){
	   console.log("no invalid characters" + "  -  " + equRaw);
	}else{
	   console.log("INVALID CHARS!" + "  -  " + equRaw);
	}*/
	
	//		only run on typed inputs

	

	// mainInput.setAttribute("z-index" , ++inputZ);

	
	

	if(useRender)//		clear this canvas so if it isn't used, it won't still be shown
		renderCanvas.clearRect(0, 0, xyzWidth, xyzHeight);
		
	useRender = (equRaw.indexOf('=')+equRaw.indexOf('<')+equRaw.indexOf('>') > -3);//		start full screen renderer if the equation contains = < or >
	if(useRender){//		start the first render pass to load in the new equation
		document.getElementById('render').width = screenWidth;
		document.getElementById('render').height = screenHeight;
		render2d();
	}

	ftmp = getCaretLocation(mainInput);//		ftmp is current caret position
	mainInput.innerHTML = formatTypedInput(equRaw);
	restoreSelection();
	
	//		the following change is made for the parser, not for the player to see
	if((equRaw.match(/\|/g) || []).length > 0){//		equation contains |-x| (absolute value bars)
		i = 0;
		equRaw = equRaw.replace(/\|/g, (match, $1) => {
			if(i++ % 2 == 0)
				return "abs(";
			else
				return ")";
		});
	}

	//	----------------------------------		[   /Recolor Input Text   ]		----------------------------------
	if(!simulating){//		Only update the equation if the simulation is not running
		try{//		parse the input text to check if it is a valid equation, if not, reenter the last valid equation
			equInput = math.parse(equRaw , scope);
			equCompiled = equInput.compile();
			
			if(equation(0).toString()[0] == "f")//		if it is returning javascript (function ...(...){...})	 instead of an actual answer, consider it invalid
				equInvalid = true;
			else
				equInvalid = false;
		}catch(err){
			equInput = math.parse(equLast , scope);
			equCompiled = equInput.compile();
			equInvalid = true;
			equInputField.borderColor = _inputBorderBadColor;
			equInputField.borderWidth = "3px";			
		}
		if(!equInvalid){
			equLast = equRaw;
			equInputField.borderColor = _inputBorderGoodColor;
			equInputField.borderWidth = "1px";
		}
	}
	
	if(!containsVariables){//		if equation does not contain x, z, or t, (output is constant) show the answer above the input line.
		yEqualsText.innerHTML = '<text alignment-baseline="baseline" style="font-size: 35px; font-family: Arial; color: blue;">y=' + equation(0).toString() + '</text>';
		yEqualsText.style.top = (screenHeight-95) + "px";
	}else if(equInvalid){
		yEqualsText.innerHTML = '<text alignment-baseline="baseline" style="font-size: 35px; font-family: Arial; color: grey;">y=' + equLast + '</text>';
		yEqualsText.style.top = (screenHeight-95) + "px";
	}else{
		yEqualsText.innerHTML = '<text class="unselectable" style="font-size: 35px; font-family: Arial; color: black;">y=</text>';//		class"unselectable" declared in CoSineRider.html"
		yEqualsText.style.top = (screenHeight-50) + "px";
	}
}