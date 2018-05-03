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
			i++;

			console.log(loadedLevel[i]);
			if(loadedLevel[i] == "useBlanks"){
				useFillBlanks = true;
				i++;
				substring = loadedLevel[i].split('_');//		sledder start position
				defaultEqu = loadedLevel[i];
				$("#dinput").text(defaultEqu);
			}else{
				defaultEqu = loadedLevel[i];
				$("#dinput").text(defaultEqu);
			}
			i++;

			console.log(loadedLevel[i]);
			if(loadedLevel[i] == "useTime"){
				useTime = true;
				i++;
			}else{
				useTime = false;
			}
			
			console.log(loadedLevel[i]);
			if(loadedLevel[i] == "useZ"){
				useZ = true;
			//	xyzc.style.display="block !important";
			//	xyz2c.style.display="block !important";
				setUpXYZ();
				i++;
			}else{
				useZ = false;
			//	xyzc.style.display="none !important";
			//	xyz2c.style.display="none !important";
			}
			
			console.log(loadedLevel[i] + " - End");
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
			gRectY = []
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
			loadCollidersFromTex();
			break;
	//		-----------------------------------------------------------------------		[   Piecewise Gapless   ]		-----------------------------------------------------------------------
		case "PW":
			break;
	}
	
		//		-----------------------------------------------------------------------		[   Text Input Field   ]		-----------------------------------------------------------------------
		//		https://jsfiddle.net/AbdiasSoftware/VWzTL/
	setUpInput();//		see EquationLine.js
	$("#dinput").text(defaultEqu);
	//		if a 3B1B animation is called for, set up the input for that
	setUpNumberLines();//		see 3B1BAnimations.js
//	animSteps = 
//	animLerps = 
}

function loadCollidersFromTex(){
	 //= "Levels/" + loadedLevel[i].substring(0 , loadedLevel[i].length-4) + "Colliders.tex";//		load "LevelName".tex
	console.log("Levels/" + loadedLevel[i].substring(0 , loadedLevel[i].length-4) + "Colliders.tex");
	var end = "";
	end.src = "Levels/" + loadedLevel[i].substring(0 , loadedLevel[i].length-4) + "Colliders.tex";
	//end = end.substring(end.indexOf("newrgbcolor"));
	alert("Loaded Level" + loadedLevel[i] + "\n" + end);
	//https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
	fetch('file.txt').then(response => response.text()).then(text => stmp=text);
	console.log("fetched\n" + stmp);
	//var read = new FileReader
	/*// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}*/
	
	var client = new XMLHttpRequest();
	client.open('GET', "Levels/" + loadedLevel[i].substring(0 , loadedLevel[i].length-4) + "Colliders.tex");
	client.onreadystatechange = function() {
	  alert("OUTPUT\n" + client.responseText);
	}
	client.send();
	//console.log(
}
