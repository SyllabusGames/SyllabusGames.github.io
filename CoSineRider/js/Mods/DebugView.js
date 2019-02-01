function showDebugItems(){
	//		DRAW LINE SO SLED CONTACT POINT
	ctx.strokeStyle="#00B0FF";
	ctx.lineWidth = 1;
	ctx.moveTo(apx*screenScale - screenx*screenScale , -apy*screenScale + screeny*screenScale-30);
	ctx.lineTo(apx*screenScale - screenx*screenScale , -apy*screenScale + screeny*screenScale);
	ctx.stroke();

	//		keep camera unlocked
	camLocked = false;
}

function drawPoint(xxxx , yyyy,colorrr = "#000000"){
	ctx.strokeStyle = colorrr;
	ctx.fillStyle = colorrr;
	ctx.beginPath();
	ctx.arc((xxxx - screenx)*screenScale , (-yyyy + screeny)*screenScale , 3 , 0 , _piTimes2);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}