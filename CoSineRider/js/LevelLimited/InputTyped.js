
var equRaw = "0";
var equLast = "0";
var equUndo = [];
var equExecutingUndo = false;
var equCurrentUndo = 0;

function typeInitialize(){
	equInputField = mainInput.style;//		used to set the border color when the equation contains errors
	equRaw = defaultEqu;
	equLast = defaultEqu;
	//mainInput.innerHTML = defaultEqu;//		set the input field to have the default equation. Then update it and set it active (focus).
	mainInput.focus();
	scope = {x: 0 , t: 0};
	eqinput = math.parse(equRaw , scope);
	equ = eqinput.compile();
	//		reset undo list
	equUndo = [];
	equCurrentUndo = 0;
	typeScreenResize();//		move input field to the correct place on the screen
}

function typeScreenResize(){
	equInputField = mainInput.style;
	equInputField.left = Math.round(screenWidth * 0.0375) + "px";
	equInputField.top = Math.round(screenHeight  - 85) + "px";
	equInputField.width = Math.round(screenWidth * 0.925) + "px";
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
	//mainInput = pieEquInput[0];
	equInputField = mainInput.style;

	equRaw = mainInput.innerText.toLowerCase().replace("**" , "^");
	equRaw = equRaw.replace(/π/g , "pi");
	
	//		Not using undo and equation has not changed (undo list is not empty and current input is the same as latest entry). Return.
	if(!equExecutingUndo && equUndo.length != 0 && equRaw == equUndo[equCurrentUndo]){
	//	console.log("Input has not changed");
		//		Input has not changed
		return;
	}
	mainInput.setAttribute("z-index" , ++inputZ);

	
	//		Undo
	if(!equExecutingUndo){//		if not currently executing an undo/redo function, add current input to the undo list.
		if(equCurrentUndo < equUndo.length-1){//		undo has been used. Delete all undo list items after the one currently active
			equUndo.length = equCurrentUndo;
		}
		equUndo.push(equRaw);//		add current equation to undo list
		equCurrentUndo = equUndo.length-1;
	}
	equExecutingUndo = false;
	

	if(useRender)//		clear this canvas so if it isn't used, it won't still be shown
		renderCanvas.clearRect(0, 0, xyzWidth, xyzHeight);
		
	useRender = (equRaw.indexOf('=')+equRaw.indexOf('<')+equRaw.indexOf('>') > -3);//		start full screen renderer if the equation contains = < or >
	if(useRender){//		start the first render pass to load in the new equation
		document.getElementById('render').width = screenWidth;
		document.getElementById('render').height = screenHeight;
		render2d();
	}

	ftmp = getCaretLocation(mainInput);//		ftmp is current caret position
	console.log("called from InputTyped");
	mainInput.innerHTML = formatTypedInput(equRaw.split(""));
	restoreSelection();

	//	----------------------------------		[   /Recolor Input Text   ]		----------------------------------
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
}