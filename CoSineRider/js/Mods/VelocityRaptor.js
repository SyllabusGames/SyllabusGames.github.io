/*
	Velocity Raptor (the inspiration for this Cosine Rider mod) was created by Andy Hall of TestTubeGames. (https://testtubegames.com/velocityraptor.html)
*/

//		keys pressed to activate velocity raptor mode
var velocityRaptorR = false;
var velocityRaptorA = false;
var velocityRaptorP = false;
var velocityRaptorT = false;
var velocityRaptorO = false;

var velocityRaptorRunning = false;


//		buttons held
var velocityRaptorUp = false;
var velocityRaptorDown = false;
var velocityRaptorLeft = false;
var velocityRaptorRight = false;

//		raptor position
var velocityRaptorX = 0;
var velocityRaptorY = 0;
//		raptor velocity
var velocityRaptorVx = 0;
var velocityRaptorVy = 0;
//		raptor velocity last frame
var velocityRaptorOldVx = 0;
var velocityRaptorOldVy = 0;

//		input vector components
var velocityRaptorInputX = 0;
var velocityRaptorInputY = 0;


//		temporary variable
var velocityRaptorScale;
//		svg screen elements for rendering velocity raptor
var velocityRaptorSVGTemplate;
var velocityRaptorSVG;

//		type RAPTOR to start this mode
document.addEventListener("keydown", function(e){
	if(e.keyCode == 82){//		R key
		velocityRaptorR = true;
		//		Reset position and velocity
		velocityRaptorVx = 0;
		velocityRaptorVy = 0;
		velocityRaptorX = 0;
		velocityRaptorY = 0;
		if(velocityRaptorO){//		activate velocity raptor mode
			initializeVelocityRaptor();
			e.preventDefault();
		}
	}
	if(e.keyCode == 65 && velocityRaptorR){//		A key
		velocityRaptorA = true;
	}
	if(e.keyCode == 80 && velocityRaptorA){//		P key
		velocityRaptorP = true;
	}
	if(e.keyCode == 84 && velocityRaptorP){//		T key
		velocityRaptorT = true;
	}
	if(e.keyCode == 79 && velocityRaptorT){//		O key
		velocityRaptorO = true;
	}
	
	if(e.keyCode == 38 || e.keyCode == 87){//		Up Arrow / W
		velocityRaptorUp = true;
	}
	if(e.keyCode == 40 || e.keyCode == 83){//		Down Arrow / S
		velocityRaptorDown = true;
	}
	if(e.keyCode == 37 || e.keyCode == 65){//		Left Arrow / A
		velocityRaptorLeft = true;
	}
	if(e.keyCode == 39 || e.keyCode == 68){//		Right Arrow / D
		velocityRaptorRight = true;
	}
	
	if(e.keyCode == 88 || e.keyCode == 13){//		X or Enter resets all variables
		velocityRaptorR = false;
		velocityRaptorA = false;
		velocityRaptorP = false;
		velocityRaptorT = false;
		velocityRaptorO = false;
	}
});

document.addEventListener("keyup", function(e){
	if(e.keyCode == 38 || e.keyCode == 87){//		Up Arrow / W
		velocityRaptorUp = false;
	}
	if(e.keyCode == 40 || e.keyCode == 83){//		Down Arrow / S
		velocityRaptorDown = false;
	}
	if(e.keyCode == 37 || e.keyCode == 65){//		Left Arrow / A
		velocityRaptorLeft = false;
	}
	if(e.keyCode == 39 || e.keyCode == 68){//		Right Arrow / D
		velocityRaptorRight = false;
	}
});

// initializeVelocityRaptor();
function initializeVelocityRaptor(){
	if(velocityRaptorRunning)
		return;
	velocityRaptorR = false;
	velocityRaptorA = false;
	velocityRaptorP = false;
	velocityRaptorT = false;
	velocityRaptorO = false;
	console.log("activate velocity raptor mode");
	
	velocityRaptorRunning = true;
	
	localStorage.setItem("VelocityRaptorLoaded" , true);
	localStorage.setItem("VelocityRaptor" , `Title not shown
MT
-10,0
hideMax
3
x-sin(x*0.7+1.02)/40
(max(min(((x-0.2)*10000),1),0))*x
x+sin(x*0.7+1.04)/40
useNone
10,0
none
End`);

/*		My approximation of the curves used in the actual game:
x-sin(x*0.7+1.1)/11.3
(max(min(((x-0.2)*10000),1),0))*x
x+sin(x*0.7+1.1)/11.3

//		That madness of a second equation could be substituted for Y=x but the equation above makes it easy to stop without sliding at a really small but non-zero velocity

Some good baseline curves:
x*0.4
x*0.95
x+0.1


The ones I used in my quantum mechanics video:
x-0.2
max(x-0.03,0)
x+sin(x*0.535+1.54)/8
*/

	velocityRaptorSVGTemplate = document.createElement("p");
	// mainInput.setAttribute("contentEditable" , "true");
	velocityRaptorSVGTemplate.style = "position:absolute;left:0px;top:-16px; z-index: 20";//		above everything except input field

	
	velocityRaptorSVGTemplate.innerHTML = `<svg width="4000" height="2000" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<g id="raptor" transform="translate(-337.53 -731.97) scale(1 1)">
			<circle cx="411.3" cy="823.91" r="19.445" fill-opacity=".31313" style="paint-order:normal"/>
			<g stroke="#000">
				<g>
					<path d="m426.96 816.53s1.389-1.2627 4.0406-1.2627 6.2503 1.389 6.1872 6.4397c0 0-2.5254-2.5885-5.7452-1.389s-1.5784 2.5885-3.2199 3.283c-1.6415 0.69448-4.4699-0.95917-4.4699-0.95917" fill="#fff"/>
					<path d="m422.1 794.3s-0.0631 7.7656 1.6415 13.385c1.7046 5.619 3.2199 8.8388 3.2199 8.8388s-1.1996 1.2627-1.6415 2.7148c-0.44194 1.4521-0.31567 3.9775-0.31567 3.9775s-2.0203 0.69448-3.3461-0.75762c-1.3258-1.4521-4.4826-5.3664-6.3134-10.48s-1.894-13.984-1.894-13.984" fill="#369143"/>
					<path d="m457.88 783.25s3.2589 1.5625 3.0804 3.6161c-0.17857 2.0536-1.875 2.9018-1.875 2.9018s3.8718 0.35528 4.8508-2.8418c1.2946-4.0179-1.5025-5.4171-1.5025-5.4171" fill="#fff" stroke-width=".7"/>
					<path d="m442.18 781.68s7.0315-0.49107 10.692 0.0446c3.6607 0.53571 4.2857 1.7411 6.6964 1.6518 2.4107-0.0893 2.9464-0.44643 2.9464-1.2054s-1.1161-4.0179-7.5446-4.8661c-6.4286-0.84822-11.607-0.625-11.607-0.625" fill="#48cb59" stroke-width=".7"/>
					<path d="m434.35 767.4s0.53571-7.4107 0.44643-9.5536c-0.0893-2.1429-0.71428-9.9107-0.26785-13.125 0.44643-3.2143 5.2206-7.6693 7.7678-9.0179 3.0357-1.6072 9.727-1.7969 13.036-0.44644 4.375 1.7857 22.505 7.2831 22.768 14.821 0.26786 7.6786-4.8214 7.0536-7.1428 7.2321-2.3214 0.17858-16.518-0.17856-26.786-3.5714 0.17857 6.875 0.44643 14.107-0.0893 22.232-0.53571 10.089-7.222 17.76-12.232 19.196-5.5042 1.5786-13.631 1.2184-13.631 1.2184" fill="#48cb59"/>
					<path d="m399.71 816.33c4.061-0.32623 6.9244 0.51563 9.4497 3.1673s1.5784 4.9245 1.5784 4.9245-1.894-2.841-6.3766-3.1567c-4.4826-0.31568-5.4927 4.1037-5.4927 4.1037l-4.4267-0.46737-2.0089-5.8928" fill="#fff"/>
					<path d="m452.16 796.55s-0.3125 2.0982-1.5625 3.0804c-1.25 0.98214-4.6429 0.84821-4.6429 0.84821s4.6968 3.4286 7.6339 0.16741c2.9831-3.3122 1.1942-6.038 1.1942-6.038" fill="#fff" stroke-width=".7"/>
					<path d="m422.56 791.86s-3.6607 4.1964-5.7143 5.7143c-2.0536 1.5179-13.482 9.0179-14.821 11.429-1.3393 2.4107-2.3214 3.75-2.3214 7.3214-1.875 0.26786-2.9464 0.98214-3.75 2.8571-0.97533 2.2758-1.5178 5.7143-1.5178 5.7143s-3.5714-3.3036-3.8393-9.1071 1.4286-9.0179 3.3036-12.054 6.875-7.5 7.3214-8.3036 1.25-3.3929 0.26786-5.3572c-0.98214-1.9643-7.5-6.5178-15.714-7.6786-8.2143-1.1607-18.304-0.98215-23.571-2.5s-12.857-6.7857-15.179-9.4643c0 0 7.7679 2.3214 20.893 2.5s16.339-0.98215 16.339-0.98215l48.887 1.2015" fill="#48cb59"/>
					<path d="m436.75 779.66c0.1894 0.0947 6.1748 3.3224 10.55 6.5813s6.9196 6.6518 7.2321 7.4107 0.44643 2.2322-0.0446 2.6786c-0.49107 0.44643-1.8304 0.44643-2.6786 0.22322-0.84822-0.22322-4.5536-5-7.5-6.5625s-7.1429-5.0893-13.884-3.0357" fill="#48cb59" stroke-width=".7"/>
					<path d="m366.1 760.4c22.589 1.25 75.302 7.1057 77.024 7.8287s2.566 3.0087 0.78031 3.8122c-1.7857 0.80357-53.929 10.446-81.696 7.8571 12.143-5 19.196-5.7112 19.107-8.8393-0.0611-2.142-12.537-7.8016-15.215-10.659z" fill="#2f6bf1"/>
				</g>
				<ellipse cx="452.56" cy="741.59" rx="4.6404" ry="3.9775" fill="#fff" stroke-linejoin="round" stroke-width=".8" style="paint-order:normal"/>
				<circle cx="454.34" cy="741.59" r=".95982" stroke-linejoin="round" style="paint-order:normal"/>
			</g>
			<g fill="#d2d2d2" stroke="#000" stroke-width=".5">
				<path d="m457.4 749.86 1.9512 3.6955 2.8571-2.7679"/>
				<path d="m463.29 750.8 1.168 3.2514 1.5468-3.062"/>
				<path d="m468.25 751.21 1.4205 3.9775 1.6731-3.4093"/>
				<path d="m473.62 752.54 0.44194 2.9989 1.9256-1.7362"/>
			</g>
			<path d="m454.55 749.13s9.2922 1.5238 14.616 2.5885c5.3664 1.0733 6.0294 1.3258 8.3653 2.4307" fill="none" stroke="#000" stroke-width=".7"/>
		</g>
	</svg>`;
		document.body.appendChild(velocityRaptorSVGTemplate);

	
	currentLevelCode = "VelocityRaptor";
	loadLevel();
	
	console.log(velocityRaptorSVGTemplate);
	
	
	velocityRaptorSVG = document.getElementById('raptor')
	
	
	// console.log(velocityRaptorSVG);
	velocityRaptorUpdate();
	// console.log("vel");
}

function velocityRaptorUpdate(){
	if(velocityRaptorRunning)
		window.requestAnimationFrame(velocityRaptorUpdate);
	
	if(paused)
		return;
	
	//	----------------------------------		[   Draw velocity curves with 30x scale   ]		----------------------------------
	ctx.lineWidth = 3;
	if(velocityRaptorP)
		for(k = 2 ; k > -1 ; k--){
			ctx.strokeStyle = _colors[k] + "30";
			ctx.beginPath();
			//		this one is a do while loop instead of a for loop so it goes through 1 more iteration and there is no gap on the right side of the screen
			ctx.moveTo(0 , ((-pieEquCompiled[k].eval({x: screenx , t: frameTime , z: tempZ})) + screeny)*screenScale);
			i = lineResolution - lineResolution;
			do{
				i += lineResolution;
				//		absolute x and y position
				tmpx = i/screenScale + screenx;
				tmpy = -pieEquCompiled[k].eval({x: tmpx , t: frameTime , z: tempZ});
				//		scale along the line y=-x by about 27
				tmpx = tmpx*6.5 + tmpy*5.5;
				tmpy = tmpy*6.5 + tmpx*5.5;
				//		screen x and y position
				tmpx = (tmpx - screenx)*screenScale;
				tmpy = Math.min( Math.max(tmpy + screeny , -10)*screenScale , 2000);
				ctx.lineTo(tmpx , tmpy);
			}while(i < screenWidth);
			ctx.stroke();
		}
	
	
	
	ctx.font = "35px Arial";
	ctx.textAlign = "left";
	ctx.fillStyle = _gridTextColor;
	ctx.fillText("1m/s" , -screenx*screenScale-30 , (-1+screeny)*screenScale+5);
	ctx.fillText("1m/s" , (1-screenx)*screenScale-30 , screeny*screenScale+5);
	
	yEqualsText.innerHTML = '<p class="unselectable" style="font-size: 40px; font-family: Arial; color: black;"><a style="color:'+_colors[2]+
	'">v+</a><br><a style="color:'+_colors[1]+'">v=</a><br><a style="color:'+_colors[0]+'">v-</a></p>';
	
	if (paused)
		return;
	
	//		calculate the player's input vector
	velocityRaptorInputX = 0;
	velocityRaptorInputY = 0;
	if(velocityRaptorUp){
		velocityRaptorInputY = -1;
	}
	if(velocityRaptorDown){
		velocityRaptorInputY += 1;
	}
	if(velocityRaptorLeft){
		velocityRaptorInputX = -1;
	}
	if(velocityRaptorRight){
		velocityRaptorInputX += 1;
	}
	
	//		record the current input velocities. These are the X coordinates and the velocity values after the next operation will be their corresponding Y values.
	velocityRaptorOldVx = velocityRaptorVx;
	velocityRaptorOldVy = velocityRaptorVy;
	
	
	//	----------------------------------		[   Y Velocity   ]		----------------------------------
	
	if(velocityRaptorInputY == 0){//		neither or both vertical inputs are pressed
		velocityRaptorVy = math.sign(velocityRaptorVy) * pieEquCompiled[1].eval({x: math.abs(velocityRaptorVy)});//		use equation V=
		
	}else if(math.abs(velocityRaptorVy) < 0.1 || math.sign(velocityRaptorVy) - math.sign(velocityRaptorInputY)){//		not moving or moving in the same direction as input
		if(math.abs(velocityRaptorVy) < 0.1){//		if velocity raptor isn't moving, use the input's direction for the sign instead of the velocity's
			k = -velocityRaptorInputY;
		}else{
			k = math.sign(velocityRaptorVy);
		}
				
		velocityRaptorVy = k * pieEquCompiled[2].eval({x: math.abs(velocityRaptorVy)});//		use equation V+
		
	}else{//		currently moving in the opposite direction of the player's input
		velocityRaptorVy = math.sign(velocityRaptorVy) * pieEquCompiled[0].eval({x: math.abs(velocityRaptorVy)});//		use equation V-
	}
	
	
	//	----------------------------------		[   X Velocity   ]		----------------------------------
	
	if(velocityRaptorInputX == 0){//		neither or both vertical inputs are pressed
		velocityRaptorVx = math.sign(velocityRaptorVx) * pieEquCompiled[1].eval({x: math.abs(velocityRaptorVx)});//		use equation V=
		
	}else if(math.abs(velocityRaptorVx) < 0.1 || math.sign(velocityRaptorVx) + math.sign(velocityRaptorInputX)){//		not moving or moving in the same direction as input
		if(math.abs(velocityRaptorVx) < 0.1){//		if velocity raptor isn't moving, use the input's direction for the sign instead of the velocity's
			k = velocityRaptorInputX;
		}else{
			k = math.sign(velocityRaptorVx);
		}
				
		velocityRaptorVx = k * pieEquCompiled[2].eval({x: math.abs(velocityRaptorVx)});//		use equation V+
		
	}else{//		currently moving in the opposite direction of the player's input
		velocityRaptorVx = math.sign(velocityRaptorVx) * pieEquCompiled[0].eval({x: math.abs(velocityRaptorVx)});//		use equation V-
	}
	
	
	
	
	//	----------------------------------		[   Draw velocity to screen   ]		----------------------------------
	//			draw the current X point
	/*ctx.strokeStyle = "#FF0000";
	ctx.fillStyle = "#FF0000";
	
	if(velocityRaptorVx < 0){//		negative
		drawCircle(math.abs(velocityRaptorOldVx) , math.abs(velocityRaptorVx) , 3);
	}else{
		drawCircle(math.abs(velocityRaptorOldVx) , math.abs(velocityRaptorVx) , 5);
	}
	
	
	//			draw the current Y point
	ctx.strokeStyle = "#00FF00";
	ctx.fillStyle = "#00FF00";
	
	if(velocityRaptorVy < 0){//		negative
		drawCircle(math.abs(velocityRaptorOldVy) , math.abs(velocityRaptorVy) , 3);
	}else{
		drawCircle(math.abs(velocityRaptorOldVy) , math.abs(velocityRaptorVy) , 5);
	}*/
	
	
	//	----------------------------------		[   Calculate Raptor's Position   ]		----------------------------------
	
	if(slowMotion){//		10 times slower
		velocityRaptorVx = (velocityRaptorOldVx*9 + velocityRaptorVx)/10;
		velocityRaptorVy = (velocityRaptorOldVy*9 + velocityRaptorVy)/10;
		dt = 1/600;
	}else{
		dt = 1/60;
	}
	
	//		Offset raptor position based on velocity
	velocityRaptorX += velocityRaptorVx * dt;
	velocityRaptorY -= velocityRaptorVy * dt;
	
	velocityRaptorScale = (screenScale/100);
	
	tmpx = (velocityRaptorX - screenx)*screenScale - screenScale*0.75;//		screen position of the center of Velocity Raptor's shadow(in pixels)
	tmpy = (velocityRaptorY + screeny)*screenScale - screenScale*0.94;
	
	//		stop this dom element from going too far off the page
	tmpx = math.max( math.min(tmpx , 9000) , -5000);
	tmpy = math.max( math.min(tmpy , 9000) , -5000);
	
	
	//	----------------------------------		[   Draw To Screen   ]		----------------------------------
	
	velocityRaptorSVG.setAttribute("transform" , "translate(" + (velocityRaptorScale*-337.53 + tmpx) + " " + (velocityRaptorScale * -731.97 + tmpy) + ") scale(" + velocityRaptorScale + " " + velocityRaptorScale + ")");
	
	/*
	ctx.font = "35px Arial";
	ctx.textAlign = "left";
	ctx.fillStyle = _gridTextColor;
	ctx.fillText("Velocity.x = " + math.round(velocityRaptorVx*100)/100 , 10 , 30);
	ctx.fillText("Velocity.y = " + math.round(velocityRaptorVy*100)/100 , 10 , 80);
	*/
	
}














