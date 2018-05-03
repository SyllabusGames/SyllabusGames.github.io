function saveLevel(){
	localStorage.setItem("SR001" , "LV1: Using Time\nSR\n0,0\n-x*0.3\nuseTime\nuseZ\n80,5\nGoal\n80,5,3\nResets\n50,20,3\n80,-80,1\nCave.svg\nEnd");
	localStorage.setItem("SR002" , "LV2: Using Z\nSR\n0,0\n-x/3+z+3.5t\nuseZ\n130,20\nGoal\n130,20,8\nResets\n-20,-3,5,3\nTower.svg\nEnd");
	localStorage.setItem("SR003" , "LV3: Using Time and Z\nSR\n0,0\n-x-t*5+((z+5)^2)/20\nuseTime\nuseZ\n30,-60\nGoal\n30,-60,5\nResets\n10,-5,5,3\nTower.svg\nEnd");
	localStorage.setItem("SR004" , "LV2: Using __ and Z\nSR\n0,20\n-x/3+_+2\nuseZ\n30,0\nGoal\n30,0,10\nResets\n10,-3,5,3\nCave.svg\nEnd");
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
.svg background to load
End

*/

function buildLevelMap(){
	localStorage.setItem("LevelMap" , "SR001,SR002,SR003")
}