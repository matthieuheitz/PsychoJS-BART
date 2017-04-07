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
//  Data to send
var overalldata2send = "";
var balloondata2send = "";
// Time, latency
var experiment_start_time;
var experiment_end_time;
var balloon_start_time; // TODO
var balloon_end_time; // TODO

// Others
var task_completed=0;



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

	pID = document.getElementById("id_number").value;
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
	experiment_start_time = new Date();

	displayPart3();
}

function updateGameUI() {
	var image = document.getElementById("img_balloon");
	image.src = "img/" + balloonImage;
	image.style.width = Math.round( screen.width * (5 + numPumps) / (5.0 + 128.0)) +'px';
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
	appendBalloonDataToIndividualBuffer();

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
	experiment_end_time = new Date();
	task_completed = 1;

	// Send the data on the server
	sendBalloonData();
	prepareOverallDataToSend();
	sendOverallData();

	displayPart4();
}


function appendBalloonDataToIndividualBuffer() {
	// Data regarding one balloon
	balloondata2send += pID + ",";
	balloondata2send += trialIndex + ",";
	balloondata2send += maxRand + ",";
	balloondata2send += balloonImage + ",";
	balloondata2send += maxPumps + ",";
	balloondata2send += numPumps + ",";
	balloondata2send += balloonExploded + ",";
	balloondata2send += currentBalloonEarning + ",";
	balloondata2send += totalcurrentEarning + "\n";
}

function prepareOverallDataToSend() {

	// ID number
	console.log("ID : " + pID);
	overalldata2send += pID + ",";

	// Start date
	console.log("start date: " + experiment_start_time.getDay() +"/" + experiment_start_time.getMonth() + "/" + experiment_start_time.getFullYear() );
	overalldata2send += experiment_start_time.getDay() +"/" + experiment_start_time.getMonth() + "/" + experiment_start_time.getFullYear() + ",";

	// End date
	console.log("end date: " + experiment_end_time.getDay() +"/" + experiment_end_time.getMonth() + "/" + experiment_end_time.getFullYear() );
	overalldata2send += experiment_end_time.getDay() +"/" + experiment_end_time.getMonth() + "/" + experiment_end_time.getFullYear() + ",";

	// experiment_start_time
	console.log("start time :" + experiment_start_time.getHours() + ":" + experiment_start_time.getMinutes() + ":" + experiment_start_time.getSeconds());
	overalldata2send += experiment_start_time.getHours() + ":" + experiment_start_time.getMinutes() + ":" + experiment_start_time.getSeconds() + ",";

	// experiment_end_time
	console.log("end time :" + experiment_end_time.getHours() + ":" + experiment_end_time.getMinutes() + ":" + experiment_end_time.getSeconds());
	overalldata2send += experiment_end_time.getHours() + ":" + experiment_end_time.getMinutes() + ":" + experiment_end_time.getSeconds() + ",";

	// task_completed (0 or 1)
	console.log("task : " + task_completed);
	overalldata2send += task_completed + "\n";
}

function sendOverallData() {
	$.ajax({
	 type: "POST",
	 url: "write_overall_data.php",
	 data: { data : overalldata2send },
	 success: function(msg){
	     alert(msg);
	 },
	 error: function(XMLHttpRequest, textStatus, errorThrown) {
	    alert("Some error occured");
	 }
	 });
}

function sendBalloonData() {
	$.ajax({
	 type: "POST",
	 url: "write_balloon_data.php",
	 data: { data : balloondata2send },
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




