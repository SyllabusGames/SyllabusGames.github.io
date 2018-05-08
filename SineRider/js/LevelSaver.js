﻿function saveLevel(){
	localStorage.setItem("SR001" , "LV1: Using Time\nSR\n0,0\n-x*0.3+2.5t\nuseTime\nuseZ\n80,5\nGoal\n80,5,3\nResets\n50,20,3\n80,-80,1\nCave.svg\nEnd");
	localStorage.setItem("SR002" , "LV2: Using Z\nSR\n0,0\n-x/2+7t\n130,20\nGoal\n130,20,8\nResets\n-20,-3,5,3\nTower.svg\nEnd");
	localStorage.setItem("SR003" , "LV3: Using Time and Z\nSR\n0,0\n-x-t*5+((z+5)^2)/20\nuseTime\nuseZ\n30,-60\nGoal\n30,-60,5\nResets\n10,-5,5,3\nTower.svg\nEnd");
	localStorage.setItem("SR004" , "LV2: Using __ and Z\nSR\n0,20\n-x/3+_+2\nuseZ\n30,0\nGoal\n30,0,10\nResets\n10,-3,5,3\nCave.svg\nEnd");
	localStorage.setItem("SR001colliders" , "%LaTeX with PSTricks extensions%%Creator: 0.91_64bit%%Please note this file requires PSTricks extensions\psset{xunit=.5pt,yunit=.5pt,runit=.5pt}\begin{pspicture}(2000,2000){\newrgbcolor{curcolor}{0 0 0}\pscustom[linewidth=1.90219939,linecolor=curcolor]{\newpath\moveto(1998.1984,1030.441661)\lineto(1527.1069,1022.923068)\lineto(1461.1029,1012.642979)\lineto(1430.1667,1010.817545)\lineto(1406.5129,999.285747)\lineto(1401.3746,995.820496)\lineto(1395.2089,986.02792)\lineto(1390.1313,975.87265)\lineto(1380.5325,968.29565)\lineto(1373.6027,952.70577)\lineto(1357.7484,942.68264)\lineto(1335.1047,942.19144)\lineto(1322.6148,944.40117)\lineto(1314.4484,942.67182)\lineto(1304.7447,942.67182)\lineto(1301.4782,944.6894)\lineto(1296.9627,945.84231)\lineto(1291.6785,945.74621)\lineto(1288.1237,944.88154)\lineto(1262.4715,944.01687)\lineto(1247.2915,939.78954)\lineto(1244.8897,940.84636)\lineto(1229.998,940.36599)\lineto(1221.3511,936.04259)\lineto(1221.0629,934.025)\lineto(1217.7003,930.95059)\lineto(1214.818,930.85449)\lineto(1211.8397,931.43094)\lineto(1207.4202,929.9898)\lineto(1205.6908,927.68399)\lineto(1185.611,922.88021)\lineto(1173.8898,922.592)\lineto(1167.9331,924.22527)\lineto(1164.6665,923.93705)\lineto(1158.6138,924.60958)\lineto(1152.0807,924.1292)\lineto(1151.2159,922.11161)\lineto(1144.0103,922.39983)\lineto(1141.4163,923.93705)\lineto(1139.4947,924.32134)\lineto(1136.9968,923.16845)\lineto(1133.1537,923.3606)\lineto(1125.4677,927.68399)\lineto(1109.8074,935.46612)\lineto(1098.1822,940.26989)\lineto(1090.6883,944.30507)\lineto(1083.5787,946.51481)\lineto(1075.4124,949.87745)\lineto(1067.6302,954.393)\lineto(1063.7872,958.13995)\lineto(1058.1187,960.54183)\lineto(1055.4287,964.89218)\lineto(1048.2229,968.54305)\lineto(1038.0389,984.76455)\lineto(1037.0782,986.20568)\lineto(1031.9862,987.7429)\lineto(1026.4138,988.41543)\lineto(1009.185,991.33909)\lineto(969.37463,991.33909)\lineto(938.93953,987.53468)\lineto(889.75403,986.0401)\lineto(5.9406056,955.99238)}}{\newrgbcolor{curcolor}{0 1 0}\pscustom[linewidth=1.90219939,linecolor=curcolor]{\newpath\moveto(1051.9924,1036.316967)\lineto(1055.7968,1028.979917)\lineto(1066.9382,1021.642867)\lineto(1089.2211,1019.468926)\lineto(1110.9606,1015.392779)\lineto(1145.7436,1006.96875)\lineto(1226.9947,1012.403603)\lineto(1274.0062,1020.555879)\lineto(1310.148,1020.827641)\lineto(1335.9635,1017.294976)\lineto(1357.4312,1026.534231)\lineto(1366.454,1035.826493)\lineto(1366.8247,1053.35568351)}}{\newrgbcolor{curcolor}{0 0 1}\pscustom[linewidth=1,linecolor=curcolor]{\newpath\moveto(1395.7783,1025.05228)\lineto(1406.8899,1009.14238)}}{\newrgbcolor{curcolor}{0 0 0}\pscustom[linewidth=1.90219939,linecolor=curcolor]{\newpath\moveto(1366.8247,1053.35568351)\lineto(1333.5457,1100.218464)\lineto(1214.7662,1081.969753)\lineto(1146.0153,1083.056724)\lineto(1076.8608,1067.306955)\lineto(1055.5762,1044.644609)\lineto(1051.9924,1036.316967)}}\end{pspicture}");
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
	localStorage.setItem("LevelMap" , "SR001,SR002,SR003,SR004")
}