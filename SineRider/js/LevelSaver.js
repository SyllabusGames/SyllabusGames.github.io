function saveLevel(){
	localStorage.setItem("SR001" , "LV1: Using Time\nSR\n14,29\n-x*1.5+40\nuseTime\n20,15\nGoal\n20,15,5\nResets\n50,20,3\n80,-80,1\nEnd");
	localStorage.setItem("SR002" , "LV2: Using Z\nSR\n0,20\n-x/3+2+z\nuseZ\n30,0\nGoal\n30,0,10\nResets\n10,-3,5,3\nEnd");
	localStorage.setItem("SR003" , "LV3: Using Time and Z\nSR\n0,0\n-x-t*5\nuseTime\nuseZ\n30,-60\nGoal\n30,-60,5\nResets\n10,-5,5,3\nEnd");
	localStorage.setItem("SR004" , "LV2: Using __ and Z\nSR\n0,20\n-x/3+_+2\nuseZ\n30,0\nGoal\n30,0,10\nResets\n10,-3,5,3\nEnd");
}

/*
LV1: Easy as it gets
Level Type (SR , PW)
Player start position
useBlanks//	Optional declaration
Default Equation
useTime//	Optional declaration
useZ//	Optional declaration
Camera track point
Goal
X,Y,R or X,Y,Width, Height
Resets
X,Y,R or X,Y,Width, Height
End


*/

function buildLevelMap(){
	localStorage.setItem("LevelMap" , "SR001,SR002,SR003")
}