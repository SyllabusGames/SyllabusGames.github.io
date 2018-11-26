var csvInputString = `0,0
1,1`;
//		Acceleration -1/(x/6+0.24)+4.1	or	x/(x*0.3+0.42)*1+0.1 or sin(x^0.9/1.61)*2.49+(x-1.1)^2/11.91
//		Decleration	-(x/1.86+0.12)^2+2.77
//		Change in acceleration graphed by 
//		Change in decceleration graphed by	-0.5781x-0.129

//		better change curves
	//	accelerate 
	//	decelerate 
var csvPointList = [];//		points are stored [x1,y1,x2,y2]
var csvSubstring;
var csvReader = new FileReader();

const csvurl = 'process.php';
const csvform = document.querySelector('form');

//		create load file button and hide
var fileSelector = document.createElement('input');
fileSelector.setAttribute('type' , 'file');
fileSelector.setAttribute('accept' , ".csv");
fileSelector.setAttribute('onchange' , "handleFiles(this.files)");
fileSelector.setAttribute('display' , "none");

//		activate load file button when Insert is pressed
document.addEventListener("keydown", function(e){
	if(e.keyCode == 45){//		Insert
	console.log("Load?");
		fileSelector.click();//		open file selector
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

		csvInputString = getAsText();
	} else {
		alert('FileReader is not supported in this browser.');
	}
}

function loadHandler(event) {
	csvInputString = event.target.result;
	csvLoad();
}

function error(){
	alert("Canno't read file !")
}
//		add csv loader


function csvLoad(){
	csvPointList = [];
	csvInputString = csvInputString.replace(/\n/g , ',');
	console.log(csvInputString);
	csvSubstring = csvInputString.split(',');
	for(i = 0 ; i < csvSubstring.length-1 ; i++){//		convert string array into point array
		csvPointList.push(parseFloat(csvSubstring[i]));
	//	console.log(csvSubstring[i] + " && " + csvPointList[i]);
	}
	//console.log(csvPointList);
	window.requestAnimationFrame(csvDraw);
}

function csvDraw(){
	window.requestAnimationFrame(csvDraw);
	if (paused)
		return;
	//ctx.font = "25px Arial";
	ctx.fillStyle = "#5050FF";
	ctx.strokeStyle="#5050FF";
	for(i = csvPointList.length-1 ; i > 1 ; i -= 2){
	//	ctx.fillText( '(' + (Math.round(dx*100)/100).toString() + ',' + (Math.round(dy*100)/100).toString() + ')', (dx - screenx)*screenScale + 5 , -(dy-screeny)*screenScale);
	
		//		draw dot on graph at coordinates above
		ctx.beginPath();
		ctx.arc( (csvPointList[i-1] - screenx)*screenScale , -(csvPointList[i]-screeny)*screenScale , 2.5 , 0 , endAngle);
		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}