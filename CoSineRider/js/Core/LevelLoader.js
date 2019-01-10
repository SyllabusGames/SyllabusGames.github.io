//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var loadedLevel;
var levelName = "No level loaded";
var levelType = "";
var levelCode = "";//		Used by Goal (in Collidions.js) to save the current level as complete
var substring = "";
var levelMap;//		array of strings containing all levels' save/load codes
var mapIndex = 0;//	index of current level in levelMap

var useGuide = false;//		show guide line.	Guide variables declared in EquationLine.js
var useTime = false;//		time is not just set to zero
//var usePGaps = false;//		piecewise with gaps. When false, there are no gaps between where one equation ends and the next starts
var useZ = false;//			read Z as a variable and show a line for Z = -10 and Z = 10. Give the player a slider to shift Z.
var useNone = false;//		This is not a game level so the sledder, background, and colliders will not be loaded
var useRender = false;
var useDerivative = false;
var useIntegral = false;
var usePolar = false;
var show3D = false;//		Show/Hide 3D view. If off, still show the Z slider and current value, just don't render the 3D view

var usePiecewise = false;
var useProxyVar = false;
var useProxyFunction = false;
var useDrag = false;
var useFillBlanks = false;//Give the player blanks to fill in instead of letting them write their own equation
var useCutscene = false;//	level is a cutscene

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
	substring = loadedLevel[lineNum].split(',');
	defaultPosX = parseFloat(substring[0]);
	defaultPosY = parseFloat(substring[1]);
	apx = defaultPosX;
	pxapx = defaultPosX;
	pxLastx = defaultPosX;
	apy = defaultPosY;
	pxapy = defaultPosY;
	pxLasty = defaultPosY;
	lineNum++;

	//		last level used multiple input fields but this one doesn't so hide all inputs
	if((usePiecewise || useProxyVar || useProxyFunction) && (levelType != "PW" || levelType != "PV" || levelType != "PF")){
		for(k = 0 ; k < 5 ; k++){
			pieEquInput[k].style.display = "none";
			pieLeftInput[k].style.display = "none";
			pieRightInput[k].style.display = "none";
			pieLimitsText[k].style.display = "none";
		}
	}
	//		some levels may change the background color of the main input, fix it here
	mainInput.style.backgroundColor = _inputColor;

	
	//console.log(useFillBlanks + " - " + levelType);
	//		last level was fill in the blank but this one isn't so hide all inputs
	if (useFillBlanks && levelType != "BL"){
		console.log("No longer blank");
		for(i = 0 ; i < blankDefaultVar.length ; i++){
			blankEquInput[i].style.display = "none";
		}
		for(i = 1 ; i < blankEquGaps.length-1 ; i++){
			blankEquText[i].style.display = "none";
		}
	}

	usePiecewise = false;
	useProxyVar = false;
	useProxyFunction = false;
	useDrag = false;
	useFillBlanks = false;
	useCutscene = false;
	
	useGuide = false;
	useTime = false;
	useZ = false;
	useNone = false;
	useDerivative = false;
	// useIntegral = false;

	//		-----------------------------------------------------------------------		[   Load Default Eqiations   ]		-----------------------------------------------------------------------
	switch(levelType){
		//		-----------------------------------------------------------------------		[   SineRider Clasic   ]		-----------------------------------------------------------------------
		case "SR":
		//		"LV1: Using Time\nSR\n0,0\nsin(x-8*t)+(x-12)^2/300-1\nuseTime\nuseZ\n44,4\nCave\nEnd"
			defaultEqu = loadedLevel[lineNum];
			mainInput.innerHTML = defaultEqu;
			mainInput.style.display = "block";
			activeInput = mainInput;//		set the active input field to the only input field
			lineNum++;
			typeInitialize();
			break;
		//		-----------------------------------------------------------------------		[   Piecewise Typed Input   ]		-----------------------------------------------------------------------
		case "PW":
		//		LV2: Piecwise\nPW\n0,0\n3\n-999,20,-x/2+t*1.5\n20,60,t*1.5-10\n60,200,x/10-16+t*1.5\n91,17\nTower\nEnd"
			usePiecewise = true;

			pieEquInputsUsed = parseInt(loadedLevel[lineNum]);//		get total number of input fields used
			pieInitialize();//		see InputPiecewise.js
			lineNum++;

			for(k = 0 ; k < pieEquInputsUsed ; k++){//		for each input field excluding the main input [0]
		//		console.log(loadedLevel[k+lineNum]);
				pieEquInput[k].style.display = "block";
				pieLeftInput[k].style.display = "block";
				pieRightInput[k].style.display = "block";
				pieLimitsText[k].style.display = "block";


				substring = loadedLevel[k+lineNum].split(',');//		equations are stored as LeftLimit,RightLimit,Equation

				pieLeftLimit[k] = parseInt(substring[0]);
				pieLeftInput[k].innerHTML = substring[0];
				if(substring[0].indexOf("t") != -1){//		if limit contains t, store it as an equation
					equInput = math.parse(substring[0] , {t: 0});
					pieLeftInputCompiled[k] = equInput.compile();
				}

				pieRightLimit[k] = parseInt(substring[1]);
				pieRightInput[k].innerHTML = substring[1];
				if(substring[1].indexOf("t") != -1){//		if limit contains t, store it as an equation
					equInput = math.parse(substring[1] , {t: 0});
					pieRightInputCompiled[k] = equInput.compile();
				}

				pieEquInput[k].innerHTML = substring[2];
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
			useProxyVar = true;

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
			pieEquInputsUsed = 1;//		set pieEquInputsUsed to the index of the last (greatest) input field useDrag
			
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
			useProxyFunction = true;

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
			pieEquInputsUsed = 1;//		set pieEquInputsUsed to the index of the last (greatest) input field useDrag
			
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
			useDrag = true;
		//			"LV1: Drag Points\nRD\n0,0\n_*x+_\n2,v,1,1,1\n44,4\nCave\nEnd"
			//		load like a standard typed input level
			equRaw = loadedLevel[lineNum];
			dragEquGaps = equRaw.split("_");
			lineNum++;

			//		now load in the controlls for draging points for each _ in the equation
			for(i = 0 ; i < dragEquGaps.length-1 ; i++){
				substring = loadedLevel[lineNum].split(',');//		data is stored as default value,v/h,x,y,scale
				dragVar.push(parseFloat(substring[0]));//		default value
				dragDirection.push(substring[1]);
				dragDefaultx.push(parseFloat(substring[2]));
				dragx.push(parseFloat(substring[2]));
				dragDefaulty.push(parseFloat(substring[3]));
				dragy.push(parseFloat(substring[3]));
				dragDependent0.push(parseInt(substring[4]));
				dragDependent1.push(parseInt(substring[5]));
				dragDependent2.push(parseInt(substring[6]));
				lineNum++;
			}
			dragInitialize();
			break;
		//		-----------------------------------------------------------------------		[   Fill In The Blank   ]		-----------------------------------------------------------------------
		case "BL":
			useFillBlanks = true;
			//		load like a standard typed input level
			equRaw = loadedLevel[lineNum];
			blankEquGaps = equRaw.split("_");
			lineNum++;
			blankDefaultVar = loadedLevel[lineNum].split(',');//		load all default values
			lineNum++;
			blankInitialize();
			break;
		//		-----------------------------------------------------------------------		[   Cutscene   ]		-----------------------------------------------------------------------
		case "CU":
			useCutscene = true;
			//		load like a standard typed input level
			cutInitialize(loadedLevel[lineNum]);
			lineNum++;
			break;
	}
	
	
	//		-----------------------------------------------------------------------		[   Optional Modes   ]		-----------------------------------------------------------------------

	//		Guide Equation
	if(loadedLevel[lineNum].substring(0,2) == "y="){
		useGuide = true;
		scope = {x: 0 , t: 0};
		guideInput = math.parse(loadedLevel[lineNum].substring(2) , scope);
		guideCompiled = guideInput.compile();
		lineNum++;
	}

	//		UseTime
	if(loadedLevel[lineNum] == "useTime"){
		useTime = true;
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
	
	//		UseIntegral (graph the integral of the equation entered instead of the equation itself)
	if(loadedLevel[lineNum] == "useIntegral"){
		useIntegral = true;
		lineNum++;
	}
	
	//	----------------------------------		[   camera track point   ]		----------------------------------
	substring = loadedLevel[lineNum].split(',');//		camera track point
	trackPointx = parseFloat(substring[0]);
	trackPointy = parseFloat(substring[1]);
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
		//		https://jsfiddle.net/AbdiasSoftware/VWzTL/
	/*if(usePiecewise){
	}else if(useProxyVar){
		
	}else if(useDrag){
		
	}else if(useFillBlanks){
		blankInitialize();
	}else{
		typeInitialize();//		see InputTyped.js
	}*/

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

	

function loadCollidersFromSvg(sss){
	//		-----------------------------------------------------------------------		[   Import .svg to single array   ]		-----------------------------------------------------------------------
	allGroundPointsX = [];//new Array();
	allGroundPointsY = [];//new Array();
	allGroundBreaks = [];//new Array();
	gCircleX = [];//new Array();
	gCircleY = [];//new Array();
	gCircleR = [];//new Array();
	var absolute = false;
//		get the translation of the eniter image
	substring = sss.substring(sss.indexOf("translate(") + 10);
//	console.log(substring)
	substring = substring.substring(0 , substring.indexOf(")") );
	var ministring = substring.split(" ");//		each ministring contains one string of points
	dx = 200 + parseFloat(ministring[0])/5;
	dy = 200 - parseFloat(ministring[1])/5;
	
//	console.log(substring + "  dx = " + ministring[0] + " dy= " + ministring[1]);
	
	substring = sss.split('<path');//		each substring contains one path
	//		loop through each line, through each set of points, then split X and Y on the ,
	for(i = 1 ; i < substring.length  ; i++){//		i=1 because the 0ith entry is just the file header information
//		console.log(substring[i]);

		substring[i] = substring[i].substring(3+substring[i].search(/d="m/i));//		cut fluff off the start of substring[i]
		absolute = (substring[i][0] == 'M');
		
		//		check for goal (circle) in this path's substring
		k = substring[i].indexOf("<circle");
		if(k != -1){//		if a circle is in this substring
			ministring = substring[i].substring(k);
			
			k = ministring.indexOf('cx="') + 4;
			ministring = ministring.substring(k);//		cut ministring to start with circle center.x
			gCircleX.push(parseFloat(ministring.substring(0 , ministring.indexOf('"')))/5 - dx);

//			console.log("Circle added " + ministring + " - " + gCircleX[gCircleX.length-1]);
			
			k = ministring.indexOf('cy="') + 4;
			ministring = ministring.substring(k);//		cut ministring to start with circle center.x
			gCircleY.push(dy - parseFloat(ministring.substring(0 , ministring.indexOf('"')))/5);

//			console.log("Circle added " + ministring + " - " + gCircleY[gCircleY.length-1]);
			
			k = ministring.indexOf('r="') + 3;
			ministring = ministring.substring(k);//		cut ministring to start with circle center.x
			gCircleR.push(parseFloat(ministring.substring(0 , ministring.indexOf('"')))/5);
			
//			console.log("Circle added " + ministring + " - " + gCircleR[gCircleR.length-1]);
		}
		
		//		remove unwanted markers and make all points in this line coma seperated
		substring[i] = substring[i].substring(0 , substring[i].indexOf('"'));//		cut fluff off the end of substring[i]
		substring[i] = substring[i].replace(/-/g , ' -');//		replace - with _- so if points are listed 15-35 they will go to 15 -35 and can be split on the space
		substring[i] = substring[i].replace(/[MmLCcSsQqTtAaZz]/g , '');//		remove all path types. Everything will be treated as 'lineto'
		substring[i] = substring[i].replace(/h/g , ',h,');//		replace h with ,h, so h is read in as a point
		substring[i] = substring[i].replace(/l/g , ',');//		replace l with , so when l is erased, the points it was between do not become one number
		substring[i] = substring[i].replace(/  /g , ',');//		if it was formatted 15 -35 already, the last opperation will take it to 15  -35 so this will remove the redundant space
		substring[i] = substring[i].replace(/ /g , ',');//		replace all single spaces with , so substring[i] is csv
		substring[i] = substring[i].replace(/,,/g , ',');//		#,-# will be turned into #,,-#		This fixes that*/
		if(substring[i][0] == ',')
			substring[i] = substring[i].substring(1);//		if the first character is , remove it
		//		all points should now be sepperated by a , or a space
		ministring = substring[i].split(',');//		make ministring a list of X and Y coordinates

		allGroundPointsX.push( parseFloat(ministring[0])/5 - dx);
		allGroundPointsY.push( parseFloat(ministring[1])/5 - dy);
//		console.log("Input " + substring[i]);
		if(allGroundBreaks.length > 0)
			allGroundBreaks[allGroundBreaks.length] = false;
		for(k = 2 ; k < ministring.length ; k += 2){
//			console.log(ministring[k] + " _ " + ministring[k+1]);
			if(ministring[k][0] == 'h'){//		h means this is a horizontal line and this point's x is the same as the last
				allGroundPointsX.push( parseFloat(ministring[k+1])/5 + (absolute? - dx : allGroundPointsX[allGroundPointsX.length-1]));//		if coordinates are relative to the last point, add the last point's x to this one
				allGroundPointsY.push( allGroundPointsY[allGroundPointsY.length-1]);
			}else{
				allGroundPointsX.push( parseFloat(ministring[k])/5 + (absolute? -dx : allGroundPointsX[allGroundPointsX.length-1]));//		if coordinates are relative to the last point, add the last point's x to this one
				allGroundPointsY.push( parseFloat(ministring[k+1])/5 + (absolute? - dy : allGroundPointsY[allGroundPointsY.length-1]));
			}			//console.log('x = '+allGroundPointsX[allGroundPointsX.length-2]);
		
			allGroundBreaks.push(true);
			//console.log('y = '+allGroundPointsY[allGroundPointsY.length-2]);
		}
		//		change the last entry in this array to false so a line is not drawn between the end of one line and start of the next
	}
}