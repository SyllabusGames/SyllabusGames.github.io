//	-----	[  This is free and unencumbered software released into the public domain  ]	-----
function createLevelMap(){
	
	localStorage.setItem("LevelMap" , "Polar001,TY001,PW001,PF001,DR001,PV001,DR001,PR001,BL001,CU001,NoneTyped")
	
	localStorage.setItem("NoneTyped" , `Title not shown
TY
-10,0
x
showt0
useZ
useNone
10,0
none
End`);
	localStorage.setItem("NonePie" , `Title not shown
PW
-10,0
5
-999,10,-x/2+t*1.5
10,20,t*1.5-10
20,30,x/5-16+t*1
30,40,x/8-16+t*0.5
40,200,x/10-16+t*2
showt0
useZ
useNone
10,0
none
End`);

	localStorage.setItem("NoneMulti" , `Title not shown
MT
-10,0
hideMax
5
x/1
x/2
x/3
x/4
x/5
showt0
useZ
useNone
10,0
none
End`);

	localStorage.setItem("NoneProxyVar" , `Title not shown
PV
-10,0
y=A+B+C+D
A=x+t
B=x+t
C=x+t
D=x+t
showt0
useZ
useNone
10,0
none
End`);
	localStorage.setItem("NoneProxyFunction" , `Title not shown
PF
-10,0
y=f[x]+g[x]+h[x]+k[x]
f=a/1
g=a/2
h=a/3
k=a/4
showt0
useZ
useNone
10,0
none
End`);
	localStorage.setItem("NoneProgramming" , `Title not shown
TY
-10,0
x
showt0
showAcceleration100000
useZ
useNone
10,0
none
End`);


	
}


/*
SVG letter meanings
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


		Typed input like the original Sine Rider
LV1: Easy				Name
TY						Level Type
0,0						Sled start position
-x/2-3					Default equation
		//		All levels can contain any combination of the following modifiers
y=-x/3-4				Guide Equation
sled=Sled2A,0.7			Replace sled graphic with Sled2A.svg for this level and all following levels until the value is set by another level. Set the sled's physics width to 0.7 meters.
showt0//				t can always be used in equations. Adding this graphs a t=0 line
showAcceleration80		Displays the sled's acceleration when the game is running. Resets the sledder if acceleration exceeds 80.
useZ//					Allows z to be used in equation
useNone					Not a game level, this is just a graphing application (Do not render sled or background)
useDerivative			Graph the derivative of whatever function the player enters and use that for the sled physics

useScreenLimit			In levels with checkpoints, limit the players view to 60 meters past the nearest checkpoint/goal on either side
nTower					.svg background to load
End


		Piecewise
LV1: Easy				Name
PW						Level Type
0,0						Sled start position
3						Number of equations
-999,20,-x/2+t*1.5		Equation #1 range minimum, range maximum, default equation
L20,L60,Lt*1.5-10		Equation #2. Adding an L in front of the input locks that input field so the player cannot edit it.
60-sin(t),200,x/10-16	Equation #3. Equation limits can be equations using time. If they are equations not containing time, they will be reduced to their numeric value the first time they are edited.
91,17					Camera track point
nTower					.svg background to load
End


		Multi-Typed Input
LV1: Easy				Name
MT						Level Type
0,0						Sled start position
hideMax					Optional declaration which hides the max line used for physics. Just don't include this line to use the line.
3						Number of equations
-x/2+t*1.5				Equation #1 range minimum, range maximum, default equation
Lt*1.5-10				Equation #2. Adding an L in front of the input locks that input field so the player cannot edit it.
200,x/10-16				Equation #3. Equation limits can be equations using time. If they are equations not containing time, they will be reduced to their numeric value the first time they are edited.
91,17					Camera track point
nTower					.svg background to load
End



		Proxy Variable
LV1: Easy				Name
PV						Level Type
0,0						Sled start position
a+b+c+d					Main equation that uses the other equations
a-1						Set variable a to 2
b=2					 	 - means the player cannot edit a and it is permanently 2.
c=3						 = means they can edit a, and the default is 2
d=x+4					variables must be a,b,c,d in that order and only these combinations should be used (a) (a,b) (a,b,c) (a,b,c,d)
91,17					Camera track point
nTower					.svg background to load
End


		Proxy Function
LV1: Easy				Name
PF						Level Type
0,0						Sled start position
a+b+c+d					Main equation that uses the other equations
f-1						Set variable a to 2
g=2					 	 - means the player cannot edit f() and it is permanently f(a) = 2.
h=3						 = means they can edit a, and the default is 2
k=x+4					variables must be f,g,h,k in that order and only these combinations should be used (f) (f,g) (f,g,h) (f,g,h,k)
91,17					Camera track point
nTower					.svg background to load
End


		Point Drag
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


		Blank/ Fill in the Blank
LV1: Easy				Name
BL						Level Type
0,0						Sled start position
_*x+_					Equation with _ where dragable variables will be placed
2,5						Default values
100,200					Input field widths in pixels (20 pixels per character)
91,17					Camera track point
nTower					.svg background to load
End

		Programming
LV1: Easy				Name
PR						Level Type
0,0						Sled start position
5*x+2					Line equation (the player cannot change this)
proSledPosX				Let the player set the sled's X position when it hits the line
0						Default equation
proSledPosY				Let the player set the sled's Y position when it hits the line
0
proSledVelX				Let the player set the sled's X position when it hits the line
0
proPSledVelY			Let the player set the sled's X position when it hits the line
0
proGravity				Let the player set gravity
-3
91,17					Camera track point
nTower					.svg background to load
End
		


*/
