function saveLevel(){
	localStorage.setItem("SR001" , "LV1: Easy as it gets\nSR\n14,29\n-x/5+20\n40,10\nGoal\n40,10,5\nResets\n50,20,3\n80,-80,1\nEnd");
	localStorage.setItem("SR002" , "LV2: Return of the line\nSR\n0,20\n-x/3\n30,0\nGoal\n30,0,10\nResets\n10,-3,5,3\nEnd");
	localStorage.setItem("SR003" , "LV3: Return of the line\nSR\n0,0\n-x-t*5\n30,-60\nGoal\n30,-60,5\nResets\n10,-5,5,3\nEnd");
}

function buildLevelMap(){
	localStorage.setItem("LevelMap" , "SR001,SR002,SR003")
}