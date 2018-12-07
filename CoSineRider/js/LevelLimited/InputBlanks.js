
var blankEquGaps = [];//		stoed as [,*x+ , +t/,+2]. If it starts with a dragable value, the first value is blank.
var blankVar = [];

var blankEquInput = [];
var blankEquText = [];

var blankTmp;

function blankInitialize(){
	equRaw = defaultEqu;
	equLast = defaultEqu;
	//mainInput.innerHTML = defaultEqu;//		set the input field to have the default equation. Then update it and set it active (focus).
	mainInput.focus();
	scope = {x: 0 , t: 0};
	eqinput = math.parse("5" , scope);
	equ = eqinput.compile();
	//		reset undo list
	equUndo = [];
	equCurrentUndo = 0;
	
	if(blankEquInput.length == 0)
		blankSetUpInputs();
	
	//		Space out input blanks to fit between the fixed text of the input
	ctx.font="35px Arial";
	tmpx = 100;//		start at 100px right of left edge
	for(i = 0 ; i < blankEquInput.length ; i++){
		if(i < blankVar.length){//		blank is used, show it and place at the correct location
			blankEquInput[i].style.display = "block";
			tmpx += ctx.measureText(blankEquGaps[i]).width;//		get length of text that is immediatly left of the current blank and add that to the blank's position
			blankEquInput[i].style.left = (tmpx + 10) + "px";//		place next blank 5 pixels right of the right edge of the last input field
			tmpx += 90;//		add width of textbox + a 5 pixel gap on each side of the previous text (80 + 5 + 5)
		}else{//	blank is not used, hide it
			blankEquInput[i].style.display = "none";
		}
	}
	
	//		Space out fixed equation text based on the input positions so all text is evenly spaced
	blankEquText[0].style.left = 100;
	blankEquText[0].innerHTML = '<pre class="unselectable" style="font-size: 35px; font-family: Arial;">' + blankEquGaps[0] + '</pre>';
	for(i = 1 ; i < blankEquText.length ; i++){
		if(i < blankEquGaps.length-1){
			blankEquText[i].style.left = (parseInt(blankEquInput[i-1].style.left) + 85) + "px";//		place text 5px right of last input field's right edge
			blankEquText[i].innerHTML = '<pre class="unselectable" style="font-size: 35px; font-family: Arial;">' + blankEquGaps[i] + '</pre>';
			blankEquText[i].style.display = "block";
		}else{
			blankEquText[i].style.display = "none";
		}
	}
	
	//		set first blank to be the active input
	blankEquInput[0].focus();
	activeInput = blankEquInput[0];

	scope = {x: 0 , t: 0};
	eqinput = math.parse(pieRaw[0] , scope);
	equ = eqinput.compile();
	
	blankUpdateEqu();
}

function blankSetUpInputs(){
	tmpx =  80;
	tmpy = parseInt(mainInput.style.top);

	//		create elements holding the unchangabel equation text between the fillable blanks
	blankTmp = document.createElement("g");
	blankTmp.innerHTML = '<pre class="unselectable" style="font-size: 35px; font-family: Arial;">|  p|</pre>';
	blankTmp.style.position = "absolute";
	blankTmp.style.left = tmpx + "px";
	blankTmp.style.top = tmpy + "px";
	document.body.appendChild(blankTmp);
	blankEquText.push(blankTmp);

	blankTmp = blankTmp.cloneNode(true);		blankTmp.style.left = tmpx + 150 + "px";		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		blankTmp.style.left = tmpx + 350 + "px";		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		blankTmp.style.left = tmpx + 550 + "px";		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		blankTmp.style.left = tmpx + 750 + "px";		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		blankTmp.style.left = tmpx + 950 + "px";		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		blankTmp.style.left = tmpx + 1150 + "px";		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		blankTmp.style.left = tmpx + 1350 + "px";		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);		blankTmp.style.left = tmpx + 1550 + "px";		document.body.appendChild(blankTmp);		blankEquText.push(blankTmp);

	//		create equation input fields
	blankTmp = mainInput.cloneNode(true);
	blankTmp.setAttribute("contentEditable" , "true");
	blankTmp.innerHTML = "2";
	blankTmp.style.width = "80px";
	blankTmp.style.top = tmpy + "px";
	blankTmp.style.left = tmpx + 000 + "px";
	blankTmp.style.color = colors[0];
	document.body.appendChild(blankTmp);
	blankEquInput.push(blankTmp);
	//		create 7 more input fields
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.left = tmpx + 200 + "px";	blankTmp.style.color = colors[1];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.left = tmpx + 400 + "px";	blankTmp.style.color = colors[2];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.left = tmpx + 600 + "px";	blankTmp.style.color = colors[3];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.left = tmpx + 800 + "px";	blankTmp.style.color = colors[4];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.left = tmpx + 1000 + "px";	blankTmp.style.color = colors[5];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.left = tmpx + 1200 + "px";	blankTmp.style.color = colors[6];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	blankTmp = blankTmp.cloneNode(true);	blankTmp.style.left = tmpx + 1400 + "px";	blankTmp.style.color = colors[7];	document.body.appendChild(blankTmp);	blankEquInput.push(blankTmp);
	
	blankEquText.push()
	//		hide main input
//	mainInput.style.display = "none";
	mainInput.style.top = "200px";
}



function blankUpdateEqu(){//		concatenate string fragments of equation and variables to form full equation. Also form colored version for the Input text box.
	equRaw = "";
	//		concatenate the variables stored in the blanks with the unchangeable equation text to read the full equation into equRaw
	for(i = 0 ; i < blankEquGaps.length-1 ; i++){
		equRaw += blankEquGaps[i];
		equRaw += blankEquInput[i].innerText;
		
	}
	equRaw += blankEquGaps[blankEquGaps.length-1];
}

function blankScreenResize(){
	equInputField = mainInput.style;
	equInputField.left = Math.round(screenWidth * 0.0375) + "px";
	equInputField.top = Math.round(screenHeight  - 85) + "px";
	equInputField.width = Math.round(screenWidth * 0.925) + "px";
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
		eqinput = math.parse(equRaw , scope);
		equ = eqinput.compile();
		equInvalid = false;
	}
}