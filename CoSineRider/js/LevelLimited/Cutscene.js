
//		set by LevelLoader.js
var cutObject;
var cutSvgObject;
var ajax;
var ajax2;
var cutCurrentPanel = 0;

var languageFileString;

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
		ajax2 = new XMLHttpRequest();
		ajax2.open("GET", "https://syllabusgames.github.io/CoSineRider/Cutscenes/Cutscene1English.txt", true);
		ajax2.send();
		ajax2.onload = function(e) {
			var textElement = document.getElementById("0text");
			var textElementNum = 1;
			ltmp = 4;
			//		import all the text for the .svg from a language file
			languageFileString = ajax2.responseText;
			//		replace the default text with text from a language file
			while(textElement != null){
				rtmp = languageFileString.indexOf('[' + (('0' + textElementNum).slice(-2)) + ']') - 1;//		find the current text's [##] in the language file
				partstring = languageFileString.substring(ltmp+1 , rtmp).split("\n");//		get all lines of text for this text box in an array
				
				
	//			console.log(textElementNum + "\nrtmp-ltmp = " + (rtmp) + "\nltmp = " + ltmp + "\n" + '[' + (('0' + textElementNum).slice(-2)) + ']' + "\n" + partstring);

				//		This version assumes textElement.innerHTML grabbs the text element, not tspan
				/*
				//		find >w< which is the default text in every cutscene
				var fullString = textElement.innerHTML;
				var mid = fullString.indexOf(">w<");//		mid = position of text to be replaced
				var left = fullString.substring(0 , dx).lastIndexOf("<");//		left = index of the < starting the object containing the text to be replaced (most likely a <tspan>)
				var right = fullString.substring(dx).indexOf(">");//			right = index of the > ending the object containing the text to be replaced (most likely a </tspan>)
				
				var lString = fullString.substring(0 , left);//		lString is everything left  of the object creating the w placeholder text object
				var rString = fullString.substring(right);//		lString is everything right of the object creating the w placeholder text object
				
				var mString = fullString.substring(left , right);//		the text element actually displaying text. This is the object which will be duplicated to make multiple lines of text
						
						console.log("Out\n" + fullString + "\n" + lString + "\n" + rString + "\n" + mString);

				//		add a new copy of the text element for every line of text
				lString += mString.replace(">w<" , ">ANDDDDD Yay<");
	//			lString += mString.replace(">w<" , ">" + partstring + "<");
				
				textElement.innerHTML = lString + rString;
				*/
				
				
				var stringProto = textElement.innerHTML;
				
				//		import the text for the first line
				var finalString = stringProto.replace(">w<" , ">" + partstring[0] + "<");
				var spacing = textElement.getAttribute('font-size');//		get the font size for this piece of text
				spacing = parseFloat( spacing.substring(0 , spacing.length-2) ) + 5;//		cut of the "px" from the end of the string, convert into a float, and add a 5 pixel gap
				
				//		add a new copy of the text element for every line of text
				for(k = 1 ; k < partstring.length ; k++){
					stmp = stringProto.replace(">w<" , ">" + partstring[k] + "<");//		import text for each extra line
					dy = parseInt(stmp.match(/y="\d+/)[0].substring(3));//		get character position of y coordinate
					stmp = stmp.replace(/y="\d+.?\d+?"/ , 'y="' + (dy + spacing * k) + '"');//		shift y coordinate down the font height + 5 pixels to make the next line
					finalString += stmp;//		add this line to the text element
				}
				
				textElement.innerHTML = finalString;
		
				//textElement.innerHTML = textElement.innerHTML.replace(">w<" , ">" + partstring + '<tspan dx="2em" dy="2em">Line 2, too!</tspan>' + "<");
				textElement = document.getElementById(textElementNum + "text");
				ltmp = rtmp + 5;//		left end is _ characters right of ltmp to skip the [##]
				textElementNum++;
			}
			
		
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
			
			}//		end of ajax request for language file
		}//			end of ajax request for svg

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
	
	if(useDerivative){
		yPrimeEqualsText.style.top = (parseInt(yEqualsText.style.top) - 50) + "px";
	}
}
