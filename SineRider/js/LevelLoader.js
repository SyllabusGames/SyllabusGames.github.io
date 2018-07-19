//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
var loadedLevel;
var levelType = "";
var levelCode = "";//		Used by Goal (in Collidions.js) to save the current level as complete
var substring = "";
var levelMap;//		array of strings containing all levels' save/load codes
var mapIndex = 0;//	index of current level in levelMap

var useFillBlanks = false;//Give the player blanks to fill in instead of letting them write their own equation
var useTime = false;//		time is not just set to zero
var use2Equ = false;//		piecewise with 2 equations
var use3Equ = false;//		piecewise with 3 equations
var usePGaps = false;//		piecewise with gaps. When false, there are no gaps between where one equation ends and the next starts
var useZ = false;//			read Z as a variable and show a line for Z = -10 and Z = 10. Give the player a slider to shift Z.
var show3D = true;//		Show/Hide 3D view. If off, still show the Z slider and current value, just don't render the 3D view
var usePiecewise = false;
var piecSections = [10,25,50];
var piecSecCount = 3;
var usePolar = false;//		FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF



function loadLevel(){
	var filePath = '../Levels/SR001.txt'
	var request = new XMLHttpRequest();
	request.open('GET' , filePath , false);
	request.onreadystatechange = function (){
		if(request.readyState === 4){
			if(request.status === 200 || request.status == 0){
				var allText = request.responseText;
				alert(allText);
			}
		}
    }
	request.send(null);
	var fileArray = allText.split('\n');
	alert(fileArray[1]);
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
	loadBuiltInLevel();
}

function loadBuiltInLevel(){
	levelCode = levelMap[mapIndex];
	loadedLevel = localStorage.getItem(levelCode).split('\n');
	levelName = loadedLevel[0];
	levelType = loadedLevel[1];

	//		-----------------------------------------------------------------------		[   SineRider Clasic   ]		-----------------------------------------------------------------------
	switch(levelType){
		case "SR":
			i = 2;
			substring = loadedLevel[i].split(',');//		sledder start position
			defaultPosX = parseFloat(substring[0]);
			defaultPosY = parseFloat(substring[1]);
			apx = defaultPosX;
			apy = defaultPosY;
			i++;

			if(loadedLevel[i] == "useBlanks"){
				useFillBlanks = true;
				i++;
				substring = loadedLevel[i].split('_');//		sledder start position
				defaultEqu = loadedLevel[i];
				mainInput.innerHTML = defaultEqu;
			}else{
				defaultEqu = loadedLevel[i];
				mainInput.innerHTML = defaultEqu;
			}
			i++;

			if(loadedLevel[i] == "useTime"){
				useTime = true;
				i++;
			}else{
				useTime = false;
			}
			
			if(loadedLevel[i] == "useZ"){
				useZ = true;
				//		show the canvases showing the 3D render
				xyzc.style.display="block";
				xyz2c.style.display="block";
				setUpXYZ();
				i++;
			}else{
				useZ = false;
				//		hide the canvases showing the 3D render
				xyzc.style.display="none";
				xyz2c.style.display="none";
			//	xyzc.style.display="none !important";
			//	xyz2c.style.display="none !important";
			}
			
			substring = loadedLevel[i].split(',');//		camera track point
			trackPointx = parseFloat(substring[0]);
			trackPointy = parseFloat(substring[1]);
			i++;
			//		-----------------------------------------------------------------------		[   BACKGROUND AND COLLIDER SVG   ]		-----------------------------------------------------------------------
			background.src = "Levels/" + loadedLevel[i]+ ".svg";//		load background SVG
			loadCollidersFromSvg(localStorage.getItem(loadedLevel[i] + "Colliders"));//		load collider SVG

			/*var client = new XMLHttpRequest();
			client.open('GET', "Levels/" + loadedLevel[i].substring(0 , loadedLevel[i].length-4) + "Colliders.tex");
			client.onreadystatechange = function() {
				if(client.responseText.length > 0){
					loadCollidersFromTex(client.responseText);//		call loadCollidersFromTex() when the txt is loaded
					console.log(client.responseText);
				}
			}
			client.send();
			*/

			break;
	//		-----------------------------------------------------------------------		[   Piecewise Gapless   ]		-----------------------------------------------------------------------
		case "PW":
			break;
	}
	
		//		-----------------------------------------------------------------------		[   Text Input Field   ]		-----------------------------------------------------------------------
		//		https://jsfiddle.net/AbdiasSoftware/VWzTL/
	setUpInput();//		see EquationLine.js
	//		if a 3B1B animation is called for, set up the input for that
	setUpNumberLines();//		see 3B1BAnimations.js
	screenFollowSledder();//	move the screen to show the sledder and goal. See Sledder.js
		//		set default drag screen positioin so it doesn't jump when you start moving the screen
	dragScreenX = screenx + screenWidth/2/screenScale;
	dragScreenY = -screeny + screenHeight/2/screenScale;
	dragScreenScale = screenScale;
	if(usePiecewise)
		setUpPiecewise();
	checkInputFields();
}

function setUpPiecewise(){
	if(piecInput.length < piecSecCount){//		more equations used than inputs for equations
		lyy =  Math.round(screenWidth * 0.05);//		left property
		ftmp = Math.round(screenHeight * 0.85);//		top
		ryy = Math.round(screenWidth * 0.9);//			width
		for(i = piecInput.length ; i < piecSecCount ; i++){
			piecInput.push(document.createElement("p"));
			piecInput[i].setAttribute("id" , "input" + String(i));
//			console.log("input" + String(i));
			piecInput[i].setAttribute("contentEditable" , "true");
			piecInput[i].style = "position:absolute;left:"+lyy+"px;top:"+Math.round(ftmp-70*i)+"px;width:"+(ryy-15*i)+"px;font-size:50px; font-family:'Arial'; background-color: #FFFFFF; border:1px solid #AAAAAA;";
			piecInput[i].innerHTML = "-x+00000+5"
			document.body.appendChild(piecInput[i]);
//			console.log("added input");
		}
	}
	checkInputFields(0);
	checkInputFields(1);
	checkInputFields(2);
}

function loadCollidersFromSvg(sss){
	//		-----------------------------------------------------------------------		[   Import .svg to single array   ]		-----------------------------------------------------------------------
	allGroundPointsX = new Array();
	allGroundPointsY = new Array();
	allGroundBreaks = new Array();
	gCircleX = new Array();
	gCircleY = new Array();
	gCircleR = new Array();
	var absolute = false;
//		get the translation of the eniter image
	substring = sss.substring(sss.indexOf("translate(") + 10);
//	console.log(substring)
	substring = substring.substring(0 , substring.indexOf(")") );
	ministring = substring.split(" ");
	dx = 200 + parseFloat(ministring[0])/5;
	dy = 200 - parseFloat(ministring[1])/5;
	
//	console.log(substring + "  dx = " + ministring[0] + " dy= " + ministring[1]);
	
	substring = sss.split('<path');//		each substring contains one path
	var ministring = "";//		each ministring contains one string of points
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