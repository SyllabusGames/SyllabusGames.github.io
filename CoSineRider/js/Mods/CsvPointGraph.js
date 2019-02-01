<<<<<<< HEAD
﻿/*
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

const csvurl = 'process.php';
const csvform = document.querySelector('form');

//		create load file button and hide
var csvFileSelector = document.createElement('input');
csvFileSelector.setAttribute('type' , 'file');
csvFileSelector.setAttribute('accept' , ".csv");
csvFileSelector.setAttribute('onchange' , "handleFiles(this.files)");
csvFileSelector.setAttribute('display' , "none");

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
	ctx.fillStyle = "#5050FF";
	ctx.strokeStyle="#5050FF";
	for(i = csvPointList.length-1 ; i > 1 ; i -= 2){
	//	ctx.fillText( '(' + (Math.round(dx*100)/100).toString() + ',' + (Math.round(dy*100)/100).toString() + ')', (dx - screenx)*screenScale + 5 , -(dy-screeny)*screenScale);
	
		//		draw dot on graph at coordinates above
		drawCircle(csvPointList[i-1] , csvPointList[i] , 4);
	}
=======
﻿/*
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

const csvurl = 'process.php';
const csvform = document.querySelector('form');

//		create load file button and hide
var csvFileSelector = document.createElement('input');
csvFileSelector.setAttribute('type' , 'file');
csvFileSelector.setAttribute('accept' , ".csv");
csvFileSelector.setAttribute('onchange' , "handleFiles(this.files)");
csvFileSelector.setAttribute('display' , "none");

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
	ctx.fillStyle = "#5050FF";
	ctx.strokeStyle="#5050FF";
	for(i = csvPointList.length-1 ; i > 1 ; i -= 2){
	//	ctx.fillText( '(' + (Math.round(dx*100)/100).toString() + ',' + (Math.round(dy*100)/100).toString() + ')', (dx - screenx)*screenScale + 5 , -(dy-screeny)*screenScale);
	
		//		draw dot on graph at coordinates above
		drawCircle(csvPointList[i-1] , csvPointList[i] , 4);
	}
>>>>>>> a3503f6d8084bec8645c5c94b584ec9e6b4120a9
}