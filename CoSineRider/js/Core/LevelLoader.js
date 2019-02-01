//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var loadedLevel;
var levelName = "No level loaded";
var levelType = "";
var levelCode = "";//		Used by Goal (in Collidions.js) to save the current level as complete
var partstring = "";
var levelMap;//		array of strings containing all levels' save/load codes
var mapIndex = 0;//	index of current level in levelMap

var useGuide = false;//		show guide line.	Guide variables declared in EquationLine.js
var showt0 = false;//		time is not just set to zero
//var usePGaps = false;//		piecewise with gaps. When false, there are no gaps between where one equation ends and the next starts
var useZ = false;//			read Z as a variable and show a line for Z = -10 and Z = 10. Give the player a slider to shift Z.
var useNone = false;//		This is not a game level so the sledder, background, and colliders will not be loaded
var useRender = false;
var useDerivative = false;
var usePolar = false;
/*	Polar Guide
		world coordinates to theta = math.atan(Y/X);
			theta wrapping fix (so it goes from 0 to 2pi for a full circle)
				if(X < 0){
					theta = Math.PI + theta;
				}else if(Y < 0){
					theta = _piTimes2 + theta;
				}
		world coordinates to radius = math.sqrt(X*X + Y*Y)
		
		polar to world coordinates
			X = R * math.cos(theta);
			Y = R * math.sin(theta);
*/
var show3D = false;//		Show/Hide 3D view. If off, still show the Z slider and current value, just don't render the 3D view

var useScreenLimit = true;//		in checkpoint levels, limit screen movement to show only the last and next checkpoints

var isPiecewise = false;
var isProxyVar = false;
var isProxyFunction = false;
var isDrag = false;
var isFillBlanks = false;//Give the player blanks to fill in instead of letting them write their own equation
var isProgramming = false;
var isCutscene = false;//	level is a cutscene

//var equationHistory[];//		a list of all equations that have beaten a level

var lineNum = 0;


function preloadLevelAssets(loadThis){
	//		From https://social.msdn.microsoft.com/Forums/en-US/64ea2d16-7594-400b-8b25-8b3b9a078eab/read-external-text-file-with-javascript?forum=sidebargadfetdevelopment
	//		Read external file from web address
	var txtFile = new XMLHttpRequest();
	var levelLoadName = loadThis;
	console.log("Loading " + levelLoadName);
	txtFile.open("GET", "https://syllabusgames.github.io/CoSineRider/Levels/" + levelLoadName + ".txt", true);
	txtFile.onreadystatechange = function() {
		if (txtFile.readyState === 4){  // Makes sure the document is ready to parse.
			if (txtFile.status === 200){  // Makes sure it's found the file.
				localStorage.setItem(levelLoadName , txtFile.responseText);
				
				
			/*	console.log(allText.substring(allText.length-3));
				console.log(allText.substring(allText.length-20));
				if(allText.substring(allText.length-3) == "End"){//		if you just loaded a level, load the .svg it uses
					var findSvg = allText.split('\n');
					if(localStorage.getItem(findSvg[findSvg.length-2]) != null){//		if this .svg is already loaded, quit
						console.log(findSvg[findSvg.length-2] + " Exists");
						preloadLevelAssets(findSvg[findSvg.length-2]);
					}
				}*/
			}
		}
	}
	txtFile.send(null);
}

function loadExternalLevel(){
/*
		  function handleFileSelect(evt) {
			var files = evt.target.files; // FileList object

			// files is a FileList of File objects. List some properties.
			var output = [];
			for (var i = 0, f; f = files[i]; i++) {
			  output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
						  f.size, ' bytes, last modified: ',
						  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
						  '</li>');
			}
			document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
		  }

		  document.getElementById('files').addEventListener('change', handleFileSelect, false);
		*/
}

function levelCleared(){
	localStorage.setItem(levelCode , 1);//	save that the current level has been cleared
	mapIndex++;//		advance to the next level
	loadBuiltInLevel();//		load the next level
}

function loadLevelMap(){//		load the list of levels which was created in LevelSaver.js
	levelMap = localStorage.getItem("LevelMap").split(',');
//	preloadLevelAssets(levelMap[mapIndex+1]);
	loadBuiltInLevel();
}

function loadBuiltInLevel(){
	simulating = false;
	clearGraphedPoints();
	graphPointUndoXs = [[]];
	levelCode = levelMap[mapIndex];
//	console.log(levelCode);
//	console.log(localStorage.getItem(levelCode));
	loadedLevel = localStorage.getItem(levelCode).split('\n');
	levelName = loadedLevel[0];
	levelType = loadedLevel[1];
	lineNum = 2;

	//		load sledder start position
	//console.log(loadedLevel[lineNum]);
	partstring = loadedLevel[lineNum].split(',');
	defaultSledx = parseFloat(partstring[0]);
	defaultSledy = parseFloat(partstring[1]);
	apx = defaultSledx;
	pxapx = defaultSledx;
	pxLastx = defaultSledx;
	apy = defaultSledy;
	pxapy = defaultSledy;
	pxLasty = defaultSledy;
	lineNum++;

	//		last level used multiple input fields but this one doesn't so hide all inputs
	if((isPiecewise || isProxyVar || isProxyFunction) && (levelType != "PW" || levelType != "PV" || levelType != "PF")){
		for(k = 0 ; k < 5 ; k++){
			pieEquInput[k].style.display = "none";
			pieLeftInput[k].style.display = "none";
			pieRightInput[k].style.display = "none";
			pieLimitsText[k].style.display = "none";
			pieEquInput[k].setAttribute("contentEditable" , "true");
			pieEquInput[k].style.backgroundColor = _inputColor;
		}
	}
	//		some levels may change the background color of the main input, fix it here
	mainInput.style.backgroundColor = _inputColor;

	
	//console.log(isFillBlanks + " - " + levelType);
	//		last level was fill in the blank but this one isn't so hide all inputs
	if (isFillBlanks && levelType != "BL"){
		console.log("No longer blank");
		for(i = 0 ; i < blankDefaultVar.length ; i++){
			blankEquInput[i].style.display = "none";
		}
		for(i = 1 ; i < blankEquGaps.length-1 ; i++){
			blankEquText[i].style.display = "none";
		}
	}

	isPiecewise = false;
	isProxyVar = false;
	isProxyFunction = false;
	isDrag = false;
	isFillBlanks = false;
	isProgramming = false;
	isCutscene = false;
	
	useGuide = false;
	showt0 = false;
	useZ = false;
	useNone = false;
	useDerivative = false;
	usePolar = false;
	
	useScreenLimit = false;
	ay = -30;//		reset gravity after programming levels
	
	//		-----------------------------------------------------------------------		[   Load Default Eqiations   ]		-----------------------------------------------------------------------
	switch(levelType){
		//		-----------------------------------------------------------------------		[   SineRider Clasic   ]		-----------------------------------------------------------------------
		case "SR":
		//		"LV1: Using Time\nSR\n0,0\nsin(x-8*t)+(x-12)^2/300-1\nshowt0\nuseZ\n44,4\nCave\nEnd"
			equRaw = loadedLevel[lineNum];
			mainInput.innerHTML = equRaw;
			mainInput.style.display = "block";
			activeInput = mainInput;//		set the active input field to the only input field
			lineNum++;
			typeInitialize();
			break;
		//		-----------------------------------------------------------------------		[   Piecewise Typed Input   ]		-----------------------------------------------------------------------
		case "PW":
		//		LV2: Piecwise\nPW\n0,0\n3\n-999,20,-x/2+t*1.5\n20,60,t*1.5-10\n60,200,x/10-16+t*1.5\n91,17\nTower\nEnd"
			isPiecewise = true;

			pieEquInputsUsed = parseInt(loadedLevel[lineNum]);//		get total number of input fields used
			pieInitialize();//		see InputPiecewise.js
			lineNum++;

			for(k = 0 ; k < pieEquInputsUsed ; k++){//		for each input field excluding the main input [0]
		//		console.log(loadedLevel[k+lineNum]);
				pieEquInput[k].style.display = "block";
				pieLeftInput[k].style.display = "block";
				pieRightInput[k].style.display = "block";
				pieLimitsText[k].style.display = "block";


				partstring = loadedLevel[k+lineNum].split(',');//		equations are stored as LeftLimit,RightLimit,Equation

				//		----------------		[   Left Limit   ]		----------------
				if(partstring[0][0] == 'L'){//		Lock input field
					partstring[0] = partstring[0].substring(1);//		cut L off the front of this input
					pieLeftInput[k].setAttribute("contentEditable" , "false");
					pieLeftInput[k].style.backgroundColor = _inputLockedColor;
				}else{//		unlock input field
					pieLeftInput[k].setAttribute("contentEditable" , "true");
					pieLeftInput[k].style.backgroundColor = _inputColor;
				}
				
				pieLeftLimit[k] = parseInt(partstring[0]);
				pieLeftInput[k].innerHTML = partstring[0];
				if(partstring[0].indexOf("t") != -1){//		if limit contains t, store it as an equation
					equInput = math.parse(partstring[0] , {t: 0});
					pieLeftInputCompiled[k] = equInput.compile();
				}

				//		----------------		[   Right Limit   ]		----------------
				if(partstring[1][0] == 'L'){//		Lock input field
					partstring[1] = partstring[1].substring(1);//		cut L off the front of this input
					pieRightInput[k].setAttribute("contentEditable" , "false");
					pieRightInput[k].style.backgroundColor = _inputLockedColor;
				}else{//		unlock input field
					pieRightInput[k].setAttribute("contentEditable" , "true");
					pieRightInput[k].style.backgroundColor = _inputColor;
				}
				pieRightLimit[k] = parseInt(partstring[1]);
				pieRightInput[k].innerHTML = partstring[1];
				if(partstring[1].indexOf("t") != -1){//		if limit contains t, store it as an equation
					equInput = math.parse(partstring[1] , {t: 0});
					pieRightInputCompiled[k] = equInput.compile();
				}
				
				//		----------------		[   Input field   ]		----------------
				if(partstring[2][0] == 'L'){//		Lock input field
					partstring[2] = partstring[2].substring(1);//		cut L off the front of this input
					pieEquInput[k].setAttribute("contentEditable" , "false");
					pieEquInput[k].style.backgroundColor = _inputLockedColor;
				}else{//		unlock input field
					pieEquInput[k].setAttribute("contentEditable" , "true");
					pieEquInput[k].style.backgroundColor = _inputColor;
				}
				pieEquInput[k].innerHTML = partstring[2];
			}
			while(k < 5){//		hide each input field not used
				pieEquInput[k].style.display = "none";
				pieLeftInput[k].style.display = "none";
				pieRightInput[k].style.display = "none";
				pieLimitsText[k].style.display = "none";
				k++;
			}
			lineNum += pieEquInputsUsed;

			break;
			//		-----------------------------------------------------------------------		[   Proxy Variable Input   ]		-----------------------------------------------------------------------
		case "PV":
			isProxyVar = true;

			pieEquInput[0].innerHTML = loadedLevel[lineNum].substring(2);
			pieEquInput[0].style.display = "block";
			if(loadedLevel[lineNum][1] == "="){
				pieEquInput[0].setAttribute("contentEditable" , "true");
				pieEquInput[0].style.backgroundColor = _inputColor;
			}else{
				pieEquInput[0].setAttribute("contentEditable" , "false");
				pieEquInput[0].style.backgroundColor = _inputLockedColor;
			}
			
			//	load a
			if(loadedLevel[++lineNum][1] == "="){//	check if it is fixed or editable
				pieEquInput[1].setAttribute("contentEditable" , "true");
				pieEquInput[1].style.backgroundColor = _inputColor;
			}else{
				pieEquInput[1].setAttribute("contentEditable" , "false");
				pieEquInput[1].style.backgroundColor = _inputLockedColor;
			}
			pieEquInput[1].style.display = "block";

			pieEquInput[1].innerHTML = loadedLevel[lineNum].substring(2);//	load default for a
			pieEquInputsUsed = 1;//		set pieEquInputsUsed to the index of the last (greatest) input field isDrag
			
			//		the equation may not use b, c, or d so activate and deactivate inputs based on whether they are used and only advance lineNum if each is used
			lineNum++;
			if(loadedLevel[lineNum][0] == "B"){//		load b
				pieEquInputsUsed = 2;
				pieEquInput[2].style.display = "block";
				pieEquInput[2].innerHTML = loadedLevel[lineNum].substring(2);
				if(loadedLevel[lineNum][1] == "="){
					pieEquInput[2].setAttribute("contentEditable" , "true");
					pieEquInput[2].style.backgroundColor = _inputColor;
				}else{
					pieEquInput[2].setAttribute("contentEditable" , "false");
					pieEquInput[2].style.backgroundColor = _inputLockedColor;
				}
				lineNum++;
				if(loadedLevel[lineNum][0] == "C"){//		load c
				pieEquInputsUsed = 3;
					pieEquInput[3].style.display = "block";
					pieEquInput[3].innerHTML = loadedLevel[lineNum].substring(2);
					if(loadedLevel[lineNum][1] == "="){
						pieEquInput[3].setAttribute("contentEditable" , "true");
						pieEquInput[3].style.backgroundColor = _inputColor;
					}else{
						pieEquInput[3].setAttribute("contentEditable" , "false");
						pieEquInput[3].style.backgroundColor = _inputLockedColor;
					}
					lineNum++;
					if(loadedLevel[lineNum][0] == "D"){//		load d
						pieEquInputsUsed = 4;
						pieEquInput[4].style.display = "block";
						pieEquInput[4].innerHTML = loadedLevel[lineNum].substring(2);
						if(loadedLevel[lineNum][1] == "="){
							pieEquInput[4].setAttribute("contentEditable" , "true");
							pieEquInput[4].style.backgroundColor = _inputColor;
						}else{
							pieEquInput[4].setAttribute("contentEditable" , "false");
							pieEquInput[4].style.backgroundColor = _inputLockedColor;
						}
						lineNum++;//		move off input d. the other inputs are moved allong by the ++lineNum in the if statement 
					}else{//						unload d
						pieEquInput[4].style.display = "none";
					}
					
				}else{//						unload c
					pieEquInput[3].style.display = "none";
				}
				
			}else{//						unload b
				pieEquInput[2].style.display = "none";
			}
			pVarInitialize();//		update the the y= text to be a= \n b=...
			break;
			
				//		-----------------------------------------------------------------------		[   Proxy Function Input   ]		-----------------------------------------------------------------------
		case "PF":
			isProxyFunction = true;

			pieEquInput[0].innerHTML = loadedLevel[lineNum].substring(2);
			pieEquInput[0].style.display = "block";
			if(loadedLevel[lineNum][1] == "="){
				console.log("editable");
				pieEquInput[0].setAttribute("contentEditable" , "true");
				pieEquInput[0].style.backgroundColor = _inputColor;
			}else{
				pieEquInput[0].setAttribute("contentEditable" , "false");
				pieEquInput[0].style.backgroundColor = _inputLockedColor;
			}
			
			//	load f()
			if(loadedLevel[++lineNum][1] == "="){//	check if it is fixed or editable
				pieEquInput[1].setAttribute("contentEditable" , "true");
				pieEquInput[1].style.backgroundColor = _inputColor;
			}else{
				pieEquInput[1].setAttribute("contentEditable" , "false");
				pieEquInput[1].style.backgroundColor = _inputLockedColor;
			}
			pieEquInput[1].style.display = "block";

			pieEquInput[1].innerHTML = loadedLevel[lineNum].substring(2);//	load default for a
			pieEquInputsUsed = 1;//		set pieEquInputsUsed to the index of the last (greatest) input field isDrag
			
			//		the equation may not use b, c, or d so activate and deactivate inputs based on whether they are used and only advance lineNum if each is used
			lineNum++;
			if(loadedLevel[lineNum][0] == "g"){//		load b
				pieEquInputsUsed = 2;
				pieEquInput[2].style.display = "block";
				pieEquInput[2].innerHTML = loadedLevel[lineNum].substring(2);
				if(loadedLevel[lineNum][1] == "="){
					pieEquInput[2].setAttribute("contentEditable" , "true");
					pieEquInput[2].style.backgroundColor = _inputColor;
				}else{
					pieEquInput[2].setAttribute("contentEditable" , "false");
					pieEquInput[2].style.backgroundColor = _inputLockedColor;
				}
				lineNum++;
				if(loadedLevel[lineNum][0] == "h"){//		load c
				pieEquInputsUsed = 3;
					pieEquInput[3].style.display = "block";
					pieEquInput[3].innerHTML = loadedLevel[lineNum].substring(2);
					if(loadedLevel[lineNum][1] == "="){
						pieEquInput[3].setAttribute("contentEditable" , "true");
						pieEquInput[3].style.backgroundColor = _inputColor;
					}else{
						pieEquInput[3].setAttribute("contentEditable" , "false");
						pieEquInput[3].style.backgroundColor = _inputLockedColor;
					}
					lineNum++;
					if(loadedLevel[lineNum][0] == "k"){//		load d
						pieEquInputsUsed = 4;
						pieEquInput[4].style.display = "block";
						pieEquInput[4].innerHTML = loadedLevel[lineNum].substring(2);
						if(loadedLevel[lineNum][1] == "="){
							pieEquInput[4].setAttribute("contentEditable" , "true");
							pieEquInput[4].style.backgroundColor = _inputColor;
						}else{
							pieEquInput[4].setAttribute("contentEditable" , "false");
							pieEquInput[4].style.backgroundColor = _inputLockedColor;
						}
						lineNum++;//		move off input d. the other inputs are moved allong by the ++lineNum in the if statement 
					}else{//						unload d
						pieEquInput[4].style.display = "none";
					}
					
				}else{//						unload c
					pieEquInput[3].style.display = "none";
				}
				
			}else{//						unload b
				pieEquInput[2].style.display = "none";
			}
			pFunInitialize();//		update the the y= text to be a= \n b=...		must be preformed after pieEquInputsUsed has been set
			break;
			
			//		-----------------------------------------------------------------------		[   Drag Points   ]		-----------------------------------------------------------------------
		case "DR":
			isDrag = true;
		//			"LV1: Drag Points\nRD\n0,0\n_*x+_\n2,v,1,1,1\n44,4\nCave\nEnd"
			//		load like a standard typed input level
			equRaw = loadedLevel[lineNum];
			dragEquGaps = equRaw.split("_");
			lineNum++;

			//		now load in the controlls for draging points for each _ in the equation
			for(i = 0 ; i < dragEquGaps.length-1 ; i++){
				partstring = loadedLevel[lineNum].split(',');//		data is stored as default value,v/h,x,y,scale
				dragVar.push(parseFloat(partstring[0]));//		default value
				dragDirection.push(partstring[1]);
				dragDefaultx.push(parseFloat(partstring[2]));
				dragx.push(parseFloat(partstring[2]));
				dragDefaulty.push(parseFloat(partstring[3]));
				dragy.push(parseFloat(partstring[3]));
				dragDependent0.push(parseInt(partstring[4]));
				dragDependent1.push(parseInt(partstring[5]));
				dragDependent2.push(parseInt(partstring[6]));
				lineNum++;
			}
			dragInitialize();
			break;
		//		-----------------------------------------------------------------------		[   Fill In The Blank   ]		-----------------------------------------------------------------------
		case "BL":
			isFillBlanks = true;
			//		load like a standard typed input level
			equRaw = loadedLevel[lineNum];
			blankEquGaps = equRaw.split("_");
			lineNum++;
			blankDefaultVar = loadedLevel[lineNum].split(',');//		load all default values
			lineNum++;
			partstring = loadedLevel[lineNum].split(',');//		load all input field widths
			lineNum++;
			for(i = partstring.length-1 ; i > -1 ; i--){
				blankEquInput[i].style.width = partstring[i] + "px";
			}
			blankInitialize();
			break;//		-----------------------------------------------------------------------		[   Programming   ]		-----------------------------------------------------------------------
		case "PR":
			isProgramming = true;
			equRaw = loadedLevel[lineNum];
			lineNum++;
			//		for a maximum of 5*2 lines,  check for the 5 possible inputs the level could use
			for(i = 0 ; i < 5 ; i++){
				switch(loadedLevel[lineNum]){
					case "proSledPosX":
						proSledPosX = true;
						lineNum++;
						proEquPosX = loadedLevel[lineNum];
						lineNum++;
						break;
					case "proSledPosY":
						proSledPosY = true;
						lineNum++;
						proEquPosY = loadedLevel[lineNum];
						lineNum++;
						break;
					case "proSledVelX":
						proSledVelX = true;
						lineNum++;
						proEquVelX = loadedLevel[lineNum];
						lineNum++;
						break;
					case "proPSledVelY":
						proPSledVelY = true;
						lineNum++;
						proEquVelY = loadedLevel[lineNum];
						lineNum++;
						break;
					case "proGravity":
						proGravity = true;
						lineNum++;
						proEquGravity = loadedLevel[lineNum];
						lineNum++;
						break;
				}
			}
			proInitialize();
			break;
		//		-----------------------------------------------------------------------		[   Cutscene   ]		-----------------------------------------------------------------------
		case "CU":
			isCutscene = true;
			//		load like a standard typed input level
			cutInitialize(loadedLevel[lineNum]);
			lineNum++;
			break;
	}
	
	
	//		-----------------------------------------------------------------------		[   Optional Modes   ]		-----------------------------------------------------------------------

	//		Guide Equation
	if(loadedLevel[lineNum].substring(0,2) == "y="){
		useGuide = true;
		guideInput = math.parse(loadedLevel[lineNum].substring(2) , {x: 0 , t: 0});
		guideCompiled = guideInput.compile();
		lineNum++;
	}

	//		showt0
	if(loadedLevel[lineNum] == "showt0"){
		showt0 = true;
		lineNum++;
	}

	//		UseZ
	if(loadedLevel[lineNum] == "useZ"){
		if(useZ === false){//		if it is being turned on instead of just kept on, display the render so the player notices the 3D is back.
			show3D = true;
			useZ = true;
			//		show the canvases showing the 3D render
//			these 3↓ used to be outside the second if statement
			xyzc.style.display="block";
			xyz2c.style.display="block";
			setUpXYZ();
		}
		lineNum++;
	}else{
		//		hide the canvases showing the 3D render
		xyzc.style.display="none";
		xyz2c.style.display="none";
	}	

	//		useNone (This is not a game level so the sledder, background, and colliders will not be loaded)
	if(loadedLevel[lineNum] == "useNone"){
		useNone = true;
		buttonPause();
		lineNum++;
		playPauseButton.style.display = "none";
	}else{
		playPauseButton.style.display = "block";
	}
	
	//		UseDerivative (graph the derivative of the equation entered instead of the equation itself)
	if(loadedLevel[lineNum] == "useDerivative"){
		useDerivative = true;
		lineNum++;
		yPrimeEqualsText.style.display = "block";
		screenSizeChanged();//		update the screen size again to move yPrimeEqualsText to the right position
	}else{
		yPrimeEqualsText.style.display = "none";
	}
	
	//		UsePolar (graph in polar coordinates)
	if(loadedLevel[lineNum] == "usePolar"){
		usePolar = true;
		lineNum++;
	}
	
	
	
	
	
	
	//		useScreenLimit (in checkpoint levels, limit screen movement to show only the last and next checkpoints)
	if(loadedLevel[lineNum] == "useScreenLimit"){
		useScreenLimit = true;
		lineNum++;
	}
	
	//	----------------------------------		[   camera track point   ]		----------------------------------
	partstring = loadedLevel[lineNum].split(',');//		camera track point
	trackPointx = parseFloat(partstring[0]);
	trackPointy = parseFloat(partstring[1]);
	lineNum++;

	//		-----------------------------------------------------------------------		[   BACKGROUND AND COLLIDER SVG   ]		-----------------------------------------------------------------------
	drawParallax = false;
	drawBackground = loadedLevel[lineNum] != "none";
	if(drawBackground){
		background.src = "Levels/" + loadedLevel[lineNum]+ ".svg";//		load background SVG
		background.src = "Levels/" + loadedLevel[lineNum]+ ".svg";//		load background SVG
		if(!useNone)//		if a .svg is loaded and this is an actual level (useNone means this is a blank page for graphing)
			loadCollidersFromSvg(localStorage.getItem(loadedLevel[lineNum] + "Colliders"));//		load collider SVG
		
		//		load parallax background .svg image
		if(loadedLevel[lineNum + 1].substring(0,9) == "parallax="){
			parallaxBackground.src = "Levels/" + loadedLevel[lineNum+1].substring(9)+ ".svg";//		load background SVG
			drawParallax = true;
			lineNum++;
		}
	}
	
		//		-----------------------------------------------------------------------		[   Text Input Field   ]		-----------------------------------------------------------------------

	//		if a 3B1B animation is called for, set up the input for that
//	setUpNumberLines();//		see 3B1BAnimations.js


	//		Screen Position Reset
	screenFollowSledder();//	move the screen to show the sledder and goal. See Sledder.js
	
		//		set default drag screen positioin so it doesn't jump when you start moving the screen
	dragScreenX = screenx + screenWidth/2/screenScale;
	dragScreenY = -screeny + screenHeight/2/screenScale;
	dragScreenScale = screenScale;
	
	resetSledder();
	simulating = false;//		resetSledder() always flips the simulating value so set it to false so the sled doesn't move.
	
	//		reset undo list (This must be done last so the player cannot undo the level setup and pull in last level's equations)
	equUndo = [];
	equCurrentUndo = 0;
}

	

	//		-----------------------------------------------------------------------		[   Import .svg to single array   ]		-----------------------------------------------------------------------
function loadCollidersFromSvg(sss){
	/*		this function reads in the translation of the entire file (if there is one),
				splits the input file into strings at "<path" (thus cutting off any junk at the file's start) and stores the parts in the array partstring,
				iterates through each section of the file
				checks for circles indicating goals or checkpoints
				cuts down the string to be just a point list and reformats it to make parsing easier
				reads in all points into allGroundPointsX,Y
				records false in allGroundBreaks every time a path ends so lines will not be drawn to
					connect the end of one path to the start of the next
	*/
	//		reset collider storing variables
	allGroundPointsX = [];
	allGroundPointsY = [];
	allGroundBreaks = [];
	checkx = [];
	checky = [];
	checkr = [];
	var absolute = false;
	useCheckpoints = false;
	
	//		get the translation of the entire image
	if(sss.indexOf("translate(") != -1){
		partstring = sss.substring(sss.indexOf("translate(") + 10);
		partstring = partstring.substring(0 , partstring.indexOf(")") );
		var ministring = partstring.split(" ");//		each ministring contains one string of points
		//		Shift and scale the translation (dx,dy) so that 1000,1000 is the center and 1 meter in game is 5 units in svg
		dx = (1000 - parseFloat(ministring[0]))/5;
		dy = (1000 - parseFloat(ministring[1]))/5;
		// console.log("svg translation = " + partstring);
	}else{
		dx = 200;//		1000/5
		dy = 200;
	}
	// console.log("dx = " + dx + " dy = " + dy);

	partstring = sss.split('<path');//		each partstring contains one path
	//		loop through each path, through each set of points, then split X and Y on the ,
	for(i = 1 ; i < partstring.length  ; i++){//		i=1 because the 0ith entry is just the file header information
		// console.log(partstring[i]);

		partstring[i] = partstring[i].substring(3+partstring[i].search(/d="m/i));//		cut fluff off the start of partstring[i]
		absolute = (partstring[i][0] == 'M');//		capital m indicates absolute coordinates. Lowercase m indicates relative.
		
		//		check for circles in this part of the string
	//	----------------------------------		[   Goals and Checkpoints   ]		----------------------------------
		var circleDeclare = /<circle/g;
		while ((match = circleDeclare.exec(partstring[i])) != null) {
			ministring = partstring[i].substring(match.index);//		start ministring at the next <circle declaration so it can only pull data for that circle
			
			k = ministring.indexOf("Goal");
			var isGoal = (k != -1) && (k < ministring.indexOf(">"));//		the word goal is in this circle object (id="goal")

			ministring = ministring.substring(ministring.indexOf('cx="') + 4);//		cut ministring to start with circle center.x
			tmpx = parseFloat(ministring.substring(0 , ministring.indexOf('"')))/5 - dx;

			
			ministring = ministring.substring(ministring.indexOf('cy="') + 4);//		cut ministring to start with circle center.x
			tmpy = dy - parseFloat(ministring.substring(0 , ministring.indexOf('"')))/5;

			
			ministring = ministring.substring(ministring.indexOf('r="') + 3);//		cut ministring to start with circle center.x
			ftmp = parseFloat(ministring.substring(0 , ministring.indexOf('"')))/5;
			
			//		if this is the goal, set goal. If not, add it as a checkpoint.
			if(isGoal){
				goalx = tmpx;
				goaly = tmpy;
				goalr = ftmp;
			}else{
				useCheckpoints = true;
				checkx.push(tmpx);
				checky.push(tmpy);
				checkr.push(ftmp);
			}
			
			// console.log("Circle added at " + tmpx + " , " + tmpy + " - r= " + ftmp + " checkpoints=" + useCheckpoints);
		}
		

		partstring[i] = partstring[i].replace(/-?[0-9]e-?[0-9]/g , (match, $1) => {//			replace exponents with their numeric equivalent 5e3 → 5000
			//		take the string aeb (5e-4), calculate it's equivalent a*10^b (0.0005), and round the answer to the 1000s place (0.000)
			return math.round(parseInt(match[0]) * math.pow(10 , parseInt(match.substring(2))) * 1000) / 1000;
		});
		
		// console.log(partstring[i]);
		
		//		remove unwanted markers and make all points in this line coma separated
		partstring[i] = partstring[i].substring(0 , partstring[i].indexOf('"'));//		cut fluff off the end of partstring[i]
		partstring[i] = partstring[i].replace(/-/g , ' -');//		replace - with _- so if points are listed 15-35 they will go to 15 -35 and can be split on the space
		partstring[i] = partstring[i].replace(/[MmLCcSsQqTtAaZz]/g , '');//		remove all path types. Everything will be treated as 'lineto'
		partstring[i] = partstring[i].replace(/h/g , ',h,');//		replace h with ,h, so h is read in as a point
		partstring[i] = partstring[i].replace(/l/g , ',');//		replace l with , so when l is erased, the points it was between do not become one number
		partstring[i] = partstring[i].replace(/  /g , ',');//		if it was formatted 15 -35 already, the last operation will take it to 15  -35 so this will remove the redundant space
		partstring[i] = partstring[i].replace(/ /g , ',');//		replace all single spaces with , so partstring[i] is csv
		partstring[i] = partstring[i].replace(/,,/g , ',');//		#,-# will be turned into #,,-#		This fixes that
			
		//		if the first character is , remove it
		if(partstring[i][0] == ',')
			partstring[i] = partstring[i].substring(1);
		
		//		all points should now be separated by a , or a space
		
		//		make ministring a list of X and Y coordinates
		ministring = partstring[i].split(',');

		//		the first point cannot be added in relative coordinates so add it here
		allGroundPointsX.push( parseFloat(ministring[0])/5 - dx);
		allGroundPointsY.push( parseFloat(ministring[1])/5 - dy);
		// console.log("Input " + partstring[i]);
		
		if(allGroundBreaks.length > 0)
			allGroundBreaks[allGroundBreaks.length] = false;
		
		for(k = 2 ; k < ministring.length ; k += 2){
//			console.log(ministring[k] + " _ " + ministring[k+1]);
			if(ministring[k][0] == 'h'){//		h means this is a horizontal line and this point's x is the same as the last
				allGroundPointsX.push( parseFloat(ministring[k+1])/5 + (absolute? -dx : allGroundPointsX[allGroundPointsX.length-1]));//		if coordinates are relative to the last point, add the last point's x to this one
				allGroundPointsY.push( allGroundPointsY[allGroundPointsY.length-1]);
			}else{
				allGroundPointsX.push( parseFloat(ministring[k])/5 + (absolute? -dx : allGroundPointsX[allGroundPointsX.length-1]));//		if coordinates are relative to the last point, add the last point's x to this one
				allGroundPointsY.push( (absolute? dy : allGroundPointsY[allGroundPointsY.length-1]) + parseFloat(ministring[k+1])/5);
			}			//console.log('x = '+allGroundPointsX[allGroundPointsX.length-2]);
			
			//		there should be no vertical lines. The physics engine can't handle them.
		
			allGroundBreaks.push(true);
			//console.log('y = '+allGroundPointsY[allGroundPointsY.length-2]);
		}
		
		//		if using polar coordinates, translate all svg points to polar form
		if(usePolar){
			for(k = allGroundPointsX.length-1 ; k > -1 ; k--){
				theta = math.atan(allGroundPointsY[k]/allGroundPointsX[k]);
				if(allGroundPointsX[k] < 0){
					theta = Math.PI + theta;
				}else if(allGroundPointsY[k] < 0){
					theta = _piTimes2 + theta;
				}
				
				allGroundPointsY[k] = math.sqrt(allGroundPointsX[k]*allGroundPointsX[k] + allGroundPointsY[k]*allGroundPointsY[k])
				allGroundPointsX[k] = theta;
			}
		}
		//		change the last entry in this array to false so a line is not drawn between the end of one line and start of the next
	}
	if(useScreenLimit){
		updateScreenLockPoints();
	}
	
	// console.log(checkScreenx);
	// console.log(checkScreeny);
}






