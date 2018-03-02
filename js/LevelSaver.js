function saveLevel(){
	localStorage.setItem("SR001" , "LV1: Easy as it gets\nSR\n10,-10\n-x/5\nGoal\n40,-10,6\nResets\n50,-20,2\n80,-80,1\nEnd");
	localStorage.setItem("SR002" , "LV2: Return of the line\nSR\n0,-10\n-x/3\nGoal\n30,0,10\nResets\n10,-3,5,3\nEnd");
	localStorage.setItem("SR003" , "LV3: Return of the line\nSR\n-10,-10\n-x+t\nGoal\n30,-80,5\nResets\n10,-5,5,3\nEnd");
}

function buildLevelMap(){
	localStorage.setItem("LevelMap" , "SR001,SR002,SR003")
}