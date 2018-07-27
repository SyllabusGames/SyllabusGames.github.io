//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var equChars;
var containsVariables = false;

//	copied from		http://jsfiddle.net/WeWy7/3/
function restoreSelection(){
	var charIndex = 0, range = document.createRange();
	range.setStart(mainInput, 0);
	range.collapse(true);
	var nodeStack = [mainInput], node, foundStart = false, stop = false;
        
	while (!stop && (node = nodeStack.pop())) {
		if (node.nodeType == 3) {
			var nextCharIndex = charIndex + node.length;
			if (!foundStart && lyy >= charIndex && lyy <= nextCharIndex) {
				range.setStart(node, lyy - charIndex);
				foundStart = true;
			}
			if (foundStart && ryy >= charIndex && ryy <= nextCharIndex) {
				range.setEnd(node, ryy - charIndex);
				stop = true;
			}
			charIndex = nextCharIndex;
		} else {
			var i = node.childNodes.length;
			while (i--){
				nodeStack.push(node.childNodes[i]);
			}
		}
	}

	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

//		reference: http://jsfiddle.net/timdown/vXnCM/
//		setEnd reference: http://jsfiddle.net/WeWy7/3/

function getCaretLocation(element){
	try{
		var range = window.getSelection().getRangeAt(0),
			preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.startContainer, range.startOffset);
	}catch(err){
		return 0;
	}
	return preCaretRange.toString().length;
}

function showHideInputs(show){
	if(show)
		stmp = "block";
	else
		stmp = "none";
	for(i = piecInput.length-1 ; i > -1 ; i--){
		piecInput[i].style.display = stmp;
	}
}

	//	----------------------------------		[   Equation Changed   ]		----------------------------------
var inputZ = 0;
function checkInputFields(inputNum = 0){
	mainInput = piecInput[inputNum];
	equInputField = mainInput.style;
	mainInput.setAttribute("z-index" , ++inputZ);

	equRaw[inputNum] = mainInput.innerText.toLowerCase().replace("**" , "^");

	if(useRender)//		clear this canvas so if it isn't used, it won't still be shown
		renderCanvas.clearRect(0, 0, xyzWidth, xyzHeight);
	useRender = (equRaw[inputNum].indexOf('=')+equRaw[inputNum].indexOf('<')+equRaw[inputNum].indexOf('>') > -3);//		start full screen renderer if the equation contains = < or >
	if(useRender){//		start the first render pass to load in the new equation
		document.getElementById('render').width = screenWidth;
		document.getElementById('render').height = screenHeight;
		render2d();
	}

	ftmp = getCaretLocation(mainInput);//		ftmp is current caret position
	dtmp = -window.getSelection().toString().length;//		dtmp is current selection end position
	rtmp = 0;//		rtmp is the number of characters over the caret is in the current node (current font style/color)
	ryy = 0;//		right end of selection. lyy is left end of selection.
	//	----------------------------------		[   Recolor Input Text   ]		----------------------------------
	parenOpen = 0;
	//if(!simulating)
		containsVariables = false;
	equChars = equRaw[inputNum].split("");
	k = equChars.length;
	equColored = "";
	if(ftmp == 0){//		caret is at 0 , 0
		lyy = 0;
	}
	for(i = 0 ; i < k ; i++){
		switch(equChars[i]){
			case 'x':
				equColored += '<a style="color:#FF0000">x</a>';
				rtmp++;
				containsVariables = true;
				break;
			case 't':
				equColored += '<a style="color:#00A000">t</a>';
				rtmp++;
				containsVariables = true;
				break;
			case 'z':
				equColored += '<a style="color:#0000FF">z</a>';
				rtmp++;
				containsVariables = true;
				break;
			case '(':
				equColored += '<a style="color:' + colors[parenOpen%10] + '">(</a>';
				parenOpen++;
				rtmp++;
				break;
			case ')':
				parenOpen--;
				if(parenOpen < 0){//		more ( than )
					equColored += '<i><b>)</b></i>';
					parenOpen++;//		this makes the extra ) not effect the rest of the equation's )s coloring
				}else
					equColored += '<a style="color:' + colors[parenOpen%10] + '">)</a>';
				rtmp++;
				break;
			case ' ':
				break;//		remove spaces
			case 'p':
				if(i < equChars.length-1 && equChars[i+1] == 'i'){
					equColored += '<a style="color:#F08030">p</a>';
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
		if(ftmp == 0){//		current character is the caret position
			lyy = rtmp;
		}
		if(ftmp == dtmp){//	current character is the end of the selection
			ryy = rtmp;
		}
	}
	mainInput.innerHTML = equColored;
	restoreSelection();

	//	----------------------------------		[   /Recolor Input Text   ]		----------------------------------

	if(!simulating){//		Only update the equation if the simulation is not running
		try{//		parse the input text to check if it is a valid equation, if not, reenter the last valid equation
			eqinput = math.parse(equRaw[inputNum] , scope);
			equ = eqinput.compile();
			equCompiled[inputNum] = equ;
			equInvalid = false;
		}catch(err){
			eqinput = math.parse(equLast[inputNum] , scope);
			equ = eqinput.compile();
			equCompiled[inputNum] = equ;
			equInvalid = true;
			equInputField.borderColor = "#FF0000";
			equInputField.borderWidth = 2;			
		}
		if(!equInvalid){
			equLast[inputNum] = equRaw[inputNum];
			equInputField.borderColor = "#AAAAAA";
			equInputField.borderWidth = 1;
		}
	}
}

//		-----------------------------------------------------------------------		[   Set up Equation Input Box   ]		-----------------------------------------------------------------------
function setUpInput(){
	//ctx.font = "60px Arial";
	equInputField = mainInput.style;//		used to set the border color when the equation contains errors
	equRaw[0] = defaultEqu;
	equLast[0] = defaultEqu;
	//mainInput.innerHTML = defaultEqu;//		set the input field to have the default equation. Then update it and set it active (focus).
	mainInput.focus();
	scope = {x: 0 , t: 0};
	eqinput = math.parse(equRaw[0] , scope);
	equ = eqinput.compile();
}
