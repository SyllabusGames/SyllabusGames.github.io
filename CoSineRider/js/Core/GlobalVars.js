//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
//		this holds all global variables including resued/generic temporary variables, color schemes, and game settings

//	Variables beginning with _ are read only unless a mod is written to change them



//		colors for input fields
var _inputColor = "#FFFFFFBB";
var _inputLockedColor = "#AAAAAABB";
var _inputBorderGoodColor = "#AAAAAA";
var _inputBorderBadColor = "#FF0000";
var _inputZColor = "#0000FF";

//		colors for equation lines
var _lineColor = "#000000FF";
var _lineFadedColor = "#00000040";
var _lineTimelessColor = "#BBBBBBFF";//		color for graphing line where t=0
var _lineInvalidColor = "#CC0000";
var _lineZPlusColor = "#BB7060";
var _lineZMinusColor = "#70BB60";
var _lineRaw = "#BB22BBBB";//		Before taking derivative or integral


//		colors for graphing points by holding shift and clicking
var _graphedPointColor = "#00AAAA";
var _graphedCursorColor = "#3333FFFF";
var _graphedInterceptColor = "#FFAA00FF";
var _graphedMinMaxColor = "#AA22CC";
var _graphedDeletionColor = "#AA000020";

var _gridMainColor = "#505050";
var _gridSecondaryColor = "#C5C5C5";
var _gridTextColor = "#000000"

var _pFunLineColor = ["#0095d1" , "#7600d1" , "#d16f00" , "#00d118"];//		alpha value set in code so this color value must be 6 characters not 8 (RGB not RGBA)

var _goalColor = "#00B0FF";

var _dragFadeColor = "#555555";

var _xyzButtonColor = "#00A0A030";

var _displayErrorColor = "#A00000";//		alpha value set in code so this color value must be 6 characters not 8 (RGB not RGBA)

var _endAngle = 2*Math.PI;
var _piOver2 = Math.PI/2;


//		All colors have different Hues but the same Saturation and Value 
//		Text _colors, [0-9] Partenthasis, [11] x, [12] t, [13] z
//	"#FF0000" , "#009900" , "#0000FF"];//	10-12
var _colors = ['#d12020', '#3420d1', '#d2a320', '#d120ce', '#206cd1', '#b0d120', '#D15E20', '#7820d1', '#20d120', '#20b0d1'];


//		time
var frameTime = 0;//		time since level started (used as t in equations)
var lastTime = 0;
var dt = 0.01;//		change in time since last frame
//var lastTimeRaw = 0;

//		temporary variables (all of these are used in multiple places. This is to avoid the inefficiency of redeclaring i 10 times a frame)
//		all these variables should be assumed to be reset outside the context of a single function
var dx = 0;//	float
var dy = 0;//	float
var dydt = 0;//	float
var dxdt = 0;//	float
var i = 0;//	int
var k = 0;//	int
var stmp = "";//	string
var tmpx;
var tmpy;
var ltmp = 0;//	float
var rtmp = 0;//	float
var theta = 0;//	stores angles for polar coordinates

//		these temporary variables need to be phased out at some point or made local
	var lyy = 0;//	float
	var ryy = 0;//	float
	var itmp = 0;//	int
	var ftmp = 0;//	float
	var dtmp = 0;//	float
	var tmspx;
	var tmspy;
	var tmspz;
	
	
	


//		should be deleted before launch
var lineResolution = 5;//		pixels per vertex (vertex every _ pixels)
var slowMotion = false;
var performanceFramerateCount = 0;
var performanceFramerateLast = 0;
var performanceFramerateTime = 0;
var ctrlHeld = false;
var showMessage = false;
var messageTime = 10;
var messageText = "";

//		camera position and scale. These coordinates are the position of the upper left corner of the screen.
var screenWidth = 1600;
var screenHeight = 800;
var screenx = 0;
var screeny = 0;
var screenScale = 20;//		measured in pixels per meter
var trackPointx = 0;//		point the camera will try to keep on screen
var trackPointy = 0;

//		gameplay state
var simulating = false;//		game is running. Sled is moving.
var camLocked = false;
var paused = false;//		player has not paused and window is in focus
var menuOpen = false;//		game is paused because the menu is open

//		canvas
var canvas;//		main canvas for 2D elements
var ctx;
var xyz;//		canvas for 3D elements
var xyzc;
var xyzWidth = 500;
var xyzHeight = 500;
var xyz2;//		duplicate of xyz offset down 1 pixel on the Y to fill in 1 pixel gaps caused by a low sample rate.
var xyz2c;

var activeInput;//		the currently selected text input field
var mainInput;//		the first (botom left) input field and the one that is used if only one is active

var background = new Image;
var drawBackground = true;
var parallaxBackground = new Image;
var drawParallax = false;

