var MMTime = -25;

function drawMainMenu(){
	//		pause the music
	themeEqu.pause();
	MMTime = -25;//		25=line length
	showSVGPoints = true;
	//		hide the 2d view
	xyzc.style.display="none";
	xyz2c.style.display="none";
}


function MMDrawLine(){

	ctx.clearRect(0 , 0 , screenWidth , screenHeight);
	ctx.fillStyle = "#000000";
	ctx.font = "100px Arial";
	ctx.fillText( "Co" , screenWidth/2-290 , screenHeight/4);
	ctx.font = "120px Arial";
	ctx.fillText( "s" , screenWidth/2-166 , screenHeight/4);
	ctx.font = "100px Arial";
	ctx.fillText( "ine Rider" , screenWidth/2-110 , screenHeight/4);
	ctx.font = "50px ArialBlack";
	ctx.fillText( "A Game of Learning Curves" , screenWidth/2-170 , screenHeight/4+50);

	MMTime += 0.2;
	ctx.lineWidth = 8;
	ctx.strokeStyle="#000000";
	ctx.beginPath();
	ctx.moveTo(20*MMTime , Math.max(-5 , -20*(-MMTime/(MMTime/8+0.3)-MMTime/12+Math.sin(MMTime/15)*2-screenHeight/40)));//		-x/(x/8+0.5)-x/8+sin(x/15)	//		20=screen scale
	for(dtmp = 0 ; dtmp < 25 ; dtmp += 0.5){//	25/0.5 verticies in line	//		25=line length
		ftmp = (MMTime + dtmp);
		ctx.lineTo(20*ftmp , Math.max(-5 , -20*(-ftmp/(ftmp/8+0.3)-ftmp/12+Math.sin(ftmp/15)*2-screenHeight/40)));//		20=screen scale
	}
	ctx.stroke();
	if(MMTime*20-25 > screenWidth){//		20=screen scale	//		25=line length
		MMTime = -25;//		20=screen scale
	}
}
