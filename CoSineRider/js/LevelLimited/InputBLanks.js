
var blankEquGaps = [];//		stored as [,*x+ , +t/,+2]. If it starts with a dragable value, the first value is blank.
var blankDefaultVar = [];

var blankEquInput = [];//		Small input fields. These are used whenever multiple input fields are needed and their width or y position needs to be changed.
var blankEquText = [];//		Text between input fields.

var blankTmp;

function blankInitialize(){
	mainInput.style.display = "none";
	equLast = equRaw;
	//mainInput.innerHTML = defaultEqu;//		set the input field to have the default equation. Then update it and set it active (focus).
	// scope = {x: 0 , t: 0};
	// equInput = math.parse("5" , scope);
	// equCompiled = equInput.compile();
	//		reset undo list
	equUndo = [];
	equCurrentUndo = 0;
	
	yEqualsText.innerHTML = '<text class="unselectable" style="font-size: 35px; font-family: Arial; color: black;">y=</text>';
	yEqualsText.style.display = "block";
	
	//		Space out input blanks to fit between the fixed text of the input
	ctx.font="35px Arial";
	tmpx = 45;//72;//		start at 55px right of left edge
	for(i = 0 ; i < blankEquInput.length ; i++){
		if(i < blankDefaultVar.length){//		blank is used, show it and place at the correct location
			blankEquInput[i].style.display = "block";
			tmpx += ctx.measureText(blankEquGaps[i]).width;//		get length of text that is immediately left of the current blank and add that to the blank's position
			blankEquInput[i].style.left = (tmpx + 10) + "px";//		place next blank 5 pixels right of the right edge of the last input field
			tmpx += parseInt(blankEquInput[i].style.width) + 10;//		add width of textbox plus a 5 pixel gap on each side of the previous text
			blankEquInput[i].innerHTML = blankDefaultVar[i];//		read in default values for input fields
		}else{//	blank is not used, hide it
			blankEquInput[i].style.display = "none";
		}
	}
	
	//		Space out fixed equation text based on the input positions so all text is evenly spaced
	blankEquText[0].style.left = 70;
	blankEquText[0].innerHTML = '<pre class="unselectable" style="font-size: 35px; font-family: Arial;">' + blankEquGaps[0] + '</pre>';
	for(i = 1 ; i < blankEquText.length ; i++){
		if(i < blankEquGaps.length-1){
			blankEquText[i].style.left = (parseInt(blankEquInput[i-1].style.left) + parseInt(blankEquInput[i-1].style.width) + 10) + "px";//		place text 5px right of last input field's right edge
			blankEquText[i].innerHTML = '<pre class="unselectable" style="font-size: 35px; font-family: Arial;">' + blankEquGaps[i] + '</pre>';
			blankEquText[i].style.display = "block";
		}else{
			blankEquText[i].style.display = "none";
		}
	}
	
	//		set first blank to be the active input
	blankEquInput[0].focus();
	activeInput = blankEquInput[0];

	equInput = math.parse(pieRaw[0] , {x: 0 , t: 0});
	equCompiled = equInput.compile();
	
	blankUpdateEqu();
	blankScreenResize();
}

function blankUpdateEqu(){//		concatenate string fragments of equation and variables to form full equation. Also form colored version for the Input text box.
	equRaw = "";
	//		concatenate the variables stored in the blanks with the unchangeable equation text to read the full equation into equRaw
	for(i = 0 ; i < blankEquGaps.length-1 ; i++){
		equRaw += blankEquGaps[i];
		stmp = blankEquInput[i].innerText
		ftmp = parseFloat(stmp);
		
		if(stmp == '' || stmp == '-' || stmp == '.'){//		input field is blank or contains only - or .   Record as 0 and do not change input contentse.
			equRaw += 0;
			continue;
		}
		
		
		if(blankEquInput[i].innerText != ftmp){//		input is not just a number
			if(isNaN(ftmp)){//		if the player types junk with no numbers in it, clear the input field
				blankEquInput[i].innerHTML = '';
				equRaw += 0;
				continue;
			}else{
				blankEquInput[i].innerHTML = ftmp;//		remove all but numbers from the input
			}
		}
		
		//		add input field's contents to the equation
		equRaw += blankEquInput[i].innerText;
	}
	equRaw += blankEquGaps[blankEquGaps.length-1];
}

function blankScreenResize(){
	stmp = Math.round(screenHeight  - 85) + "px";
	for(i = 0 ; i < blankDefaultVar.length ; i++){
		blankEquInput[i].style.top = stmp;
	}
	
	for(i = 1 ; i < blankEquGaps.length-1 ; i++){
		blankEquText[i].style.top = stmp;
	}
	if(equInvalid || !containsVariables)
		yEqualsText.style.top = (screenHeight-95) + "px";
	else
		yEqualsText.style.top = (screenHeight-50) + "px";
	
	if(useDerivative){
		yPrimeEqualsText.style.top = (parseInt(yEqualsText.style.top) - 50) + "px";
	}
}


function blankShowHideInputs(showHide){
	for(i = 0 ; i < blankDefaultVar.length ; i++){
		blankEquInput[i].style.display = showHide;
	}
	for(i = 1 ; i < blankEquGaps.length-1 ; i++){
		blankEquText[i].style.display = showHide;
	}
}
/*
function blankUndoRedo(undo){//		true = undo, false = redo
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
}*/

//		called every time the input field changes
function blankCheckInput(){
	blankUpdateEqu();
	
	//		Not using undo and equation has not changed (undo list is not empty and current input is the same as latest entry). Return.
	/*if(!equExecutingUndo && equUndo.length != 0 && equRaw == equUndo[equCurrentUndo]){
	//	console.log("Input has not changed");
		//		Input has not changed
		return;
	}*/
	
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

	if(!simulating){//		Only update the equation if the simulation is not running
		equInput = math.parse(equRaw , scope);
		equCompiled = equInput.compile();
		equInvalid = false;
	}
}