//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var equChars;
var containsVariables = false;
var pieEquInput = [];//new Array();


//	copied from		http://jsfiddle.net/WeWy7/3/
function restoreSelection(){
	var charIndex = 0
	var range = document.createRange();
	range.setStart(activeInput, 0);
	range.collapse(true);
	var nodeStack = [activeInput], node, foundStart = false, stop = false;
        
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

//		hides the input fields when a menu is opened
function showHideInputs(show){
	console.log(show);
	if(usePiecewise){
		pieShowHideInputs(show);
	}else if(useDrag){
		//		no input to show/hide
	}else if(useFillBlanks){
		blankCheckInput();
	}else if(useCutscene){
		//		no input to show/hide
	}else{
		typeShowHideInputs();
	}
}

	//	----------------------------------		[   Equation Changed   ]		----------------------------------
var inputZ = 0;
function checkInputFields(selectedElement){
	if(selectedElement == "all"){
		if(usePiecewise){
			for(var num = pieEquInputsUsed-1 ; num > -1 ; num--){//		for each input field excluding the main input [0]
				pieCheckInput(pieEquInput[num]);
			}
			return;
		}
	}
	
	if(usePiecewise){
		pieCheckInput(selectedElement);
	}else if(useDrag){
		//		run nothing. Drag input is always updated within InputDrag.js
	}else if(useFillBlanks){
		blankCheckInput();
	}else if(useCutscene){
		//		no input to check
	}else{
		typeCheckInput();
	}
}

//	----------------------------------		[   Recolor Input Text   ]		----------------------------------
function formatTypedInput(equChars){
	k = equChars.length;
	parenOpen = 0;
	
	dtmp = -window.getSelection().toString().length;//		dtmp is current selection end position
	rtmp = 0;//		rtmp is the number of characters over the caret is in the current node (current font style/color)
	containsVariables = false;
	var equColored = "";
	if(ftmp == 0){//		caret is at 0 , 0
		lyy = 0;//		right end of selection. lyy is left end of selection.
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
					equColored += '<a style="color:#F08030">π</a>';
					//rtmp--;//		back the slelection up one character left since the i has been removed
					i++;//		the character i is skipped
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
	return equColored;
}


