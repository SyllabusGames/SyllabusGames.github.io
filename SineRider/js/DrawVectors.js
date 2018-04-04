function drawForceVectors(){
	//		Draw force from line moving
	ctx.strokeStyle="#FF0000";
	ctx.beginPath();
	ctx.moveTo(spx , spy);
	ctx.lineTo(spx-tmspx*200/screenScale , spy);
	ctx.stroke();

	ctx.strokeStyle="#00FF00";
	ctx.beginPath();
	ctx.moveTo(spx , spy);
	ctx.lineTo(spx ,spy+tmspy*200/screenScale);
	ctx.stroke();
		
	ctx.strokeStyle="#0000FF";
	ctx.beginPath();
	ctx.moveTo(spx , spy);
	ctx.lineTo(spx-tmspx*200/screenScale , spy+tmspy*200/screenScale);
	ctx.stroke();

	ctx.fillText("X = " + Math.round(apx).toString() + "m",10,150);
	ctx.fillText("Y = " + Math.round(apy).toString() + "m",10,200);
}