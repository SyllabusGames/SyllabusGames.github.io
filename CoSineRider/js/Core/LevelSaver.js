//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
function saveLevel(){
	localStorage.setItem("Blank" , "Title not shown\nSR\n-10,0\nx\nuseTime\nuseBlank\n0,0\nnone\nEnd");//	sin(x-8*t)+(x-12)^2/300-1
	localStorage.setItem("DR000" , `LV1: Drag Points
DR
0,0
_*x+_
1,y,1,1,1,-1,-1
0,y,0,0,-1,-1,-1
44,4
Cave
End`);
	localStorage.setItem("DR001" , `LV1: Drag Points
DR
0,0
_/10*(x-_)^2+_
1,y,1,1,1,2,-1
0,x,0,1,2,-1,-1
0,y,0,0,1,-1,-1
44,4
Cave
End`);
	localStorage.setItem("DR002" , `LV1: Drag Points
DR
0,0
_*sin((x-_)/_)+_
1,y,1.5708,0,1,3,2
0,x,0,-1,3,-1,-1
1,x,0,0.8414,1,3,0
0,y,0,0,1,-1,-1
useTime
10,0
Cave
End`);
	localStorage.setItem("DR003" , `LV1: Drag Points
DR
0,0
_*sin((x-_-t*_)/_)+_
1,y,1.5708,0,1,4,3
0,x,0,-1,4,-1,-1
1,x,0,0,-1,-1,-1
1,x,0,0.8414,1,4,0
0,y,0,0,1,-1,-1
useTime
10,0
Cave
End`);
	localStorage.setItem("DR004" , `LV1: Drag Points
DR
0,0
_*sin((x-_-t*_)/_)+_ + _/100*(x-_)^2+_
1,y,1.5708,0,1,4,3
0,x,0,-1,4,-1,-1
1,x,0,0,-1,-1,-1
1,x,0,0.8414,1,4,0
0,y,0,0,1,-1,-1
0.2,y,1,1,6,7,-1
10,x,0,1,7,-1,-1
-5,y,0,0,6,-1,-1
useTime
10,0
Cave
End`);

	localStorage.setItem("BL001" , `LV1: Drag Points
BL
0,0
_/10*(x-_)^2+0000000+_
1,2,3
44,4
Tower
End`);

	localStorage.setItem("SR001" , `LV1: Using Time
SR
0,0
sin(x-8*t)+(x-12)^2/300-1
useTime
useZ
44,4
Cave
End`);
	localStorage.setItem("PW001" , `LV2: Piecwise
PW
0,0
3
-999,20,-x/2+t*1.5
20,60,t*1.5-10
60,200,x/10-16+t*1.5
91,17
Tower
End`);
	localStorage.setItem("PW002" , `LV2: Piecwise
PW
0,0
5
-999,10,-x/2+t*1.5
10,20,t*1.5-10
20,30,x/5-16+t*1
30,40,x/8-16+t*0.5
40,200,x/10-16+t*2
91,17
Tower
End`);
	localStorage.setItem("SR004" , "LV2: Using __ and Z\nSR\n0,20\n-x/3+_+2\nuseZ\n30,0\nCave\nEnd");
	localStorage.setItem("CaveColliders" , '<svg width="2e3" height="2e3" version="1.1" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 947.64)" stroke="#000000"><path d="m1187.8 38.78-4.5114 4.6461-10.734 4.6196-12.908-1.7663-18.071 0.13588-23.506 4.0761-40.626 2.7174-17.392-4.212-10.87-2.038-11.142-1.087-5.5707-3.6685-1.9022-3.6685 1.7919-4.1638 10.642-11.331 34.578-7.8748 34.376 0.54348 59.39-9.1243 16.64 23.431-0.1853 8.7645" fill="#ffffff" fill-rule="evenodd"/><path d="m0 78.696 949.47-15.024 24.593-0.74728 15.218-1.9022h19.905l8.6145 1.4618 2.7862 0.33626 2.546 0.7686 0.4803 0.72056 5.0921 8.1107 3.6029 1.8254 1.345 2.1752 2.8343 1.2009 1.9215 1.8735 3.8911 2.2578 4.0832 1.6813 3.5548 1.1049 3.747 2.0176 5.8127 2.4019 7.8302 3.891 3.843 2.1617 1.9216 0.0961 1.2489-0.57644 0.9608 0.19214 1.297 0.76861 3.6029 0.1441 0.4324-1.0088 3.2665-0.24019 3.0264 0.33626 1.6333-0.14411 2.9784 0.81663 5.8606-0.1441 10.04-2.4019 0.8647-1.1529 2.2098-0.72056 1.4891 0.28822 1.4412-0.048 2.0176-0.9127-0.3363-0.62449 0.1441-1.0088 4.3235-2.1617 7.4459-0.24018 1.2009 0.5284 7.5901-2.1136 12.826-0.43233 1.7774-0.43233 2.6421-0.048 2.2577 0.57645 1.6333 1.0088h4.8519l4.0832-0.86467 6.245 1.1048 11.322-0.24559 7.9272-5.0115 3.4649-7.7949 4.7994-3.7885 2.5388-5.0776 3.0829-4.8963 2.5692-1.7327 11.827-5.7659 15.468-0.91271 33.002-5.14 731.85-3.7593" fill="none"/><circle cx="1222.1" cy="38.434" r="8.6607" fill="none" stroke-width=".94488"/></g></svg>');
	localStorage.setItem("TowerColliders" , '<svg width="2e3" height="2e3" version="1.1" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1e3)" fill="none" stroke="#000000"><g><g><path d="m0 333.28h2e3"/><path d="m956.39 30.499h52.58" stroke-width=".5"/><path d="m954.57 11.078 11.137-11.093h33.751l11.756 11.084-56.007 9e-3" stroke-width=".5"/><path d="m1447.4-57.843h86.136l10.144-5.1315 11.217-1.9116 11.465 0.82942 10.89 3.1786 5.0778 3.0351h86.189"/></g><g><path d="m1439.5-39.088-5.7258-0.90802-3.2386-2.6712-2.1278-3.6035-1.0356-4.1539 0.038-4.3225 1.0931-4.1093 2.1296-3.5143 3.1477-2.5374 4.1471-1.1787 4.5637 1.2969 3.3776 3.2352 2.0733 4.3645 0.6508 4.6849-0.911 5.7476-3.2886 4.9442-4.8935 2.7256" stroke-linejoin="bevel"/><path d="m1676.7-39.088 5.7258-0.90804 3.2386-2.6712 2.1278-3.6035 1.0356-4.1539-0.038-4.3225-1.0931-4.1093-2.1296-3.5143-3.1477-2.5374-4.1471-1.1787-4.5637 1.2969-3.3775 3.2352-2.0733 4.3645-0.651 4.6849 0.9111 5.7476 3.2885 4.9442 4.8935 2.7257" stroke-linejoin="bevel"/><path d="m1514.1-24.388h88.311"/><path d="m1542-91.011-28.608-3.1516-27.52-8.0823-3.9101-2.8305-0.982-4.0469 1.676-3.9518 4.0642-2.545 29.407-8.0035 30.442-2.9517 61.081 4.2764 15.72 3.9863 7.1901 3.5273 4.5762 6.093-6.3927 7.1408-9.2049 3.8289-19.917 4.0001-57.621 2.7104" stroke-linejoin="bevel"/></g></g><circle cx="1457.9" cy="-76.339" r="11.518"/></g></svg>');	
}


function buildLevelMap(){
	localStorage.setItem("LevelMap" , "BL001,DR004,SR001,PW001,DR001,SR004")
}

/*
M = moveto
L = lineto
H = horizontal line to
V = vertical line to
C = curve to
S = smooth curve to
Q = quadratic Bézier curve
T = smooth quadratic Bézier curve to
A = elliptical Arc
Z = closepath
*/

/*	Standard Sine Rider level
LV1: Easy				Name
SR						Level Type
0,0						Sled start position
-x/2-3					Default equation
		//		All levels can contain the following modifiers
useTime//				Optional declaration. Allows t to be used in equation
useZ//					Optional declaration. Allows z to be used in equation
useBlank				Not a game level, this is just a graphing application (Do not render sled or background)

30,10					Camera track point
nTower					.svg background to load
End
*/

/*		Piecewise
LV1: Easy				Name
PW						Level Type
0,0						Sled start position
3						Number of equations
-999,20,-x/2+t*1.5		Equation #1 range minimum, range maximum, default equation
20,60,t*1.5-10			Equation #2 range minimum, range maximum, default equation
60,200,x/10-16+t*1.5	Equation #3 range minimum, range maximum, default equation
91,17					Camera track point
nTower					.svg background to load
End
*/

/*		Point Drag
LV1: Easy				Name
DR						Level Type
0,0						Sled start position
_*x+_					Equation with _ where dragable variables will be placed
2,y,1,1,-1,-1-1			Default value,
						(x-drag allong x || y-drag allong y),
						default world position for drag point.x,	(if dependent 3 is used, this becomes a scaling factor for that point's influence)
						default world position for drag point.y,	(if dependent 3 is used, this becomes a scaling factor for that point's influence)
						dependent point which will have its position added to this point's position (-1 = none).
						second dependent point
						third dependent point is multiplied by the default X or Y depending on whether the dependent point slides on X or Y
91,17					Camera track point
nTower					.svg background to load
End
*/

/*		Blank/ Fill in the Blank
LV1: Easy				Name
BL						Level Type
0,0						Sled start position
_*x+_					Equation with _ where dragable variables will be placed
2,5						Default values
91,17					Camera track point
nTower					.svg background to load
End
*/
