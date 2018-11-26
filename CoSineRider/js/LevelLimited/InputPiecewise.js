//	-----	[  This is free and unencumbered software released into the public domain  ]	-----

var pieEquCompiled  = ["0" , "0" , "0" , "0" , "0" , "0"];//		these are the compiled Math.js parsers. They are initialized as strings just to get length=10

var pieEquInputsUsed = 1;
var pieLeftInput = [];//		the limit input boxes to the left in the format __ < x < __
var pieRightInput = [];
var piecLimitsText = [];//		elements holding the "< x <" text on screen

var pieLeftLimit = [0,0,0,0,0];
var pieRightLimit = [0,0,0,0,0];
var pieRaw = ["","","","",""];
var pieLast = ["","","","",""];

//		-----------------------------------------------------------------------		[   Set up Equation Input Box   ]		-----------------------------------------------------------------------
function pieInitialize(){
	k =  screenWidth-400;
	mainInput.style.width = k + "px";
	k += 80;
	i = parseInt(mainInput.style.top);

	//		create elements holding the "< x <" text on screen allong with the , between the input and piecewise range limits. Class is set to "unselectable". See "CoSineRider.html"
	pieTmp = document.createElement("g");
	pieTmp.innerHTML = '<pre class="unselectable" style="font-size: 35px; font-family: Arial;">,            < x < </pre>';
	pieTmp.style.position = "absolute";
	pieTmp.style.left = k + "px";
	pieTmp.style.top = i + "px";
	document.body.appendChild(pieTmp);
	piecLimitsText.push(pieTmp);

	pieTmp = pieTmp.cloneNode(true);		pieTmp.style.top = i-45 + "px";		document.body.appendChild(pieTmp);		piecLimitsText.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);		pieTmp.style.top = i-90 + "px";		document.body.appendChild(pieTmp);		piecLimitsText.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);		pieTmp.style.top = i-135 + "px";		document.body.appendChild(pieTmp);		piecLimitsText.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);		pieTmp.style.top = i-180 + "px";		document.body.appendChild(pieTmp);		piecLimitsText.push(pieTmp);

	//		create 4 more equation input fields for piecewise levels
	var pieTmp = mainInput.cloneNode(true);
	pieTmp.innerHTML = "2";
	pieTmp.style.top = i-45+"px";
	pieEquInput.push(pieTmp);
	document.body.appendChild(pieTmp);

	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-90+"px";	document.body.appendChild(pieTmp);	pieEquInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-135+"px";	document.body.appendChild(pieTmp);	pieEquInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-180+"px";	document.body.appendChild(pieTmp);	pieEquInput.push(pieTmp);
	
	//		create the 5 right limit input fields
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i+"px";	pieTmp.style.width = "100px";	pieTmp.style.left = k+210+"px";	document.body.appendChild(pieTmp);	pieRightInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-45+"px";	document.body.appendChild(pieTmp);	pieRightInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-90+"px";	document.body.appendChild(pieTmp);	pieRightInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-135+"px";	document.body.appendChild(pieTmp);	pieRightInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-180+"px";	document.body.appendChild(pieTmp);	pieRightInput.push(pieTmp);

	//		create the 5 left limit input fields
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i+"px";	pieTmp.style.left = k+20+"px";	document.body.appendChild(pieTmp);	pieLeftInput.push(pieTmp);
	pieTmp.style.textAlign = "right";//		left inputs have right justified text
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-45+"px";	document.body.appendChild(pieTmp);	pieLeftInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-90+"px";	document.body.appendChild(pieTmp);	pieLeftInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-135+"px";	document.body.appendChild(pieTmp);	pieLeftInput.push(pieTmp);
	pieTmp = pieTmp.cloneNode(true);	pieTmp.style.top = i-180+"px";	document.body.appendChild(pieTmp);	pieLeftInput.push(pieTmp);

	equInputField = mainInput.style;//		used to set the border color when the equation contains errors
	pieRaw[0] = defaultEqu;
	pieLast[0] = defaultEqu;
	//mainInput.innerHTML = defaultEqu;//		set the input field to have the default equation. Then update it and set it active (focus).
	mainInput.focus();
	scope = {x: 0 , t: 0};
	eqinput = math.parse(pieRaw[0] , scope);
	equ = eqinput.compile();
	
//	checkInputFields("all");

	/*if(pieEquInput.length < pieEquInputsUsed){//		more equations used than inputs for equations
		lyy =  Math.round(screenWidth * 0.05);//		left property
		ftmp = Math.round(screenHeight * 0.85);//		top
		ryy = Math.round(screenWidth * 0.9);//			width
		for(i = pieEquInput.length ; i < pieEquInputsUsed ; i++){
			pieEquInput.push(document.createElement("p"));
			pieEquInput[i].setAttribute("id" , "input" + String(i));
//			console.log("input" + String(i));
			pieEquInput[i].setAttribute("contentEditable" , "true");
			pieEquInput[i].style = "position:absolute;left:"+lyy+"px;top:"+Math.round(ftmp-70*i)+"px;width:"+(ryy-15*i)+"px;font-size:50px; font-family:'Arial'; background-color: #FFFFFF; border:1px solid #AAAAAA;";
			pieEquInput[i].innerHTML = "-x+00000+5"
			document.body.appendChild(pieEquInput[i]);
//			console.log("added input");
		}
	}*/
}



//						Possibly append all inputs to a group so you can move that vertically and only resize things on the horizontal



function pieScreenResize(){
	k = screenWidth-400+80;
	for(i = 0 ; i < 5 ; i++){//		check all equation input fields and set whichever is avtive as activeInput
		//		move and resize equation input fields
		equInputField = pieEquInput[i].style;
		equInputField.left = Math.round(screenWidth * 0.0375) + "px";
		equInputField.top = (screenHeight  - 85 - i * 45) + "px";
		equInputField.width = (k-80) + "px";
		//		move left limit input fields
		pieLeftInput[i].style.left = (k + 20) + "px";
		pieLeftInput[i].style.top = (screenHeight  - 85 - i * 45) + "px";
		//		move right limit input fields
		pieRightInput[i].style.left = (k + 210) + "px";
		pieRightInput[i].style.top = (screenHeight  - 85 - i * 45) + "px";
		//		move text
		console.log(piecLimitsText[i]);
		piecLimitsText[i].style.left = k + "px";
		piecLimitsText[i].style.top = (screenHeight  - 85 - i * 45) + "px";
	}
}

function pieCheckInput(selectedElement){

	var inputNum = -1;
	for(i = 0 ; i < pieEquInputsUsed ; i++){//		check all equation input fields and set whichever is avtive as activeInput
		if(pieEquInput[i] == selectedElement){
			inputNum = i;
			break;
		}
		//		if a limit input field was changed, update the limit if a valid number was entered, then return.
		if(pieLeftInput[i] == selectedElement){
			stmp = pieLeftInput[i].innerText;
			if(!isNaN(stmp))
				pieLeftLimit[i] = parseFloat(stmp);
			return;
		}
		if(pieRightInput[i] == selectedElement){
			stmp = pieRightInput[i].innerText;
			if(!isNaN(stmp))
				pieRightLimit[i] = parseFloat(stmp);
			return;
		}
	}

	if (inputNum == -1)//		a non-input field element was active when this function was called
		return;
	
	activeInput = pieEquInput[inputNum];
	equInputField = activeInput.style;
	activeInput.setAttribute("z-index" , ++inputZ);

	pieRaw[inputNum] = activeInput.innerText.toLowerCase().replace("**" , "^");
	
	if(useRender)//		clear this canvas so if it isn't used, it won't still be shown
		renderCanvas.clearRect(0, 0, xyzWidth, xyzHeight);
	useRender = (pieRaw[inputNum].indexOf('=')+pieRaw[inputNum].indexOf('<')+pieRaw[inputNum].indexOf('>') > -3);//		start full screen renderer if the equation contains = < or >
	if(useRender){//		start the first render pass to load in the new equation
		document.getElementById('render').width = screenWidth;
		document.getElementById('render').height = screenHeight;
		render2d();
	}
	
	ftmp = getCaretLocation(activeInput);//		ftmp is current caret position
	dtmp = -window.getSelection().toString().length;//		dtmp is current selection end position
	rtmp = 0;//		rtmp is the number of characters over the caret is in the current node (current font style/color)
	ryy = 0;//		right end of selection. lyy is left end of selection.
	activeInput.innerHTML = formatTypedInput(pieRaw[inputNum].split(""));
	restoreSelection();

	//	----------------------------------		[   /Recolor Input Text   ]		----------------------------------
	if(!simulating){//		Only update the equation if the simulation is not running
		try{//		parse the input text to check if it is a valid equation, if not, reenter the last valid equation
			eqinput = math.parse(pieRaw[inputNum] , scope);
			equ = eqinput.compile();
			pieEquCompiled[inputNum] = equ;
			equInvalid = false;
		}catch(err){
			eqinput = math.parse(pieLast[inputNum] , scope);
			equ = eqinput.compile();
			pieEquCompiled[inputNum] = equ;
			equInvalid = true;
			equInputField.borderColor = "#FF0000";
			equInputField.borderWidth = 2;			
		}
		if(!equInvalid){
			console.log("Equation #" + inputNum + " is valid");
			pieLast[inputNum] = pieRaw[inputNum];
			equInputField.borderColor = "#AAAAAA";
			equInputField.borderWidth = 1;
		}
	}
}


