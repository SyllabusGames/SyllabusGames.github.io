//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
function saveLevel(){
	localStorage.setItem("SR001" , "LV1: Using Time\nSR\n0,0\n-x-t*1\nuseTime\nuseZ\n44,4\nCave\nEnd");//	sin(x-8*t)+(x-12)^2/300-1
	localStorage.setItem("SR002" , "LV2: Using Z\nSR\n0,0\n-x/4+10t-(t*0.74)^2\n91,17\nTower\nEnd");
	localStorage.setItem("SR003" , "LV3: Using Time and Z\nSR\n0,0\n-x-t*5+((z+5)^2)/20\nuseTime\nuseZ\n91,17\nTower\nEnd");
	localStorage.setItem("SR004" , "LV2: Using __ and Z\nSR\n0,20\n-x/3+_+2\nuseZ\n30,0\nCave\nEnd");
	localStorage.setItem("CaveColliders" , '<svg width="2e3" height="2e3" version="1.1" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 947.64)" stroke="#000000"><path d="m1187.8 38.78-4.5114 4.6461-10.734 4.6196-12.908-1.7663-18.071 0.13588-23.506 4.0761-40.626 2.7174-17.392-4.212-10.87-2.038-11.142-1.087-5.5707-3.6685-1.9022-3.6685 1.7919-4.1638 10.642-11.331 34.578-7.8748 34.376 0.54348 59.39-9.1243 16.64 23.431-0.1853 8.7645" fill="#ffffff" fill-rule="evenodd"/><path d="m0 78.696 949.47-15.024 24.593-0.74728 15.218-1.9022h19.905l8.6145 1.4618 2.7862 0.33626 2.546 0.7686 0.4803 0.72056 5.0921 8.1107 3.6029 1.8254 1.345 2.1752 2.8343 1.2009 1.9215 1.8735 3.8911 2.2578 4.0832 1.6813 3.5548 1.1049 3.747 2.0176 5.8127 2.4019 7.8302 3.891 3.843 2.1617 1.9216 0.0961 1.2489-0.57644 0.9608 0.19214 1.297 0.76861 3.6029 0.1441 0.4324-1.0088 3.2665-0.24019 3.0264 0.33626 1.6333-0.14411 2.9784 0.81663 5.8606-0.1441 10.04-2.4019 0.8647-1.1529 2.2098-0.72056 1.4891 0.28822 1.4412-0.048 2.0176-0.9127-0.3363-0.62449 0.1441-1.0088 4.3235-2.1617 7.4459-0.24018 1.2009 0.5284 7.5901-2.1136 12.826-0.43233 1.7774-0.43233 2.6421-0.048 2.2577 0.57645 1.6333 1.0088h4.8519l4.0832-0.86467 6.245 1.1048 11.322-0.24559 7.9272-5.0115 3.4649-7.7949 4.7994-3.7885 2.5388-5.0776 3.0829-4.8963 2.5692-1.7327 11.827-5.7659 15.468-0.91271 33.002-5.14 731.85-3.7593" fill="none"/><circle cx="1222.1" cy="38.434" r="8.6607" fill="none" stroke-width=".94488"/></g></svg>');
	localStorage.setItem("TowerColliders" , '<svg width="2e3" height="2e3" version="1.1" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1e3)" fill="none" stroke="#000000"><g><g><path d="m0 333.28h2e3"/><path d="m956.39 30.499h52.58" stroke-width=".5"/><path d="m954.57 11.078 11.137-11.093h33.751l11.756 11.084-56.007 9e-3" stroke-width=".5"/><path d="m1447.4-57.843h86.136l10.144-5.1315 11.217-1.9116 11.465 0.82942 10.89 3.1786 5.0778 3.0351h86.189"/></g><g><path d="m1439.5-39.088-5.7258-0.90802-3.2386-2.6712-2.1278-3.6035-1.0356-4.1539 0.038-4.3225 1.0931-4.1093 2.1296-3.5143 3.1477-2.5374 4.1471-1.1787 4.5637 1.2969 3.3776 3.2352 2.0733 4.3645 0.6508 4.6849-0.911 5.7476-3.2886 4.9442-4.8935 2.7256" stroke-linejoin="bevel"/><path d="m1676.7-39.088 5.7258-0.90804 3.2386-2.6712 2.1278-3.6035 1.0356-4.1539-0.038-4.3225-1.0931-4.1093-2.1296-3.5143-3.1477-2.5374-4.1471-1.1787-4.5637 1.2969-3.3775 3.2352-2.0733 4.3645-0.651 4.6849 0.9111 5.7476 3.2885 4.9442 4.8935 2.7257" stroke-linejoin="bevel"/><path d="m1514.1-24.388h88.311"/><path d="m1542-91.011-28.608-3.1516-27.52-8.0823-3.9101-2.8305-0.982-4.0469 1.676-3.9518 4.0642-2.545 29.407-8.0035 30.442-2.9517 61.081 4.2764 15.72 3.9863 7.1901 3.5273 4.5762 6.093-6.3927 7.1408-9.2049 3.8289-19.917 4.0001-57.621 2.7104" stroke-linejoin="bevel"/></g></g><circle cx="1457.9" cy="-76.339" r="11.518"/></g></svg>');	
}

/*
M = moveto
L = lineto
H = horizontal lineto
V = vertical lineto
C = curveto
S = smooth curveto
Q = quadratic Bézier curve
T = smooth quadratic Bézier curveto
A = elliptical Arc
Z = closepath
*/

/*
LV1: Easy as it gets
Level Type (SR , PW)
Player start position
useBlanks//	Optional declaration
Default Equation
useTime//	Optional declaration
useZ//	Optional declaration
Camera track point
.svg background to load
End
*/

function buildLevelMap(){
	localStorage.setItem("LevelMap" , "SR001,SR002,SR003,SR004")
}