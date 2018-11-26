
var equRaw = "0";
var equLast = "0";


function typeInitialize(){
	equInputField = mainInput.style;//		used to set the border color when the equation contains errors
	equRaw = defaultEqu;
	equLast = defaultEqu;
	//mainInput.innerHTML = defaultEqu;//		set the input field to have the default equation. Then update it and set it active (focus).
	mainInput.focus();
	scope = {x: 0 , t: 0};
	eqinput = math.parse(equRaw , scope);
	equ = eqinput.compile();
}

function typeScreenResize(){
	equInputField = mainInput.style;
	equInputField.left = Math.round(screenWidth * 0.0375) + "px";
	equInputField.top = Math.round(screenHeight  - 85) + "px";
	equInputField.width = Math.round(screenWidth * 0.925) + "px";
}

function typeCheckInput(){
	mainInput = pieEquInput[0];
	equInputField = mainInput.style;
	mainInput.setAttribute("z-index" , ++inputZ);

	equRaw = mainInput.innerText.toLowerCase().replace("**" , "^");

	if(useRender)//		clear this canvas so if it isn't used, it won't still be shown
		renderCanvas.clearRect(0, 0, xyzWidth, xyzHeight);
	useRender = (equRaw.indexOf('=')+equRaw.indexOf('<')+equRaw.indexOf('>') > -3);//		start full screen renderer if the equation contains = < or >
	if(useRender){//		start the first render pass to load in the new equation
		document.getElementById('render').width = screenWidth;
		document.getElementById('render').height = screenHeight;
		render2d();
	}

	ftmp = getCaretLocation(mainInput);//		ftmp is current caret position
	dtmp = -window.getSelection().toString().length;//		dtmp is current selection end position
	rtmp = 0;//		rtmp is the number of characters over the caret is in the current node (current font style/color)
	ryy = 0;//		right end of selection. lyy is left end of selection.
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