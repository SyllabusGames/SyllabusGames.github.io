
//		the properties we will prompt the player to find equations for
var proSledPosX = false;
var proEquPosX = "";
var proSledPosY = false;
var proEquPosY = "";/*
var proSledLinePosX = false;
var proEquLinePosX = "";
var proSledLinePosY = false;
var proEquLinePosY = "";*/
var proSledVelX = false;
var proEquVelX = "";
var proSledVelY = false;
var proEquVelY = "";
var proGravity = false;
var proEquGravity = "";

var proSlopex = 0;
var proSlopey = 0;


var proInputMap = [];//		0,1,2,3,4 would put the inputs in the order they are above ↑
var proInputIndex = 0;
//		reguardless of what inputs are where, pieEquation 0 is always sledPosX and they continue in the order above
var proDisplayText = "";

// var proEquCompiled = [];

function proInitialize(){
	equLast = equRaw;//		set in level loader
	equInput = math.parse(equRaw , {x: 0 , t: 0, z: 0});
	equCompiled = equInput.compile();
	//		this is the only time the equation is updated in this level
	
	console.log(proEquGravity);
	
	equUndo = [];
	equCurrentUndo = 0;
	
	//		for every programmable property, check if it is used in this level and assign an input field to it
	k = 0;
	proDisplayText = "";
	proInputMap = [];
	if(proSledPosX){
		proDisplayText = "sled.x=<br>";
		proInputMap.push(0);
		pieEquInput[k].innerHTML = proEquPosX;
		k++;
	}
	
	if(proSledPosY){
		proDisplayText = "sled.y=<br>" + proDisplayText;
		proInputMap.push(1);
		pieEquInput[k].innerHTML = proEquPosY;
		k++;
	}
	
	
	if(proSledVelX){
		proDisplayText = "sled.velocity.x=<br>" + proDisplayText;
		proInputMap.push(2);
		pieEquInput[k].innerHTML = proEquVelX;
		k++;
	}
	
	if(proSledVelY){
		proDisplayText = "sled.velocity.y=<br>" + proDisplayText;
		proInputMap.push(3);
		pieEquInput[k].innerHTML = proEquVelY;
		k++;
	}
	
	if(proGravity){
		proDisplayText = "gravity.y=<br>" + proDisplayText;
		proInputMap.push(4);
		pieEquInput[k].innerHTML = proEquGravity;
		k++;
	}
	console.log(pieEquInput[0].innerHTML);
	
	for(i = 0 ; i < 5 ; i++){//		for each input field excluding the main input [0]
	console.log(k);
	pieLimitsText[i].style.display = "none";
		if(i < k)
			pieEquInput[i].style.display = "block";
		else
			pieEquInput[i].style.display = "none";
	}
	
	
	pieEquInputsUsed = k;
	yEqualsText.innerHTML = '<text class="unselectable" style="font-size: 35px; font-family: Arial; color: black;">' + proDisplayText + '</text>';
	
	//		set first blank to be the active input
	pieEquInput[0].focus();
	activeInput = pieEquInput[0];
	proScreenResize();
}

function proScreenResize(){
	k = screenWidth-170;	console.log('proScreenResize');

	for(i = 0 ; i < pieEquInputsUsed ; i++){//		check all equation input fields and set whichever is avtive as activeInput
		//		move and resize equation input fields
		equInputField = pieEquInput[i].style;
		equInputField.left = "170px";
		equInputField.top = (screenHeight  - 85 - i * 45) + "px";
		equInputField.width = (k-65) + "px";
	}
	yEqualsText.style.top = (screenHeight-50 - (pieEquInputsUsed-1)*45) + "px";
	
	if(useDerivative){
		yPrimeEqualsText.style.top = (screenHeight - 95 - (pieEquInputsUsed-1) * 46) + "px";
	}
}

function proShowHideInputs(showHide){
	for(i = pieEquInputsUsed-1 ; i > -1 ; i--){
		pieEquInput[i].style.display = showHide;
	}
}


//		-----------------------------------------------------------------------		[   Update Equations from input fields   ]		-----------------------------------------------------------------------
function proCheckInput(selectedElement){

	var inputNum = -1;
	for(i = 0 ; i < pieEquInputsUsed ; i++){
		if(pieEquInput[i] == selectedElement){
			inputNum = i;
			break;
		}
	}

	if (inputNum == -1)//		a non-input field element was active when this function was called
		return;
	
	
	// pieRaw[proInputMap[inputNum]] = pieEquInput[inputNum].innerText.toLowerCase().replace("π" , "pi");
	proInputIndex = proInputMap[inputNum];
	/*//		check what value this input field is mapped to
	switch (proInputIndex){
		case 0://		sled.x
			break;
		case 1://		sled.y
			
			break;
		case 2://		velocity.x
			
			break;
		case 3://		velocity.y
			
			break;
		case 4://		gravity
			
			break;
	}*/
	
	//		assign the input based on what the input field is mapped to not its input
	activeInput = pieEquInput[inputNum];
	equInputField = activeInput.style;
	activeInput.setAttribute("z-index" , ++inputZ);

	pieUndoListAdd(selectedElement , pieRaw[proInputIndex] , activeInput.innerText);
	
	pieRaw[proInputIndex] = activeInput.innerText.toLowerCase().replace("π" , "pi");
	
	ftmp = getCaretLocation(activeInput);//		ftmp is current caret position
	activeInput.innerHTML = proFormatTypedInput(pieRaw[proInputIndex]);
	restoreSelection();
	
	
	//		the following change is made for the parser, not for the player to see
	pieRaw[proInputIndex] = absBarToFunction(pieRaw[proInputIndex]);
	//	----------------------------------		[   /Recolor Input Text   ]		----------------------------------
	if(!simulating){//		Only update the equation if the simulation is not running
		try{//		parse the input text to check if it is a valid equation, if not, reenter the last valid equation
			equInput = math.parse(pieRaw[proInputIndex].replace(/\.x/g , 'x').replace(/\.y/g , 'y').replace(/\.v/g , 'v') , {t: 0 , sledx: 0 , sledy: 0 , sledvelocityx: 0 , sledvelocityy: 0 , slopex: 0 , slopey: 0 , liney: 0});
			pieEquCompiled[proInputIndex] = equInput.compile();;
			equInvalid = false;
		}catch(err){
			equInput = math.parse(pieLast[proInputIndex] , {t: 0 , sledx: 0 , sledy: 0 , sledvelocityx: 0 , sledvelocityy: 0 , slopex: 0 , slopey: 0 , liney: 0});
			pieEquCompiled[proInputIndex] = equInput.compile();
			equInvalid = true;
			equInputField.borderColor = _inputBorderBadColor;
			equInputField.borderWidth = "3px";			
		}
		if(!equInvalid){
			pieLast[proInputIndex] = pieRaw[proInputIndex];
			equInputField.borderColor = _inputBorderGoodColor
			equInputField.borderWidth = "1px";
		}
	}
}


/*
var proSledVelX = false;
var proEquVelX = "";
var proSledVelY = false;
var proEquVelY = "";
*/

//		sled physics using inputs from the player
function proPhysics(){
	//		move input fields to leave room for the real time value display
	k = screenWidth-170;	console.log('proScreenResize');

	for(i = 0 ; i < pieEquInputsUsed ; i++){
		equInputField = pieEquInput[i].style;
		equInputField.left = "270px";
		equInputField.width = (k-65) + "px";
	}
	
	
	
	
	rotation = rotation%(Math.PI*2);//		keep rotation between 0 and 2pi

	tempZ = apz;//		set the Z coordinate used by equation() [tempZ] (see InputTyped.js) to the sled's Z coordinate 
	pxFrameTimeStore = frameTime;//		store frameTime for restoration later
	pxLiney = equation(pxapx);//		Y position of line under sled
	
	scope = {t: frameTime , sledx: pxapx , sledy: pxapy , sledvelocityx: vx*0.15 , sledvelocityy: vy*0.15 , slopex: 0 , slopey: 0 , liney: pxLiney , gravityy: ay};
	
	
	if(proSledPosX)
		pxapx = pxdt*pieEquCompiled[0].eval(scope) + pxapx*(1-pxdt);
	else
		pxapx += vx*pxdt*0.15;
	
	
	if(proSledPosY)
		pxapy = pxdt*pieEquCompiled[1].eval(scope) + pxapy*(1-pxdt);
	else
		pxapy += vy*pxdt*0.15;

	
	if(proGravity){
		ay = pieEquCompiled[4].eval(scope);
	}
	
			
	frameTime = pxt;//		set frameTime (used by equation()) to be the time for this physics step

	if(pxLiney > pxapy){//		Sled is below the line.
/*
		if(proSledPosY){
			pxapy = pieEquCompiled[0].eval({t: frameTime , sledx: pxapx , sledy: pxapy});
		}else{
			pxapy = pxLiney;//		Jump to surface of equation line where the sled will be next frame so the sled is never below the line.
		}*/
		pxapy = pxLiney;//		Jump to surface of equation line where the sled will be next frame so the sled is never below the line.

		//		----------------		[   Get the tangent unit vector   ]		----------------
		proSlopey = (equation(pxapx+0.1) - equation(pxapx-0.1));//		dy = vertical change in equation line from 0.05 meter to the left to 0.05m right. proSlopex = 0.2
		scaler = 1/Math.sqrt(0.2*0.2 + proSlopey*proSlopey);//	↓
		
		proSlopey *= scaler;//		multiply proSlopey by scaler so [proSlopex , proSlopey] will be a unit vector tangent to the line below the sled
		proSlopex = 0.2*scaler;//	proSlopex = 0.1 (it's original value used to calculate proSlopey and scaler) * scaler so [proSlopex , proSlopey] will be a unit vector
		
		pxDot = vx*proSlopex + vy*proSlopey;//		Dot Product of sled's velocity and the line's tangent.	(Amount of velocity in the direction of the equation line) Dot = a.x*b.x + a.y*b.y
		
		//		set velocity along line
		if((-proSlopey*vx + -proSlopex*-vy) < 0){//		if dot product of slope normal and velocity is negative, sled is trying to go through the line
			//		the new velocity is set to be the amount of original velocity that was in the direction tangent to the equation line
			vx = proSlopex*pxDot;
			vy = proSlopey*pxDot;
		}

		//		----------------		[   Line Movement   ]		----------------
		frameTime -= pxdt*2;//		I am not sure why this calculation needs to jump back 2 timesteps, but it doesn't work otherwise
		
		dydt = pxLiney - equation(pxapx);//		change in equation line's y position at sled's current X position since 2 physics steps ago
		//		if the force is more than 1 (enough for sin(t*5)*10 to launch the sled to 100m) the player is probably using something stupid like a square wave so scale down dydt
		if(dydt > 0.5){
			dydt = math.sign(dydt) * math.sqrt(dydt*2)/2;
		}
		dxdt = -proSlopey * dydt;
		dydt = proSlopex * dydt;
		// ay = 
		
		//		sled is pushed by the line below it moving up
		if(dydt > 0){//		Curve is rising (the sled cannot be pulled by the ground, only pushed)
			vy += dydt*0.5*60;//		divide by 2 to compensate for multiplying the change in time by 2
			vx += dxdt*0.5*60;//		Not sure why I need to multiply by 60 here but it works
		}
		frameTime = pxt;//		restore the current physics step time
	}
}


function proFormatTypedInput(equChars){
	equChars = equChars.replace("**" , "^");
		
	equChars = equChars.split("");//		break input string into a character array
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
			//', '', '', '', '', '', '', '', '#20d120', '#20b0d1
			case 's':
				//		sled.
				if(equChars[i+1] == "l" && equChars[i+2] == "e" && equChars[i+3] == "d" && equChars[i+4] == "."){
					if(equChars[i+5] == "x"){//		sled.x
						equColored += '<a style="color:#d12020">sled.x</a>';
						rtmp += 6;//		shift the character count to the end of sled.x
						i += 5;//		skip to end of sled.x
						ftmp -= 5;//		increment the caret position down by the number of characters in this substring
						break;
					}
					if(equChars[i+5] == "y"){//		sled.y
						equColored += '<a style="color:#3420d1">sled.y</a>';
						rtmp += 6;
						i += 5;
						ftmp -= 5;
						break;
					}
					if(equChars[i+5] == "v" && equChars[i+6] == "e" && equChars[i+7] == "l" && equChars[i+8] == "o" && equChars[i+9] == "c" &&
								equChars[i+10] == "i" && equChars[i+11] == "t" && equChars[i+12] == "y" && equChars[i+13] == "."){
						if(equChars[i+14] == "x"){//		sled.velocity.x
							equColored += '<a style="color:#d2a320">sled.velocity.x</a>';
							rtmp += 15;
							i += 14;
							ftmp -= 14;
							break;
						}
						if(equChars[i+14] == "y"){//		sled.velocity.y
							equColored += '<a style="color:#d120ce">sled.velocity.y</a>';
							rtmp += 15;
							i += 14;
							ftmp -= 14;
							break;
						}
					}
				}
				//		slope.
				if(equChars[i+1] == "l" && equChars[i+2] == "o" && equChars[i+3] == "p" && equChars[i+4] == "e" && equChars[i+5] == "."){
					if(equChars[i+6] == "x"){//		slope.x
						equColored += '<a style="color:#206cd1">slope.x</a>';
						rtmp += 7;
						i += 6;
						ftmp -= 6;
						break;
					}
					if(equChars[i+6] == "y"){//		slope.y
						equColored += '<a style="color:#b0d120">slope.y</a>';
						rtmp += 7;
						i += 6;
						ftmp -= 6;
						break;
					}
				}
				//		just add an s
				equColored += equChars[i];
				rtmp++;
				break;
			case 'g':
				//		gravity.y
				if(equChars[i+1] == "r" && equChars[i+2] == "a" && equChars[i+3] == "v" && equChars[i+4] == "i" && equChars[i+5] == "t" && equChars[i+6] == "y" && equChars[i+7] == "." && equChars[i+8] == "y"){
					equColored += '<a style="color:#7820d1">gravity.y</a>';
					rtmp += 9;//		shift the character count to the end of sled.x
					i += 8;//		skip to end of sled.x
					ftmp -= 8;//		increment the caret position down by the number of characters in this substring
					break;
				}
				//		just add a g
				equColored += equChars[i];
				rtmp++;
				break;
			case 't':
				equColored += '<a style="color:#D15E20">t</a>';
				rtmp++;
				containsVariables = true;
				break;
			case 'z':
				break;
			case '(':
				equColored += '<a style="color:' + _colors[parenOpen%10] + '">(</a>';
				parenOpen++;
				rtmp++;
				break;
			case ')':
				parenOpen--;
				if(parenOpen < 0){//		more ( than )
					equColored += '<i><b>)</b></i>';
					parenOpen++;//		this makes the extra ) not effect the rest of the equation's )s coloring
				}else
					equColored += '<a style="color:' + _colors[parenOpen%10] + '">)</a>';
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
	}
	lyy = rtmp + ftmp;//		set caret position
	ryy = rtmp + ftmp;//		set end of selection
	return equColored;
}