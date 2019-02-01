<<<<<<< HEAD
﻿//		this switches all game colors by holding d+r+k


//		NEED TO RECOLOR .SVG WIPEOUT COLOR

//	holding the D R K keys will switch the game to dark theme
var themeDarkD = false;
var themeDarkR = false;
var themeDarkK = false;

//	holding the W T keys will switch the game to the normal white theme
var themeWhiteW = false;
var themeWhiteT = false;

document.addEventListener("keydown", function(e){
		if(e.keyCode == 68){//		D key
			themeDarkD = true;
		}
		if(e.keyCode == 82){//		R key
			themeDarkR = true;
		}
		if(e.keyCode == 75){//		K key
			themeDarkK = true;
		}
		
		if(e.keyCode == 87){//		W key
			themeWhiteW = true;
		}
		if(e.keyCode == 84){//		T key
			themeWhiteT = true;
		}
		
		if(themeDarkD && themeDarkR && themeDarkK){
			setDarkTheme();
		}
		if(themeWhiteW && themeWhiteT){
			setWhiteTheme();
		}
});

document.addEventListener("keyup", function(e){
		if(e.keyCode == 68){//		D key
			themeDarkD = false;
		}
		if(e.keyCode == 82){//		R key
			themeDarkR = false;
		}
		if(e.keyCode == 75){//		K key
			themeDarkK = false;
		}
		
		if(e.keyCode == 87){//		W key
			themeWhiteW = false;
		}
		if(e.keyCode == 84){//		T key
			themeWhiteT = false;
		}
});

function setDarkTheme(){
	canvas.style.background = "#606060";
	
	_inputColor = "#BBBBBBBB";
	//		does nothing without re-calling some input setup functions
	_inputLockedColor = "#909090BB";
	// _inputBorderGoodColor = "#AAAAAA";
	// _inputBorderBadColor = "#FF0000";
	// _inputZColor = "#0000FF";

	_lineColor = "#BBBBBBFF";
	_lineFadedColor = "#A0A0A040";
	_lineTimelessColor = "#888888FF";
	// _lineInvalidColor = "";
			// _lineZPlusColor = "#BB7060";
			// _lineZMinusColor = "#70BB60";


	_graphedPointColor = "#004444";
	_graphedCursorColor = "#8888FFFF";
	_graphedInterceptColor = "#BB8800FF";
	_graphedMinMaxColor = "#BB0088FF";
	_graphedDeletionColor = "#FF000020";

	_gridMainColor = "#202020";
	_gridSecondaryColor = "#404040";
	// _gridTextColor = "#000000"

	_goalColor = "#0080BB";

	// _dragFadeColor = "#555555";

	_xyzButtonColor = "#00A0A050";

	// _displayErrorColor = "#A00000";
}


function setWhiteTheme(){
	canvas.style.background = "#FFFFFF";

	_inputColor = "#FFFFFFBB";
	_inputLockedColor = "#AAAAAABB";
	_inputBorderGoodColor = "#AAAAAA";
	_inputBorderBadColor = "#FF0000";
	_inputZColor = "#0000FF";

	_lineColor = "#000000FF";
	_lineFadedColor = "#00000040";
	_lineTimelessColor = "#BBBBBBFF";
	_lineInvalidColor = "#CC0000";
	_lineZPlusColor = "#BB7060";
	_lineZMinusColor = "#70BB60";


	_graphedPointColor = "#00AAAA";
	_graphedCursorColor = "#3333FFFF";
	_graphedInterceptColor = "#FFAA00FF";
	_graphedMinMaxColor = "#FF00AAFF";
	_graphedDeletionColor = "#AA000020";

	_gridMainColor = "#505050";
	_gridSecondaryColor = "#C5C5C5";
	_gridTextColor = "#000000"

	_goalColor = "#00B0FF";

	_dragFadeColor = "#555555";

	_xyzButtonColor = "#00A0A030";

	_displayErrorColor = "#A00000";
=======
﻿//		this switches all game colors by holding d+r+k


//		NEED TO RECOLOR .SVG WIPEOUT COLOR

//	holding the D R K keys will switch the game to dark theme
var themeDarkD = false;
var themeDarkR = false;
var themeDarkK = false;

//	holding the W T keys will switch the game to the normal white theme
var themeWhiteW = false;
var themeWhiteT = false;

document.addEventListener("keydown", function(e){
		if(e.keyCode == 68){//		D key
			themeDarkD = true;
		}
		if(e.keyCode == 82){//		R key
			themeDarkR = true;
		}
		if(e.keyCode == 75){//		K key
			themeDarkK = true;
		}
		
		if(e.keyCode == 87){//		W key
			themeWhiteW = true;
		}
		if(e.keyCode == 84){//		T key
			themeWhiteT = true;
		}
		
		if(themeDarkD && themeDarkR && themeDarkK){
			setDarkTheme();
		}
		if(themeWhiteW && themeWhiteT){
			setWhiteTheme();
		}
});

document.addEventListener("keyup", function(e){
		if(e.keyCode == 68){//		D key
			themeDarkD = false;
		}
		if(e.keyCode == 82){//		R key
			themeDarkR = false;
		}
		if(e.keyCode == 75){//		K key
			themeDarkK = false;
		}
		
		if(e.keyCode == 87){//		W key
			themeWhiteW = false;
		}
		if(e.keyCode == 84){//		T key
			themeWhiteT = false;
		}
});

function setDarkTheme(){
	canvas.style.background = "#606060";
	
	_inputColor = "#BBBBBBBB";
	//		does nothing without re-calling some input setup functions
	_inputLockedColor = "#909090BB";
	// _inputBorderGoodColor = "#AAAAAA";
	// _inputBorderBadColor = "#FF0000";
	// _inputZColor = "#0000FF";

	_lineColor = "#BBBBBBFF";
	_lineFadedColor = "#A0A0A040";
	_lineTimelessColor = "#888888FF";
	// _lineInvalidColor = "";
			// _lineZPlusColor = "#BB7060";
			// _lineZMinusColor = "#70BB60";


	_graphedPointColor = "#004444";
	_graphedCursorColor = "#8888FFFF";
	_graphedInterceptColor = "#BB8800FF";
	_graphedMinMaxColor = "#BB0088FF";
	_graphedDeletionColor = "#FF000020";

	_gridMainColor = "#202020";
	_gridSecondaryColor = "#404040";
	// _gridTextColor = "#000000"

	_goalColor = "#0080BB";

	// _dragFadeColor = "#555555";

	_xyzButtonColor = "#00A0A050";

	// _displayErrorColor = "#A00000";
}


function setWhiteTheme(){
	canvas.style.background = "#FFFFFF";

	_inputColor = "#FFFFFFBB";
	_inputLockedColor = "#AAAAAABB";
	_inputBorderGoodColor = "#AAAAAA";
	_inputBorderBadColor = "#FF0000";
	_inputZColor = "#0000FF";

	_lineColor = "#000000FF";
	_lineFadedColor = "#00000040";
	_lineTimelessColor = "#BBBBBBFF";
	_lineInvalidColor = "#CC0000";
	_lineZPlusColor = "#BB7060";
	_lineZMinusColor = "#70BB60";


	_graphedPointColor = "#00AAAA";
	_graphedCursorColor = "#3333FFFF";
	_graphedInterceptColor = "#FFAA00FF";
	_graphedMinMaxColor = "#FF00AAFF";
	_graphedDeletionColor = "#AA000020";

	_gridMainColor = "#505050";
	_gridSecondaryColor = "#C5C5C5";
	_gridTextColor = "#000000"

	_goalColor = "#00B0FF";

	_dragFadeColor = "#555555";

	_xyzButtonColor = "#00A0A030";

	_displayErrorColor = "#A00000";
>>>>>>> a3503f6d8084bec8645c5c94b584ec9e6b4120a9
}