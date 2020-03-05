/*
	Hit Insert to load a .csv file
	Only one may be graphed at a time
	The file must consist of only two collums of data where cloumb 1 is X values and cloumb 2 are the corrisponding Y values

*/

var csvInputString = `0,0
1,1`;
//		Acceleration -(x+1.53)/((x+0.44)^2+0.71)*2.05+3.45
//		Decleration	-(x/1.86+0.12)^2+2.77
//		Change in acceleration graphed by 512*(250x^2+765x+111)/(250x^2+220x+226)^2
//		Change in decceleration graphed by	-0.5781x-0.129

//		better change curves
	//	accelerate 
	//	decelerate 
var csvPointList = [];//		points are stored [x1,y1,x2,y2]
var csvpartstring;
var csvReader = new FileReader();

var initialized = false;

var loadCsvButton;//		button in the lower right corner (where the play/pause button usually is)

const csvurl = 'process.php';
const csvform = document.querySelector('form');

//		create load file button and hide
var csvFileSelector = document.createElement('input');
csvFileSelector.setAttribute('type' , 'file');
csvFileSelector.setAttribute('accept' , ".csv");
csvFileSelector.setAttribute('onchange' , "handleFiles(this.files)");
csvFileSelector.setAttribute('display' , "none");


/*
//		activate load file button when Insert is pressed
document.addEventListener("keydown", function(e){
	if(e.keyCode == 45){//		Insert
		e.preventDefault();//		don't type a space
		csvFileSelector.click();//		open file selector
	}
	if(e.keyCode == 13){//		Enter//		everage points' y values with neighbors
	//		average by moveing points to the average of it and its neightbor and deleting the final point that has noting to average with
	//		This averaging method is honest, but losing a point with every itteration can be problimatic
		/*for(i = 0 ; i < csvPointList.length-2 ; i += 2){
			csvPointList[i] = (csvPointList[i] + csvPointList[i+2])/2;//		set point [0]'s X position to be the average of points [0] and [1]'s Y
			csvPointList[i+1] = (csvPointList[i+1] + csvPointList[i+3])/2;//		set point [0]'s Y position to be the average of points [0] and [1]'s Y
		}
		csvPointList.pop();//		remove the last point in the array because it has nothing to average with
		csvPointList.pop();*/
		/*
	//		average each point with its two neightbors except for the ends which average with itself and its enighbor
	//		This can cause some strange behaviour at the end points
		var tmpPointList = csvPointList;
		csvPointList[1] = (tmpPointList[1] + tmpPointList[3]*3)/4;//		first point
		for(i = 3 ; i < csvPointList.length-2 ; i += 2){
			csvPointList[i] = (tmpPointList[i-2] + tmpPointList[i+2])/2;//		set current point's Y position to be the average of the Y position of the points on either side
		}
		csvPointList[tmpPointList.length-1] = (tmpPointList[tmpPointList.length-1] + tmpPointList[tmpPointList.length-3]*3)/4;//		last point
	}
});
*/
document.addEventListener("mousemove", function(e){
	if(initialized){
		if(localStorage.getItem("NoneTypedLoaded") == "True"){//		a non-game level is loaded.
			loadCsvButton.style.left = (screenWidth-65) + "px";
			loadCsvButton.style.top = (screenHeight-65) + "px";
			loadCsvButton.style.display = "block";//	Display the Load CSV button
		}else{
			loadCsvButton.style.display = "none";//		Hide the Load CSV button
		}
	
	}else{//		set up the button
		
		loadCsvButton = document.createElement("p");
		// mainInput.setAttribute("contentEditable" , "true");
		loadCsvButton.style = "position:absolute;left:0px;top:0px; z-index: 20";//		above everything except input field
		
		loadCsvButton.innerHTML = `<svg id="LoadCsvButton"; height="70" width="70" style="z-index: 991; position:absolute; left:0px; top:-16px;">
			<g transform="translate(10 10)">
				<rect x="0" y="0" width="50" height="50" ry="12" fill="none" stroke="#000000" stroke-width="6"/>
				<rect ry="11" height="46" width="46" y="2" x="2" class="button" onclick="csvFileSelector.click()" />
				
				<text class="unselectable" fill="#000000" font-family="Arial" font-size="19px" text-anchor="middle" text-align="center" style="font-weight:bold;">
					<tspan x="27" y="23">Load</tspan>
					<tspan x="25" y="41">CSV</tspan>
				</text>
			</g>
		</svg>`;
	
		document.body.appendChild(loadCsvButton);
		loadCsvButton.style.display = "none";//		Hide the Load CSV button
		
		initialized = true;
	}
});


	

//		read .csv, store in csvInputString, and run csvLoad()
function handleFiles(files){
	if(window.FileReader){
	
		var reader = new FileReader();
		// Read file into memory as UTF-8      
		reader.readAsText(files[0]);
		// Handle errors load
		reader.onload = loadHandler;
		reader.onerror = error;
	} else {
		alert('FileReader is not supported in this browser.');
	}
}

function loadHandler(event) {
	csvInputString = event.target.result;
	csvLoad();
}

function error(){
	alert("Can't read file !")
}
//		add csv loader


function csvLoad(){
	csvPointList = [];
	csvInputString = csvInputString.replace(/\n/g , ',');
	console.log(csvInputString);
	csvpartstring = csvInputString.split(',');
	for(i = 0 ; i < csvpartstring.length-1 ; i++){//		convert string array into point array
		csvPointList.push(parseFloat(csvpartstring[i]));
	//	console.log(csvpartstring[i] + " && " + csvPointList[i]);
	}
	//console.log(csvPointList);
	window.requestAnimationFrame(csvDraw);
}

function csvDraw(){
	window.requestAnimationFrame(csvDraw);
	if (paused)
		return;
	//ctx.font = "25px Arial";
	
	//		move play/pause button to lower right corner of screen
	loadCsvButton.style.left = (screenWidth-65) + "px";
	loadCsvButton.style.top = (screenHeight-65) + "px";
	
	ctx.lineWidth = 2;
	ctx.fillStyle = "#5050FF";
	ctx.strokeStyle="#5050FF";
	for(i = csvPointList.length-1 ; i > 1 ; i -= 2){
		//		draw dot on graph at coordinates above
		drawCircle(csvPointList[i-1] , csvPointList[i] , 4);
	}
}