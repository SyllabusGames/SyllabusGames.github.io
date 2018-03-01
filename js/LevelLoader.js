var loadedLevel;
var levelType = "";
var levelCode = "";//		Used by Goal (in Collidions.js) to save the current level as complete
var substring;
var levelMap;//		array of strings containing all levels' save/load codes
var mapIndex = 0;//	index of current level in levelMap

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
			substring = loadedLevel[2].split(',');//		sledder start position
			defaultPosX = parseFloat(substring[0]);
			defaultPosY = parseFloat(substring[1]);
			defaultEqu = loadedLevel[3];
			//		-----------------------------------------------------------------------		[   GOALS   ]		-----------------------------------------------------------------------
			//		blank out existing goal colliders
			gCircleX = [];
			gCircleY = [];
			gCircleR = []
			
			gRectX = [];
			gRectY = []
			gRectSideX = [];
			gRectSideY = [];
			i = 5;
			substring = loadedLevel[5].split(',');//		load in first goal collider
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
				substring = loadedLevel[i].split(',');//		load in first goal collider
			}
			break;
	//		-----------------------------------------------------------------------		[   Piecewise Gapless   ]		-----------------------------------------------------------------------
		case "PW":
			break;
	}
}