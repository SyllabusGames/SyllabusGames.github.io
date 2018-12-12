
//		set by LevelLoader.js
var cutObject;
var cutSvgObject;
var ajax;
var cutCurrentPanel = 0;
//	----------------------------------		[   Set up Drag Level   ]		----------------------------------
function cutInitialize(){//		called from LevelLoader.js
	cutCurrentPanel = 0;

	ajax = new XMLHttpRequest();
	ajax.open("GET", "https://syllabusgames.github.io/CoSineRider/Cutscenes/Cutscene1.svg", true);
	ajax.send();
	ajax.onload = function(e) {
		var cutObject = document.createElement("div");
		document.body.appendChild(cutObject);
		cutObject.innerHTML = ajax.responseText;
	//	console.log(cutObject);
	
		//		set comic's position to absolute and place the upper right corner at 0,0
		cutObject.style = "position: absolute; left:0px; top:0px; margin: 0px 0px 0px 0px";
		for(i = cutObject.childNodes.length-1 ; i > -1 ; i--){
			if(cutObject.childNodes[i].toString() == "[object SVGSVGElement]"){//		find the child of cutObject that actually contains the .svg information
				cutSvgObject = cutObject.childNodes[i];
				break;
			}
		}
		//console.log(cutObject);

		//		set the .svg width to the screen size
		cutSvgObject.setAttribute("width" , screenWidth + "px");

		//		hide all but the first panel
		if( document.getElementById('1Panel') != null)
			document.getElementById('1Panel').style.display = "none";
		if( document.getElementById('2Panel') != null)
			document.getElementById('2Panel').style.display = "none";
		if( document.getElementById('3Panel') != null)
			document.getElementById('3Panel').style.display = "none";
		if( document.getElementById('4Panel') != null)
			document.getElementById('4Panel').style.display = "none";
		if( document.getElementById('5Panel') != null)
			document.getElementById('5Panel').style.display = "none";
		if( document.getElementById('6Panel') != null)
			document.getElementById('6Panel').style.display = "none";
		if( document.getElementById('7Panel') != null)
			document.getElementById('7Panel').style.display = "none";
		if( document.getElementById('8Panel') != null)
			document.getElementById('8Panel').style.display = "none";
		if( document.getElementById('9Panel') != null)
			document.getElementById('9Panel').style.display = "none";
		if( document.getElementById('10Panel') != null)
			document.getElementById('10Panel').style.display = "none";
		if( document.getElementById('11Panel') != null)
			document.getElementById('11Panel').style.display = "none";
	}

	//		hide main input field
	mainInput.style.display = "none";
}

//		called every frame from Main.js
//	----------------------------------		[   MAIN   ]		----------------------------------
function cutAdvance(){
	cutCurrentPanel++;
	if( document.getElementById(cutCurrentPanel + "Panel") != null)
		document.getElementById(cutCurrentPanel + "Panel").style.display = "block";
	else{
		document.body.removeChild(cutSvgObject.parentNode);//		remove svg from dom
		levelCleared();
	}
	if(cutCurrentPanel == 6){//		hide first section of panels
		document.getElementById('0Panel').style.display = "none";
		document.getElementById('1Panel').style.display = "none";
		document.getElementById('2Panel').style.display = "none";
		document.getElementById('3Panel').style.display = "none";
		document.getElementById('4Panel').style.display = "none";
		document.getElementById('5Panel').style.display = "none";
	}
	
}

//		activated by screen resize
function cutScreenResize(){
	//		set the .svg width to the screen size
	if(cutSvgObject != null)
		cutSvgObject.setAttribute("width" , screenWidth + "px");
}
