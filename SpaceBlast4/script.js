var width = 0;
var height = 0;
var usecursor = false;
var mouseDown = false;
var canvas = document.getElementById('game');
var players = {1:{controlType:"none",shipX:1920/2,shipY:1080/2,shipVelX:0,shipVelY:0,gpid:1,bcharge:0},2:{controlType:"none",shipX:1920/2,shipY:1080/2,shipVelX:0,shipVelY:0,gpid:1,bcharge:0},3:{controlType:"none",shipX:1920/2,shipY:1080/2,shipVelX:0,shipVelY:0,gpid:1,bcharge:0},4:{controlType:"none",shipX:1920/2,shipY:1080/2,shipVelX:0,shipVelY:0,gpid:1,bcharge:0}};
var playerCount = 1;
var playing = false;
var scores = [];
var alive = [];
var names = ["Player 1","Player 2","Player 3","Player 4"];
var lboards = localStorage.getItem("lboards");
var lbnames = localStorage.getItem("lbnames");
var cred = [
"Background 1: http://wallpapercave.com/blue-space-wallpaper",
"Background 2: http://www.hbc333.com/nebula-wallpaper.html",
"Background 3: http://www.1zoom.net/Space/wallpaper/273492/z388.3/",
"Background 4: http://wallpaperswide.com/planet_earth-wallpapers.html",
"Background 5: http://www.pixelstalk.net/stars-wallpapers-hd/",
"Title Music: Extreme Ways by Moby from Jason Borne",
"All programming: Me"
];
var newnames = function() {
	var out = [];
	var n = ["Guy","Bob","Fred","Fregg","Jeff","Frank","The One","Bill","Frisk","Mario","Luigi","SampleText","Your Name","Dog","Cat","Bill Gates","Tim Cook","^ Sucks","1337","Bot"];
	for (i = 0; i < 10; i++) {
		out[i] = n[Math.floor(Math.random()*20)];
	}
	return out;
}
if (!lboards || typeof(lboards) != "string") {
	lboards = [10,9,8,7,6,5,4,3,2,1,0];
	lbnames = newnames();
	localStorage.lbnames = lbnames.toString();
	localStorage.lboards = lboards.toString();
} else {
	lboards = lboards.split(",");
	lbnames = lbnames.split(",");
}
var highscore = Number(lboards[0]);
var bestscore = 0;
var ranks = [];
var lastsong = "";
var display = "";
var gp;
var asteroids = [];
var asteroid = function() {
	var out = {x:Math.random()*1920,y:-400,r:Math.random()*360,spin:Math.random()*2-1,velX:Math.random()*6-3,velY:Math.random()*(bestscore/5)*2+(bestscore/10)+4,points:[]};
	var size = Math.random()*200+100;
	for (i = 0; i < 20; i++) {
		out.points[i] = Math.random()*10-5+size;
	}
	out.size = size;
	asteroids[asteroids.length] = out;
}
var gameloc = {titlefade:100,title: true,menutrans: false,menunum:1,bg:1,newbg:1,bganim:100,kbconnect:0,gstimer:0,dtimer:-1,endgame:false,lbtrans:-1,kbin:false};
var defaultbuttons = function() {return [{x:10,y:970,width:620,height:100,frame:0,text:"Start Game",fonth:0.5,exit:false,clickid:"mp"},{x:650,y:970,width:620,height:100,frame:0,text:"Leaderboards",fonth:0.5,exit:false,clickid:"lead"},{x:1290,y:970,width:620,height:100,frame:0,text:"Credits",fonth:0.5,exit:false,clickid:"cred"}];}
var buttons = defaultbuttons();
var mpselect = function() {
	var out = [
	{x:255,y:765,width:450,height:125,frame:0,text:"Back",fonth:0.5,exit:false,clickid:"title"},
	{x:735,y:765,width:450,height:125,frame:0,text:("Players: "+playerCount),fonth:0.5,exit:false,clickid:"plchange"},
	{x:1215,y:765,width:450,height:125,frame:0,text:"Begin!",fonth:0.5,exit:false,clickid:"start"}
	];
	for (i = 1; i <= playerCount; i++) {
		out[i+2] = {x:((i-1)*(1920/playerCount)),y:980,width:(1920/playerCount),height:100,frame:0,text:("Player "+i+" Options"),fonth:0.5,exit:false,clickid:("p"+i)};
	}
	return out;
}
var leaderboards = function() {
	return [{x:10,y:970,width:600,height:100,frame:0,text:"Back",fonth:0.5,exit:false,clickid:"title"},{x:1310,y:970,width:600,height:100,frame:0,text:"Reset Leaderboard",fonth:0.5,clickid:"resetlb"}];
}
var credits = function() {
	return [{x:10,y:970,width:400,height:100,frame:0,text:"Back",fonth:0.5,exit:false,clickid:"title"}];
}
var controls = function(p) {
	return [
		{x:255,y:765,width:450,height:125,frame:0,text:"Keyboard",fonth:0.5,exit:false,clickid:"keyboard"},
		{x:735,y:765,width:450,height:125,frame:0,text:"Mouse",fonth:0.5,exit:false,clickid:"mouse"},
		{x:1215,y:765,width:450,height:125,frame:0,text:"Controller",fonth:0.5,exit:false,clickid:"controller"},
		{x:((p-1)*(1920/playerCount)),y:980,width:(1920/playerCount),height:100,frame:0,text:"Back",fonth:0.5,exit:false,clickid:"mp"},
		{x:((playerCount-1)*-160+960) + 320*(p-1)-200,y:250,width:400,height:100,frame:0,text:names[gameloc.player-1],fonth:0.5,exit:false,clickid:"rename"}
	];
}
var resize = function() {
	if (document.webkitFullscreenElement != null) {
		if (window.innerWidth*9 < window.innerHeight*16) {
		width = window.innerWidth; height = window.innerWidth/16*9;
		} else {
		height = window.innerHeight; width = window.innerHeight*16/9;
		}
		document.getElementById('game').style.width = width;
		document.getElementById('game').style.height = height;
		canvas.style.cursor = "none";
		usecursor = true;
	} else {
		if (window.innerWidth*9 < window.innerHeight*16) {
		width = window.innerWidth; height = window.innerWidth/16*9;
		} else {
		height = window.innerHeight; width = window.innerHeight*16/9;
		}
		document.getElementById('game').style.width = width;
		document.getElementById('game').style.height = height;
		canvas.style.cursor = "none";
		usecursor = false;
	}
}
resize()
load = function() {
var gfx = canvas.getContext('2d');
var shipX = 1920/2;
var shipY = 1080/2;
var velMult = 0;
var dir = 0;
var hboost = false;
var shipVelX = 0;
var shipVelY = 0;
var Keys = {};
window.addEventListener('keydown',function (e){
	if (gameloc.kbin) {
		console.log(e);
		if (e.key == "Backspace") {
			names[gameloc.player-1] = names[gameloc.player-1].slice(0,-1);
			buttons[4] = {x:((playerCount-1)*-160+960) + 320*(gameloc.player-1)-200,y:250,width:400,height:100,frame:100,text:names[gameloc.player-1],fonth:0.5,exit:false,clickid:"rename"};
		} else if (e.key == "Enter" && names[gameloc.player-1].length > 0) {
			gameloc.kbin = false;
			sound("yes.wav");
		} else if (e.key.length == 1 && e.key != "," && names[gameloc.player-1].length < 10) {
			names[gameloc.player-1] = names[gameloc.player-1]+e.key;
			buttons[4] = {x:((playerCount-1)*-160+960) + 320*(gameloc.player-1)-200,y:250,width:400,height:100,frame:100,text:names[gameloc.player-1],fonth:0.5,exit:false,clickid:"rename"};
		}
	} else {
		Keys[e["key"]] = true;
		if (Keys["f"]) {
			canvas.webkitRequestFullscreen();
		}
		if (gameloc.kbconnect == 1) {
			sound("yes.wav");
			display = "Press the Right Button";
			gameloc.kbconnect++;
			players[gameloc.player].left = e.key;
		} else if (gameloc.kbconnect == 2) {
			sound("yes.wav");
			display = "Press the Up Button";
			gameloc.kbconnect++;
			players[gameloc.player].right = e.key;
		} else if (gameloc.kbconnect == 3) {
			sound("yes.wav");
			display = "Press the Down Button";
			gameloc.kbconnect++;
			players[gameloc.player].up = e.key;
		} else if (gameloc.kbconnect == 4) {
			sound("yes.wav");
			display = "Press the Boost Button";
			gameloc.kbconnect++;
			players[gameloc.player].down = e.key;
		} else if (gameloc.kbconnect == 5) {
			sound("yes.wav");
			display = "";
			gameloc.kbconnect = 0;
			players[gameloc.player].boost = e.key;
		}
	}
});
window.addEventListener('keyup',function(e) {
	Keys[e["key"]] = null;
});
var music = function(song) {
	if (lastsong != song) {
		if (song.slice(-3,song.length) == "wav") {
			document.getElementById("music").type = "audio/wav";
		} else {
			document.getElementById("music").type = "audio/mp3";
		}
		document.getElementById("music").src = song;
		document.getElementById("audio").load();
		lastsong = song;
	}
}
var sound = function(sound) {
	document.getElementById("sfx").src = sound;
	document.getElementById("sfxa").load();
}
var drawShip = function() {
	for (i = 1; i <= playerCount; i++) {
		if (alive[i-1]) {
			if ((i == 1) && (playerCount == 1)) {
				gfx.fillStyle = "#808080";
				gfx.strokeStyle = "#AFAFAF";
			} else if (i == 1) {
				gfx.fillStyle = "#000080";
				gfx.strokeStyle = "#0000AF";
			} else if (i == 2) {
				gfx.fillStyle = "#800000";
				gfx.strokeStyle = "#AF0000";
			} else if (i == 3) {
				gfx.fillStyle = "#008000";
				gfx.strokeStyle = "#00AF00";
			} else if (i == 4) {
				gfx.fillStyle = "#808000";
				gfx.strokeStyle = "#AFAF00";
			}
			gfx.globalAlpha = 1;
			gfx.lineWidth = 5;
			gfx.beginPath();
			gfx.moveTo(players[i]['shipX'],players[i]['shipY']);
			gfx.lineTo(players[i]['shipX']+50,players[i]['shipY']+20);
			gfx.lineTo(players[i]['shipX'],players[i]['shipY']-50);
			gfx.lineTo(players[i]['shipX']-50,players[i]['shipY']+20);
			gfx.closePath();
			gfx.fill();
			gfx.stroke();
			if (players[i]['hboost']) {
				var xoff = players[i]['shipX']+Math.cos(players[i]['dir']*Math.PI/180)*10*players[i]['bcharge'];
				var yoff = players[i]['shipY']+Math.sin(players[i]['dir']*Math.PI/180)*-10*players[i]['bcharge'];
				gfx.globalAlpha = 0.5;
				gfx.beginPath();
				gfx.moveTo(xoff,yoff);
				gfx.lineTo(xoff+50,yoff+20);
				gfx.lineTo(xoff,yoff-50);
				gfx.lineTo(xoff-50,yoff+20);
				gfx.closePath();
				gfx.fill();
				gfx.stroke();
				gfx.globalAlpha = 1;
			}
		}
	}
}
var playerView = function() {
	gfx.globalAlpha = 1;
	gfx.lineWidth = 12;
	for (i = 1; i <= playerCount; i++) {
		if ((gameloc.menunum == 3 && gameloc.player == i) || gameloc.menunum == 2) {
			var xoff = ((playerCount-1)*-160+960) + 320*(i-1);
			if ((i == 1) && (playerCount == 1)) {
				gfx.fillStyle = "#808080";
				gfx.strokeStyle = "#AFAFAF";
			} else if (i == 1) {
				gfx.fillStyle = "#000080";
				gfx.strokeStyle = "#0000AF";
			} else if (i == 2) {
				gfx.fillStyle = "#800000";
				gfx.strokeStyle = "#AF0000";
			} else if (i == 3) {
				gfx.fillStyle = "#008000";
				gfx.strokeStyle = "#00AF00";
			} else if (i == 4) {
				gfx.fillStyle = "#808000";
				gfx.strokeStyle = "#AFAF00";
			}
			gfx.beginPath();
			gfx.moveTo(xoff,540);
			gfx.lineTo(xoff+120,588);
			gfx.lineTo(xoff,420);
			gfx.lineTo(xoff-120,588);
			gfx.closePath();
			gfx.fill();
			gfx.stroke();
		}
	}
}
var drawButtons = function() {
	for (i = 0; i < buttons.length; i++) {
		gfx.lineWidth = 4;
		var button = buttons[i];
		if (((MouseX > button.x && MouseX <= (button.x+button.width)) && MouseY > button.y && MouseY <= (button.y+button.height) && !button.exit && document.webkitFullscreenElement != null) || (gameloc.kbin && i == 4)) {
			gfx.fillStyle = "#808080";
			gfx.strokeStyle = "#C0C0C0";
		} else {
			gfx.fillStyle = "#404040";
			gfx.strokeStyle = "#C0C0C0";
		}
		gfx.globalAlpha = button.frame/100;
		gfx.beginPath();
		gfx.rect(button.x,button.y,button.width,button.height);
		gfx.fill();
		gfx.globalAlpha = button.frame/50;
		gfx.stroke();
		gfx.font = Math.floor(button.height*button.fonth)+"px 'Roboto', sans-serif";
		gfx.textBaseline = "middle";
		gfx.textAlign = "center";
		if (((MouseX > button.x && MouseX <= (button.x+button.width)) && MouseY > button.y && MouseY <= (button.y+button.height) && !button.exit && document.webkitFullscreenElement != null) || (gameloc.kbin && i == 4)) {
			gfx.fillStyle = "black";
		} else {
			gfx.fillStyle = "white";
		}
		gfx.fillText(button.text,button.x+(button.width/2),button.y+(button.height/2));
	}
}
var textDraw = function(txt) {
	gfx.beginPath();
	gfx.font = "50px 'Roboto', sans-serif";
	gfx.textBaseline = "middle";
	gfx.textAlign = "center";
	var txtlen = gfx.measureText(txt).width+20;
	gfx.rect(960-txtlen/2,490,txtlen,100);
	gfx.fillStyle = "#808080";
	if (gameloc.dtimer >= 0 && gameloc.dtimer <= 100) {
		gfx.globalAlpha = 0.75*(gameloc.dtimer/100);
	} else {
		gfx.globalAlpha = 0.75;
	}
	gfx.fill();
	if (gameloc.dtimer >= 0 && gameloc.dtimer <= 100) {
		gfx.globalAlpha = gameloc.dtimer/100;
	} else {
		gfx.globalAlpha = 1;
	}
	gfx.fillStyle = "white";
	gfx.fillText(txt,960,540);
}
var drawScores = function() {
	gfx.beginPath();
	gfx.font = "40px 'Roboto', sans-serif";
	gfx.textBaseline = "middle";
	gfx.textAlign = "left";
	gfx.rect(0,0,360,50);
	gfx.fillStyle = "#808080";
	gfx.globalAlpha = 0.5;
	gfx.fill();
	gfx.globalAlpha = 1;
	gfx.fillStyle = "white";
	gfx.fillText("Highscore: "+highscore,10,25);
	for (i = 1; i <= playerCount; i++) {
		gfx.beginPath();
		gfx.rect(0,50*i,360,50);
		gfx.fillStyle = "#808080";
		gfx.globalAlpha = 0.5;
		gfx.fill();
		gfx.strokeStyle = "black";
		gfx.lineWidth = 1;
		if (ranks.length > 0 && scores[i-1] == ranks[ranks.length-1]) {
			gfx.fillStyle = "#FFBA00";
		} else if (ranks.length > 1 && scores[i-1] == ranks[ranks.length-2]) {
			gfx.fillStyle = "#DBDBDB";
		} else if (ranks.length > 2 && scores[i-1] == ranks[ranks.length-3]) {
			gfx.fillStyle = "#996012";
		} else {
			gfx.fillStyle = "#808080";
		}
		gfx.globalAlpha = 1;
		gfx.fillText(names[i-1]+": "+scores[i-1],10,25+50*i);
		gfx.strokeText(names[i-1]+": "+scores[i-1],10,25+50*i);
	}
}
var drawAsteroids = function() {
	gfx.globalAlpha = 1;
	gfx.strokeStyle = "#604733";
	gfx.fillStyle = "#A17957";
	gfx.lineWidth = 5;
	for (i = 0; i < asteroids.length; i++) {
		var a = asteroids[i];
		var p = a.points;
		gfx.beginPath();
		gfx.moveTo(a.x+Math.cos(a.r*(Math.PI/180))*p[0],a.y+Math.sin(a.r*(Math.PI/180))*p[0]);
		for (j = 1; j < 20; j++) {
			gfx.lineTo(a.x+Math.cos((18*j+a.r)*(Math.PI/180))*p[j],a.y+Math.sin((18*j+a.r)*(Math.PI/180))*p[j]);
		}
		gfx.closePath();
		gfx.fill();
		gfx.stroke();
	}
}
var drawLboard = function() {
	gfx.font = "40px 'Roboto', sans-serif";
	gfx.textBaseline = "middle";
	gfx.strokeStyle = "black";
	gfx.lineWidth = 1;
	for (i = -1; i <= Math.floor(gameloc.lbtrans/10)-2; i++) {
		var text = "";
		gfx.beginPath();
		if (i == -1) {
			text = "Highscores";
			gfx.fillStyle = "#A0A0A0";
			gfx.textAlign = "center";
			gfx.globalAlpha = 0.8;
		} else {
			text = lbnames[i]+": "+lboards[i];
			gfx.fillStyle = "#808080";
			gfx.textAlign = "left";
			gfx.globalAlpha = 0.5;
		}
		gfx.rect(640,15+50*(i+1),640,50);
		gfx.fill();
		if (i == 0) {
			gfx.fillStyle = "#FFBA00";
		} else if (i == 1) {
			gfx.fillStyle = "#DBDBDB";
		} else if (i == 2) {
			gfx.fillStyle = "#996012";
		} else {
			gfx.fillStyle = "white";
		}
		gfx.globalAlpha = 1;
		if (i == -1) {
			gfx.fillText(text,960,40+50*(i+1));
		} else {
			gfx.fillText(text,660,140+50*(i-1));
			gfx.strokeText(text,660,140+50*(i-1));
		}
	}
	if (gameloc.lbtrans%10 > 0) {
		gfx.beginPath();
		if (Math.floor(gameloc.lbtrans/10) == 0) {
			gfx.globalAlpha = 0.8;
			gfx.fillStyle = "#A0A0A0";
		} else {
			gfx.globalAlpha = 0.5;
			gfx.fillStyle = "#808080";
		}
		gfx.rect(960-(gameloc.lbtrans%10)*32,-35+50*(Math.floor(gameloc.lbtrans/10)+1),640*((gameloc.lbtrans%10)/10),50);
		gfx.fill();
	}
}
var drawCredits = function() {
	gfx.fillStyle = "white";
	gfx.font = "40px 'Roboto', sans-serif";
	gfx.globalAlpha = gameloc.bganim/100;
	gfx.textBaseline = "middle";
	gfx.textAlign = "left";
	for (i = 0; i < cred.length; i++) {
		gfx.fillText(cred[i],50,50+i*50);
	}
}
var updateScreen = function() {
	gfx.globalCompositeOperation = "source-over";
	gfx.clearRect(0,0,1920,1080);
	gfx.globalAlpha = gameloc.bganim/100;
	gfx.drawImage(document.getElementById("bg"),0,0,1920,1080);
	gfx.globalAlpha = gameloc.titlefade/100;
	gfx.drawImage(document.getElementById('title'),0,0,1920,1080);
	if (playing) {
		drawShip();
	}
	if (asteroids.length > 0) {
		drawAsteroids();
	}
	drawButtons();
	gfx.globalAlpha = 1;
	if (gameloc.menunum == 2 || gameloc.menunum == 3) {
		playerView();
	}
	if (display.length != 0) {
		textDraw(display);
	}
	if (playing || gameloc.endgame) {
		drawScores();
	}
	if (gameloc.gstimer >= 50 && gameloc.gstimer <= 400) {
		gfx.globalAlpha = (100-(gameloc.gstimer-300))/100;
		gfx.beginPath();
		gfx.rect(0,0,1920,1080);
		gfx.fillStyle = "black";
		gfx.fill();
	}
	if (gameloc.lbtrans >= 0) {
		drawLboard();
	}
	if (gameloc.menunum == 5 && gameloc.bg == gameloc.newbg) {
		drawCredits();
	}
	if (usecursor) {
		gfx.globalAlpha = 1;
		gfx.drawImage(document.getElementById('cursor'),MouseX,MouseY)
	}
	requestAnimationFrame(updateScreen);
}
var MouseX = 0;
var MouseY = 0;
canvas.addEventListener('mousemove',function(e) {
	MouseX = e.layerX/window.width*1920;
	MouseY = (e.layerY-(window.height-window.width/1920*1080)/2)/window.height*1080;
});
updateScreen();
var moveShip = function() {
	for (i = 1; i <= playerCount; i++) {
		if (alive[i-1]) {
			if ((players[i])['controlType'] == "keyboard") {
				var x = 0;
				var y = 0;
				if (Keys[players[i]['left']]) {
					x--;
				}
				if (Keys[players[i]['right']]) {
					x++;
				}
				if (Keys[players[i]['up']]) {
					y++;
				}
				if (Keys[players[i]['down']]) {
					y--;
				}
				velMult = 1;
				if ((y == 1) && (x == 1)) {
					dir = 45;
				} else if ((x == 1) && (y == -1)) {
					dir = 315;
				} else if ((y == -1) && (x == -1)) {
					dir = 225;
				} else if ((x == -1) && (y == 1)) {
					dir = 135;
				} else if (y == 1) {
					dir = 90;
				} else if (y == -1) {
					dir = 270;
				} else if (x == 1) {
					dir = 0;
				} else if (x == -1) {
					dir = 180;
				} else {
					velMult = 0;
				}
				if (Keys[(players[i]['boost'])]) {
					hboost = true;
				} else {
					hboost = false;
				}
			} else if (players[i]['controlType'] == "mouse") {
				if (document.webkitFullscreenElement != null && (Math.sqrt((MouseY-players[i]['shipY'])*(MouseY-players[i]['shipY'])+(MouseX-players[i]['shipX'])*(MouseX-players[i]['shipX'])) > 50)) {
				velMult = 1;
				} else {
					velMult = 0;
				}
				if (mouseDown & (document.webkitFullscreenElement != null)) {
					hboost = true;
				} else {
					hboost = false;
				}
				dir = Math.atan2((MouseY-players[i]['shipY'])*-1,(MouseX-players[i]['shipX']))/(Math.PI/180);
			} else if (players[i]['controlType'] == "gamepad") {
				if (gp[(players[i]['gpid'])]) {
					var axis = gp[(players[i]['gpid'])]['axes'];
					var buttons = gp[(players[i]['gpid'])]['buttons'];
					if (buttons[0].value == 1) {
						hboost = true;
					} else {
						hboost = false;
					}
					if ((Math.abs(axis[0]) < 0.1) && (Math.abs(axis[1]) < 0.1)) {
						axis[0] = 0;
						axis[1] = 0;
					}
					dir = Math.atan2(axis[1]*-1,axis[0])/(Math.PI/180);
					velMult = Math.sqrt((axis[0]*axis[0])+(axis[1]*axis[1]));
				} else {
					dir = 0;
					velMult = 0;
					hboost = false;
				}
			}
			if (hboost) {
				if (players[i]['bcharge'] < 50) {
					players[i]['bcharge'] += 0.04;
					players[i]['bcharge'] *= 1.05;
				} else {
					players[i]['bcharge'] = 50;
				}
			} else {
				velMult += players[i]['bcharge'];
				players[i]['bcharge'] /= 2;
				players[i]['shipVelX'] += Math.cos(dir*Math.PI/180)*2*velMult;
				players[i]['shipVelY'] += Math.sin(dir*Math.PI/180)*-2*velMult;
			}
			players[i]['hboost'] = hboost;
			players[i]['dir'] = dir;
			players[i]['shipVelX'] *= 0.9;
			players[i]['shipVelY'] *= 0.9;
			players[i]['shipX'] += players[i]['shipVelX'];
			players[i]['shipY'] += players[i]['shipVelY'];
			if (players[i]['shipX'] < 50) {
				players[i]['shipX'] = 50;
			} else if (players[i]['shipX'] > 1870) {
				players[i]['shipX'] = 1870;
			}
			if (players[i]['shipY'] > 1060) {
				players[i]['shipY'] = 1060;
			} else if (players[i]['shipY'] < 50) {
				players[i]['shipY'] = 50;
			}
		}
	}
}
var fadebuttons = function() {
	gameloc.menutrans = true;
	for (i = 0; i < buttons.length; i++) {
		buttons[i].exit = true;
	}
}
window.addEventListener("gamepadconnected", function(e) {
	if (gameloc.gpconnect) {
		players[gameloc.player].controlType = "gamepad";
		players[gameloc.player].gpid = e.gamepad.index;
		sound("yes.wav");
		display = "";
		gameloc.gpconnect = false;
	}
});
var clickf =function(clickid) {
	if (clickid == "mp") {
		gameloc.endgame = false;
		if (gameloc.menunum == 1) {
			sound("yes.wav");
		} else {
			sound("no.wav");
		}
		gameloc.title = false;
		gameloc.menunum = 2;
		gameloc.newbg = 2;
		gameloc.lbtrans = -1;
		music("menu.wav");
		fadebuttons();
	} else if (clickid == "title") {
		gameloc.title = true;
		gameloc.menunum = 1;
		gameloc.newbg = 1;
		gameloc.lbtrans = -1;
		music("music.mp3");
		sound("no.wav");
		fadebuttons();
	} else if (clickid == "plchange") {
		playerCount++;
		if (playerCount > 4) {
			playerCount = 1;
		}
		buttons = mpselect();
		sound("yes.wav");
	} else if (clickid == "p1" || clickid == "p2" || clickid == "p3" || clickid == "p4") {
		gameloc.menunum = 3;
		gameloc.player = Number(clickid.charAt(1));
		sound("yes.wav");
		fadebuttons();
	} else if (clickid == "start") {
		var condition = false;
		for (i = 1; i <= playerCount; i++) {
			condition = condition || (players[i].controlType == "none");
		}
		if (condition) {
			sound("no.wav");
			display = "One or more players do not have controls set!";
			gameloc.dtimer = 300;
		} else {
			sound("yes.wav");
			music("");
			gameloc.menunum = 6;
			gameloc.newbg = 5;
			fadebuttons();
		}
	} else if (clickid == "mouse") {
		players[gameloc.player].controlType = "mouse";
		sound("yes.wav");
	} else if (clickid == "controller") {
		sound("yes.wav");
		gameloc.dtimer = -1;
		display = "Connect/Reconnect Your Controller";
		gameloc.gpconnect = true;
	} else if (clickid == "keyboard") {
		sound("yes.wav");
		gameloc.dtimer = -1;
		display = "Press the Left Button";
		gameloc.kbconnect = 1;
		players[gameloc.player].controlType = "keyboard";
	} else if (clickid == "lead") {
		sound("yes.wav");
		gameloc.title = false;
		gameloc.newbg = 3;
		music("menu.wav");
		gameloc.menunum = 4;
		gameloc.lbtrans = 0;
		fadebuttons();
	} else if (clickid == "cred") {
		sound("yes.wav");
		gameloc.title = false;
		gameloc.newbg = 4;
		music("menu.wav");
		gameloc.menunum = 5;
		fadebuttons();
	} else if (clickid == "resetlb") {
		highscore = 10;
		sound("no.wav");
		gameloc.lbtrans = 0;
		lboards = [10,9,8,7,6,5,4,3,2,1,0];
		lbnames = newnames();
		localStorage.lboards = lboards.toString();
		localStorage.lbnames = lbnames.toString();
	} else if (clickid == "rename") {
		gameloc.kbin = true;
		sound("yes.wav");
		display = "Enter New Name";
		gameloc.dtimer = 200;
	}
}
var click = function() {
	for (i = 0; i < buttons.length; i++) {
		var button = buttons[i];
		if ((MouseX > button.x && MouseX <= (button.x+button.width)) && MouseY > button.y && MouseY <= (button.y+button.height) && !button.exit && !gameloc.gpconnect && gameloc.kbconnect == 0 && !gameloc.kbin) {
			clickf(button.clickid);
		}
	}
}
canvas.addEventListener('click',function(e) {
	if (document.webkitFullscreenElement) {
		click();
	}
});
var menus = function() {
	if (buttons.length == 0 && gameloc.menutrans) {
		gameloc.menutrans = false;
		if (gameloc.menunum == 1) {
			buttons = defaultbuttons();
		} else if (gameloc.menunum == 2) {
			buttons = mpselect();
		} else if (gameloc.menunum == 3) {
			buttons = controls(gameloc.player);
		} else if (gameloc.menunum == 4) {
			buttons = leaderboards();
		} else if (gameloc.menunum == 5) {
			buttons = credits();
		} else if (gameloc.menunum == 6) {
			gameloc.gstimer = 1;
		}
	}
}
var setbg = function(background) {
	if (background == 1) {
		document.getElementById("bg").src = "bg3.jpg";
	} else if (background == 2) {
		document.getElementById("bg").src = "bg2.jpg";
	} else if (background == 3) {
		document.getElementById("bg").src = "bg4.jpg";
	} else if (background == 4) {
		document.getElementById("bg").src = "bg.jpg"
	} else if (background == 5) {
		document.getElementById("bg").src = "bg5.jpg"
	}
}
var startgame = function() {
	for (i = 1; i <= playerCount; i++) {
		players[i].shipX = (1920/(playerCount+1))*i;
		players[i].shipY = 810;
		players[i].shipVelX = 0;
		players[i].shipVelY = 0;
	}
	for (i = 0; i < playerCount; i++) {
		scores[i] = 0;
		alive[i] = true;
	}
	bestscore = 0;
	playing = true;
	music("ingame.wav");
}
var moveAsteroids = function() {
	for (i = 0; i < asteroids.length; i++) {
		var a = asteroids[i]
		a.r += a.spin;
		a.x += a.velX;
		a.y += a.velY;
		if (a.y >= 1480) {
			asteroids.splice(i,1);
			i--;
		}
	}
}
var collision = function() {
	for (i = 1; i <= playerCount; i++) {
		if (alive[i-1]) {
			var cond = false;
			gfx.beginPath();
			gfx.moveTo(players[i]['shipX'],players[i]['shipY']);
			gfx.lineTo(players[i]['shipX']+50,players[i]['shipY']+20);
			gfx.lineTo(players[i]['shipX'],players[i]['shipY']-50);
			gfx.lineTo(players[i]['shipX']-50,players[i]['shipY']+20);
			gfx.closePath();
			for (j = 0; j < asteroids.length; j++) {
				var a = asteroids[j];
				var point = a.points;
				var angle = Math.atan2((players[i]["shipY"]-a.y),(players[i]["shipX"]-a.x));
				cond = cond || gfx.isPointInPath(a.x+Math.cos(angle)*a.size,a.y+Math.sin(angle)*a.size);
				if (cond) {
					break;
				}
			}
			if (cond) {
				alive[i-1] = false;
			}
		}
	}
} 
var processing = function() {
	if(navigator.webkitGetGamepads) {
		gp = navigator.webkitGetGamepads();
	} else {
		gp = navigator.getGamepads();
	}
	if (playing) {
		moveShip();
	}
	for (i = 0; i < buttons.length; i++) {
		if (buttons[i].exit) {
			buttons[i].frame -= 1;
			if (buttons[i].frame <= 0) {
				buttons.splice(i,1);
				i--;
			}
		} else {
			buttons[i].frame += 1;
			if (buttons[i].frame > 50) {
				buttons[i].frame = 50;
			}
		}
	}
	if (gameloc.title) {
		if (gameloc.titlefade < 100) {
			gameloc.titlefade++;
		}
	} else {
		if (gameloc.titlefade > 0) {
			gameloc.titlefade--;
		}
	}
	if (gameloc.bganim < 100 && gameloc.bg == gameloc.newbg) {
		gameloc.bganim++;
	} else if (gameloc.bganim > 0 && gameloc.bg != gameloc.newbg) {
		gameloc.bganim--;
		if (gameloc.bganim == 0) {
			gameloc.bg = gameloc.newbg;
			setbg(gameloc.bg);
		}
	}
	if (gameloc.gstimer > 0) {
		gameloc.gstimer++;
		if (gameloc.gstimer == 300) {
			startgame();
		} else if (gameloc.gstimer == 400) {
			gameloc.gstimer = 0;
		}
	}
	if (playing) {
		collision();
		bestscore += 0.01;
		bestscore = Math.round(bestscore*100)/100;
		if (bestscore > highscore) {
			highscore = bestscore;
		}
		for (i = 0; i < playerCount; i++) {
			if (alive[i]) {
				scores[i] = bestscore;
			}
		}
	}
	if (gameloc.dtimer > 0) {
		gameloc.dtimer--;
	} else if (gameloc.dtimer == 0) {
		display = "";
		gameloc.dtimer = -1;
	}
	if (playing && ((Math.floor(Math.random()*(200/(bestscore/10))) == 0 && asteroids.length < 4) || asteroids.length == 0)) {
		asteroid();
	}
	if (playing) {
		ranks = [];
		for (i = 0; i < playerCount; i++) {
			var index = 0;
			for (j = ranks.length-1; j >= 0; j--) {
				if (ranks[j] < scores[i]) {
					index = j+1;
					break;
				} else if (ranks[j] == scores[i]) {
					index = -1;
					break;
				}
			}
			if (index != -1) {
				ranks.splice(index,0,scores[i]);
			}
		}
	}
	if (asteroids.length > 0) {
		moveAsteroids();
	}
	if (gameloc.lbtrans >= 0 && gameloc.lbtrans < 110) {
		gameloc.lbtrans++;
		gameloc.lbtrans = Math.round(gameloc.lbtrans*100)/100;
	}
	if (playing && !(alive[0] || alive[1] || alive[2] || alive[3])) {
		playing = false;
		gameloc.endgame = true;
		gameloc.lbtrans = 0;
		buttons = [{x:760,y:970,width:400,height:100,frame:0,text:"Back",fonth:0.5,exit:false,clickid:"mp"}];
		for (j = 0; j < playerCount; j++) {
			for (i = 0; i < 10; i++) {
				if (scores[j] > lboards[i]) {
					lboards.splice(i,0,scores[j]);
					lboards[10] = null;
					lboards.pop();
					lbnames.splice(i,0,names[j]);
					lbnames[10] = null;
					lbnames.pop();
					break;
				}
			}
		}
		localStorage.lbnames = lbnames.toString();
		localStorage.lboards = lboards.toString();
	}
	menus();
}
setInterval(processing,10);
}