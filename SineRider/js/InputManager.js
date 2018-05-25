/*
//		following code from: http://jsfiddle.net/DerekL/A7gL2/
function setCaretLocation(ele, pos){
	var range = document.createRange(),
		sel = window.getSelection();
	console.log( Math.max(pos-2 , 0));
	range.setStart(ele , Math.max(3 , 0));
	/*if(ele.childNodes[pos - 1] != null){//		removed error
		range.setStart(ele.childNodes[pos - 1], 1);
	}*//*
	range.collapse(true);
	sel.removeAllRanges();
	ele.focus();
	sel.addRange(range);
}

function setCaretPosition(elem, caretPos) {
	if(elem.createTextRange) {
		var range = elem.createTextRange();
		range.move('character', caretPos);
		range.select();
	}else{
		if(elem.selectionStart) {
			elem.focus();
			elem.setSelectionRange(caretPos, caretPos);
		}else
			elem.focus();
	}
}

function setCaretPos(ctrl, pos) {
  // Modern browsers
	if (ctrl.setSelectionRange) {
		ctrl.focus();
		ctrl.setSelectionRange(pos, pos);
		console.log("new");
		// IE8 and below
	}else if(ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
		console.log("old");
	}
}*/
//		reference: http://jsfiddle.net/timdown/vXnCM/
//		setEnd reference: http://jsfiddle.net/WeWy7/3/
function setCaret(el){
	var range = document.createRange();
	var sel = window.getSelection();
	console.log(lyy + " - " + ryy + " - " + dxdt + " - " + dydt);
	range.setStart(el.childNodes[lyy*2], ryy);
//	range.setEnd(el.childNodes[dxdt*2], dydt);//		this is where the problem is
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
	el.focus();
}

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

	//	----------------------------------		[   Equation Changed   ]		----------------------------------
var inputZ = 0;
function checkInputFields(inputNum = 0){
	mainInput = piecInput[inputNum];
	equInputField = mainInput.style;
	mainInput.setAttribute("z-index" , ++inputZ);
	equRaw[inputNum] = mainInput.innerText;
	ftmp = getCaretLocation(mainInput);//		ftmp is current caret position
	dtmp = -window.getSelection().toString().length;//		dtmp is current selection end position
	ltmp = 0;//		ltmp is the number of nodes (font/color changes) over the caret is
	rtmp = 0;//		rtmp is the number of characters over the caret is in the current node (current font style/color)
	dxdt = 0;
	dydt = 0;
	//	----------------------------------		[   Recolor Input Text   ]		----------------------------------
	parenOpen = 0;
	equChars = equRaw[inputNum].split("");
	k = equChars.length;
	equColored = "";
	if(ftmp == 0){//		caret is at 0 , 0
		lyy = 0;
		ryy = 0;
	}
//	if(equChars[0] == 'x' || equChars[0] == 't' || equChars[0] == 'z' || equChars[0] == '(' || equChars[0] == ')')
//		ltmp = -1;//		the first character being formatted causes errors
	for(i = 0 ; i < k ; i++){
		switch(equChars[i]){
			case 'x':
				equColored += '<a style="color:red">x</a>';
				ltmp++;
				rtmp = 0;
				break;
			case 't':
				equColored += '<a style="color:green">t</a>';
				ltmp++;
				rtmp = 0;
				break;
			case 'z':
				equColored += '<a style="color:blue">z</a>';
				ltmp++;
				rtmp = 0;
				break;
			case '(':
				equColored += '<a style="color:' + colors[parenOpen%10] + '">(</a>';
				console.log(parenOpen%10);
				parenOpen++;
				ltmp++;
				rtmp = 0;
				break;
			case ')':
				parenOpen--;
				if(parenOpen < 0){//		more ( than )
					equColored += '<i><b>)</b></i>';
					parenOpen++;//		this makes the extra ) not effect the rest of the equation's )s coloring
				}else
					equColored += '<a style="color:' + colors[parenOpen%10] + '">)</a>';
				ltmp++;
				rtmp = 0;
				break;
			default:
				equColored += equChars[i];
				rtmp++;
				break;
		}
		ftmp--;
		if(ftmp == 0){//		current character is the caret position
			lyy = ltmp;
			ryy = rtmp;
		}if(ftmp == dtmp){//	current character is the end of the selection
			dxdt = ltmp;
			dydt = rtmp;
		}
	}
	mainInput.innerHTML = equColored;
//	setCaret(document.getElementById("input0" , ftmp));
	setCaret(document.getElementById("input" + String(inputNum)));
//	setCaretPos(document.getElementById("input" + String(inputNum) , ftmp));
//	setCaretPosition(mainInput , ftmp);
//	setCaretLocation(mainInput , ftmp);
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
