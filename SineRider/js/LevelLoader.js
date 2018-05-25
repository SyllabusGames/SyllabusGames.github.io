var loadedLevel;
var levelType = "";
var levelCode = "";//		Used by Goal (in Collidions.js) to save the current level as complete
var substring;
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
			i+=2;//		line 5 was the word Goal
			//		-----------------------------------------------------------------------		[   GOALS   ]		-----------------------------------------------------------------------
			//		blank out existing goal colliders
			gCircleX = [];
			gCircleY = [];
			gCircleR = []
			
			gRectX = [];
			gRectY = [];
			gRectSideX = [];
			gRectSideY = [];
			substring = loadedLevel[i].split(',');//		load in first goal collider
			while(substring.length > 1){//		reading in text will make this false (text contains no ,)
				if(substring.length = 3){//		circle goal
					gCircleX.push(parseFloat(substring[0]));
					gCircleY.push(parseFloat(substring[1]));
					gCircleR.push(parseFloat(substring[2]));
				}else{//			rectangle goal
					gRectX.push(parseFloat(substring[0]));
					gRectY.push(parseFloat(substring[1]));
					gRectSideX.push(parseFloat(substring[2]));
					gRectSideY.push(parseFloat(substring[3]));
				}
				i++;
				substring = loadedLevel[i].split(',');//		load in first goal collider
			}
			i++;//		the current line should be "Resets"
			//		-----------------------------------------------------------------------		[   RESETS   ]		-----------------------------------------------------------------------
			rCircleX = [];
			rCircleY = [];
			rCircleR = [];
			rRectX = [];
			rRectY = [];
			rRecSideX = [];
			rRecSideY = [];
			substring = loadedLevel[i].split(',');//		load in first goal collider
			while(substring.length > 1){//		reading in text will make this false (text contains no ,)
				if(substring.length = 3){//		circle goal
					rCircleX.push(parseFloat(substring[0]));
					rCircleY.push(parseFloat(substring[1]));
					rCircleR.push(parseFloat(substring[2]));
				}else{//			rectangle goal
					rRectX.push(parseFloat(substring[0]));
					rRectY.push(parseFloat(substring[1]));
					rRectSideX.push(parseFloat(substring[2]));
					rRectSideY.push(parseFloat(substring[3]));
				}
				i++;
				substring = loadedLevel[i].split(',');//		load in next goal collider
			}
			background.src = "Levels/" + loadedLevel[i];

			//		request txt file of level colliders
			//		load internal .txt
			//loadCollidersFromTex(localStorage.getItem("SR001colliders"));
			//		load external .txt
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
	if(usePiecewise)
		setUpPiecewise();
	checkInputFields();
	loadCollidersFromSvg(localStorage.getItem("SVGcolliders"));
//	loadCollidersFromSvg(localStorage.getItem("SvgExported"));
//	animSteps = 
//	animLerps = 
}

function setUpPiecewise(){
	if(piecInput.length < piecSecCount){//		more equations used than inputs for equations
		lyy =  Math.round(screenWidth * 0.05);//		left property
		ftmp = Math.round(screenHeight * 0.85);//		top
		ryy = Math.round(screenWidth * 0.9);//			width
		for(i = piecInput.length ; i < piecSecCount ; i++){
			piecInput.push(document.createElement("p"));
			piecInput[i].setAttribute("id" , "input" + String(i));
			console.log("input" + String(i));
			piecInput[i].setAttribute("contentEditable" , "true");
			piecInput[i].style = "position:absolute;left:"+lyy+"px;top:"+Math.round(ftmp-70*i)+"px;width:"+(ryy-15*i)+"px;font-size:50px; font-family:'Arial'; background-color: #FFFFFF; border:1px solid #AAAAAA;";
			piecInput[i].innerHTML = "-x+00000+5"
			document.body.appendChild(piecInput[i]);
			console.log("added input");
		}
	}
	checkInputFields(0);
	checkInputFields(1);
	checkInputFields(2);
}

function loadCollidersFromTex(sss){
	 //= "Levels/" + loadedLevel[i].substring(0 , loadedLevel[i].length-4) + "Colliders.tex";//		load "LevelName".tex
	 /*
	console.log("Levels/" + loadedLevel[i].substring(0 , loadedLevel[i].length-4) + "Colliders.tex");
	var end = "";
	end.src = "Levels/" + loadedLevel[i].substring(0 , loadedLevel[i].length-4) + "Colliders.tex";
	//end = end.substring(end.indexOf("newrgbcolor"));
	alert("Loaded Level" + loadedLevel[i] + "\n" + end);
	//https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
	fetch('file.txt').then(response => response.text()).then(text => console.log(text));
	console.log("fetched\n" + stmp);*/
	//var read = new FileReader
	/*// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}*/

	//		create array of arrays so collision points can be stored in the array based on their position. (-200 < x < -180, point is stored in groundPoints[0])
	/*
	//		-----------------------------------------------------------------------		[   Import to array[20]   ]		-----------------------------------------------------------------------

	groundPointsX = new Array(20);
	groundPointsY = new Array(20);
	ceilingPointsX = new Array(20);
	ceilingPointsY = new Array(20);
	for(i = 0 ; i < 20 ; i++){
		groundPointsX[i] = new Array();
		groundPointsY[i] = new Array();
		ceilingPointsX[i] = new Array();
		ceilingPointsY[i] = new Array();
	}


	substring = sss.split("ewpath");
	var ministring;
	var microstring;
	var k = 0;
	//		loop through each line, through each set of points, then split X and Y on the ,
	for(i = substring.length-1 ; i > 0  ; i--){//		>0 because the 0ith entry is just the file header information
	console.log("\n\n\n" + substring[i]);
		ministring = substring[i].split("(");
		for(k = ministring.length-1 ; k > 0 ; k--){//		>0 because ministring[0] is "moveto"
			microstring = ministring[k].split(",");
			//		microstring[0] = "#"		microstring[1] = "#)\n\moveto"		# is the X or Y coordinate numeber
			ftmp = (parseFloat(microstring[0]) - 1000)/5;
			fftmp = Math.max( Math.min(Math.round((ftmp+200)/20) , 19) , 0);//		get the index of where this point should be places and clamp it from 0 to 19
			console.log(ftmp + " - " + fftmp);
			groundPointsX[fftmp].push(ftmp);//		add the x coordiante to the correct group

			ftmp = (-parseFloat(microstring[1].substring(0 , microstring[1].indexOf(')'))) + 1000)/5;
			groundPointsY[fftmp].push(ftmp);//		add the Y coordiante to the same group
		//	console.log(groundPointsX[fftmp][groundPointsX[fftmp].length-1] + " , " + groundPointsY[fftmp][groundPointsY[fftmp].length-1]);
		}
	}
	stmp = sss.substring(sss.indexOf("new"));
	//alert(sss.indexOf("new") + "Final"+stmp);
	*/
	
	//		-----------------------------------------------------------------------		[   Import .tex to single array   ]		-----------------------------------------------------------------------
	allGroundPointsX = new Array();
	allGroundPointsY = new Array();
	allGroundBreaks = new Array();

	substring = sss.split("ewpath");
	var ministring;
	var microstring;
	var k = 0;
	//		loop through each line, through each set of points, then split X and Y on the ,
	for(i = substring.length-1 ; i > 0  ; i--){//		>0 because the 0ith entry is just the file header information
		ministring = substring[i].split("(");
		for(k = ministring.length-1 ; k > 0 ; k--){//		>0 because ministring[0] is "moveto"
			microstring = ministring[k].split(",");
			//		microstring[0] = "#"		microstring[1] = "#)\n\moveto"		# is the X or Y coordinate numeber
			ftmp = (parseFloat(microstring[0]) - 1000)/5;
			allGroundPointsX.push(ftmp);//		add the x coordiante to the correct group

			ftmp = (-parseFloat(microstring[1].substring(0 , microstring[1].indexOf(')'))) + 1000)/5;
			allGroundPointsY.push(ftmp);//		add the Y coordiante to the same group
			allGroundBreaks.push(true);
		}
		//		change the last entry in this array to false so a line is not drawn between the end of one line and start of the next
		allGroundBreaks[allGroundBreaks.length-1] = false;
	}
	//stmp = sss.substring(sss.indexOf("new"));
	//alert(sss.indexOf("new") + "Final"+stmp);
}

function loadCollidersFromSvg(sss){
	//		-----------------------------------------------------------------------		[   Import .tex to single array   ]		-----------------------------------------------------------------------
	allGroundPointsX = new Array();
	allGroundPointsY = new Array();
	allGroundBreaks = new Array();
	var absolute = false;

	substring = sss.split('<path');//		each substring contains one path
	var ministring = "";//		each ministring contains one string of points
	var k = 0;
	var color = "#000000";
	//		loop through each line, through each set of points, then split X and Y on the ,
	//		loop forward so if stroke color is left the same between paths, it will inherit the correct color
	for(i = 1 ; i < substring.length  ; i++){//		i=1 because the 0ith entry is just the file header information
		k = substring.indexOf("stroke:");
		if(k != null)//		if the stroke color changes, get new color; otherwise, leave it as the last line's color.
			color = substring[i].substring(k , 7);

		substring[i] = substring[i].substring(3+substring[i].search(/d="m/i));//		cut fluff off the start of substring[i]
		absolute = (substring[i][0] == 'M');

		substring[i] = substring[i].substring(0 , substring[i].indexOf('"'));//		cut fluff off the end of substring[i]
		substring[i] = substring[i].replace(/-/g , ' -');//		replace - with _- so if points are listed 15-35 they will go to 15 -35 and can be split on the space
		substring[i] = substring[i].replace(/[MmLlHhVvCcSsQqTtAaZz]/g , '');//		remove all path types. Everything will be treated as 'lineto'
		substring[i] = substring[i].replace(/  /g , ',');//		if it was formatted 15 -35 already, the last opperation will take it to 15  -35 so this will remove the redundant space
		substring[i] = substring[i].replace(/ /g , ',');//		replace all single spaces with , so substring[i] is csv
		substring[i] = substring[i].replace(/,,/g , ',');//		#,-# will be turned into #,,-#		This fixes that
		if(substring[i][0] == ',')		
			substring[i] = substring[i].substring(1);//		if the first character is , remove it
		//		all points should now be sepperated by a , or a space
		ministring = substring[i].split(',');//		make ministring a list of X and Y coordinates

		allGroundPointsX.push( (parseFloat(ministring[0]) - 1000)/5);
		allGroundPointsY.push( parseFloat(ministring[1])/5 - 10);
		//console.log(substring[i]);
		if(allGroundBreaks.length > 0)
			allGroundBreaks[allGroundBreaks.length] = false;
		for(k = 2 ; k < ministring.length ; k += 2){
			allGroundPointsX.push( parseFloat(ministring[k])/5 + (absolute? -200 : allGroundPointsX[allGroundPointsX.length-1]));//		if coordinates are relative to the last point, add the last point's x to this one
			//console.log('x = '+allGroundPointsX[allGroundPointsX.length-2]);

			allGroundPointsY.push( parseFloat(ministring[k+1])/5 + (absolute? -10 : allGroundPointsY[allGroundPointsY.length-1]));
			allGroundBreaks.push(true);
			//console.log('y = '+allGroundPointsY[allGroundPointsY.length-2]);
		}
		//		change the last entry in this array to false so a line is not drawn between the end of one line and start of the next
	}
}