// Configure the game

var pID = 0;
// Earnings
var totalcurrentEarning = 0;
var totalFinalEarning = 0;
var currentBalloonEarning = 0;
var lastBalloonEarning = 0;
var earningPerPump = 0.75;
// Random process
var numOfTrialTypes = 3;
var maxRandList = [8, 32, 128];
var maxRand;
var balloonImageList = ["blueBalloon.png", "redBalloon.png", "greenBalloon.png"];
var balloonImage;
var trialList = [];
var numOfTrials = 6;
var trialTypeIndex;
var trialIndex = 1;
// Balloons
var maxPumps;
var balloonExploded = false;
var numPumps = 0;
var start_time;
var end_time;
var task_completed=0;
var data2send;
// $( document ).ready(function() {
//     console.log( "ready!" );
// });



// function GetKey(event){
// 	var key_space = 32;
// 	var key_return = 13;

// 	if (event.keyCode == key_space && document.getElementById("game").style.display == 'block'){
//  		buttonClickedPumpBalloon();
// 	}
// 	else if (event.keyCode == key_return && document.getElementById("game").style.display == 'block'){
//  		buttonClickedCollectMoney();
// 	}
// }


// Pre-condition : a should be less than b
function randInt(a,b) { return Math.floor((Math.random() * b) + a); }

function populateTrialList() {
	for (i = 0; i < numOfTrials; i++) {
		trialList.push(Math.floor(i*numOfTrialTypes/numOfTrials));
	}
}



$( document ).ready(start);

function start() {
	console.log( "ready" );
	populateTrialList();

	displayPart1();
}

function setBalloonInitialState() {
	// Random process without replacement to choose the trial type
	var i = randInt(0,trialList.length-1);
	trialTypeIndex = trialList[i];
	trialList.splice(i,1);
	// Get trial variables
	maxRand = maxRandList[trialTypeIndex];
	balloonImage = balloonImageList[trialTypeIndex];
	// Random process with replacement to choose the max of pump for that balloon
	maxPumps = randInt(1,maxRand);

	currentBalloonEarning = 0;
	numPumps = 0;
	balloonExploded = false;
	updateGameUI();
}

function buttonClickedSendID() {

	var pID = document.getElementById("id_number").value;
	// If ID entered is invalid
	if( pID == "" || pID < 0 || pID > 300 || isNaN(pID)) {
		alert("Incorrect ID number. Please re-enter it.");
	}
	// If ID is valid, go to next part
	else {
		displayPart2();
	}
}

function buttonClickedStartGame() {
	// Start the balloon game
	setBalloonInitialState();
	start_time = new Date();
	displayPart3();
}

function updateGameUI() {
	var image = document.getElementById("img_balloon");
	image.src = "img/" + balloonImage;
	image.style.width = Math.round( screen.width * (5 + numPumps) / 100.0)+'px';
	image.style.height = 'auto';
	// document.getElementById("earning_by_pump").innerHTML = "Max pumps = " + maxPumps + ", trialTypeIndex = " + trialTypeIndex;
	document.getElementById("game_total_current_earning").innerHTML = "Total earned : $" + totalcurrentEarning;
	document.getElementById("game_last_balloon_earning").innerHTML = "Last balloon : $" + lastBalloonEarning;
}

function buttonClickedPumpBalloon() {
	if(++numPumps <= maxPumps) {
		currentBalloonEarning += earningPerPump;
		updateGameUI();
	} else {
		alert("Boom");
		balloonExploded = true;
		currentBalloonEarning = 0;
		balloonFinished();
	}
}

function buttonClickedCollectMoney() {
	totalcurrentEarning += currentBalloonEarning;
	lastBalloonEarning = currentBalloonEarning;
	balloonFinished();
}

function balloonFinished() {
	alert("You have earned $" + currentBalloonEarning + " total for this balloon.");

	if(++trialIndex <= numOfTrials) {
		buttonClickedStartGame();
	}
	else {
		totalFinalEarning = totalcurrentEarning;
		document.getElementById("game_balloon").style.display = 'none';
		document.getElementById("game_final_earning").innerHTML = "You have banked $" + totalFinalEarning + " overall in the game."
		document.getElementById("game_final_screen").style.display = 'block';
	}
}

function buttonClickedEndGame() {
	// TODO : If those two functions take time, make a wait screen
	end_time = new Date();
	task_completed = 1;
	prepareDataToSend();
	sendData();
	displayPart4();
}

function prepareDataToSend() {
	// Data needed to be sent :
	// 
	// Date of the day
	console.log("date: " + start_time.getDay() +"/" + start_time.getMonth() + "/" + start_time.getFullYear() );
	data2send = start_time.getDay() +"/" + start_time.getMonth() + "/" + start_time.getFullYear() + ";";

	// start_time
	console.log("start time :" + start_time.getHours() + ":" + start_time.getMinutes() + ":" + start_time.getSeconds());
	data2send += start_time.getHours() + ":" + start_time.getMinutes() + ":" + start_time.getSeconds() + ";";

	// end_time
	console.log("end time :" + end_time.getHours() + ":" + end_time.getMinutes() + ":" + end_time.getSeconds());
	data2send += end_time.getHours() + ":" + end_time.getMinutes() + ":" + end_time.getSeconds() + ";";

	// task_completed (0 or 1)
	console.log("task : " + task_completed);

	// ID number
	console.log("ID : " + pID);
	data2send += pID;

}

function sendData() {
	$.ajax({
	 type: "POST",
	 url: "write.php",
	 data: { data : data2send },
	 success: function(msg){
	     alert(msg);
	 },
	 error: function(XMLHttpRequest, textStatus, errorThrown) {
	    alert("Some error occured");
	 }
	 });
}

function displayPart1() {
	console.log( "part1 : setup" );

	document.getElementById("setup").style.display = 'block';
	document.getElementById("instructions").style.display = 'none';
	document.getElementById("game").style.display = 'none';
	document.getElementById("thankYou").style.display = 'none';
}

function displayPart2() {
	console.log( "part2 : Instructions" );

	document.getElementById("setup").style.display = 'none';
	document.getElementById("instructions").style.display = 'block';
	document.getElementById("game").style.display = 'none';
	document.getElementById("thankYou").style.display = 'none';
}

function displayPart3() {
	console.log( "part3 : BART" );

	document.getElementById("setup").style.display = 'none';
	document.getElementById("instructions").style.display = 'none';
	document.getElementById("game").style.display = 'block';
	document.getElementById("thankYou").style.display = 'none';

	document.getElementById("game_final_screen").style.display = 'none';
}

function displayPart4() {
	console.log( "part4 : Thank you" );

	document.getElementById("setup").style.display = 'none';
	document.getElementById("instructions").style.display = 'none';
	document.getElementById("game").style.display = 'none';
	document.getElementById("thankYou").style.display = 'block';
}




