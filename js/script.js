// Configure the game

var pID = 0;
// Earnings
var totalcurrentEarning = 0;
var totalFinalEarning = 0;
var currentBalloonEarning = 0;
var lastBalloonEarning = 0;
var earningPerPump = 0.05;
// Random process
var numOfTrialTypes = 3;
var maxRandList = [8, 32, 128];
var maxRand;
var balloonImageList = ["blueBalloon.png", "redBalloon.png", "greenBalloon.png"];
var balloonImage;
var trialList = [];
var numOfTrials = 6;
var trialTypeIndex;
var trialIndex = 0;
// Balloons
var maxPumps;
var balloonExploded = false;
var totalExplodedBalloons = 0;
var numPumps = 0;
var totalNumPumps = 0;
var totalNumPumpsForNonExplodedBalloons = 0;
var numBalloonsCompleted = 0;
//  Data to send
var overalldata2send = "";
var balloondata2send = "";
// Dates, times
var date_experience_start;
var date_game_start = 0;
var date_game_end;
var date_balloon_start;
var date_balloon_end;
var date_befFirstPump;
var time_befFirstPump;
var date_betwLastPumpAndCollect;
var time_betwLastPumpAndCollect;

// Others
var taskCompleted=0;



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
	time_befFirstPump = 0;
	time_betwLastPumpAndCollect = 0;
	date_balloon_start = new Date();
	date_befFirstPump = new Date();
}

function buttonClickedSendID() {

	pID = document.getElementById("id_number").value;
	// If ID entered is invalid
	if( pID == "" || pID < 0 || pID > 300 || isNaN(pID)) {
		alert("Incorrect ID number. Please re-enter it.");
	}
	// If ID is valid, go to next part
	else {
		date_experience_start = new Date();
		displayPart2();
	}
}

function startNewBalloon() {
	trialIndex++;
	// Start the balloon game
	setBalloonInitialState();

	displayPart3();
}

function buttonClickedStartGame() {
	date_game_start = new Date();
	startNewBalloon();
}

function updateGameUI() {
	var image = document.getElementById("img_balloon");
	image.src = "img/" + balloonImage;
	image.style.width = 'auto';
	image.style.height = Math.round( 2.0/3.0 * screen.height * (5 + numPumps) / (5.0 + 128.0)) +'px';
	// document.getElementById("earning_by_pump").innerHTML = "Max pumps = " + maxPumps + ", numPumps = " + numPumps;
	document.getElementById("game_total_current_earning").innerHTML = "Total earned : $" + totalcurrentEarning.toFixed(2);
	document.getElementById("game_last_balloon_earning").innerHTML = "Last balloon : $" + lastBalloonEarning.toFixed(2);
}

function buttonClickedPumpBalloon() {
	if(numPumps == 0) time_befFirstPump = dateDifferenceMinSecMil(date_befFirstPump,new Date());
	date_betwLastPumpAndCollect = new Date();

	if(++numPumps <= maxPumps) {
		currentBalloonEarning += earningPerPump;
		updateGameUI();
	} else {
		balloonExploded = true;
		totalExplodedBalloons++;
		currentBalloonEarning = 0;
		balloonFinished();
	}
}

function buttonClickedCollectMoney() {
	if(numPumps != 0) {
		time_betwLastPumpAndCollect = dateDifferenceMinSecMil(date_betwLastPumpAndCollect,new Date());
	} else {
		time_betwLastPumpAndCollect = 0;
	}

	totalcurrentEarning += currentBalloonEarning;
	lastBalloonEarning = currentBalloonEarning;
	balloonFinished();
}

function balloonFinished() {
	date_balloon_end = new Date();

	numBalloonsCompleted++;
	totalNumPumps += numPumps;
	if(!balloonExploded) {
		totalNumPumpsForNonExplodedBalloons += numPumps;
		alert("You have earned $" + currentBalloonEarning.toFixed(2) + " total for this balloon.");
	} else {
		alert("The balloon exploded ! You have earned $" + currentBalloonEarning.toFixed(2) + " total for this balloon.");
	}
	appendBalloonDataToIndividualBuffer();

	if(trialIndex < numOfTrials) {
		startNewBalloon();
	}
	else {
		finishGame();
	}
}

function finishGame() {
	totalFinalEarning = totalcurrentEarning;
	displayPart4();
}

function buttonClickedFinishExperiment() {
	date_game_end = new Date();

	taskCompleted = (numBalloonsCompleted == numOfTrials);

	// Send the data on the server
	if(balloondata2send != "") sendBalloonData();
	prepareOverallDataToSend();
	sendOverallData();

	displayPart5();
}

function buttonClickedExitGame() {
	if (confirm('Are you sure you want to exit the game?')) {
		finishGame();
	}
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function dateDifferenceMinSecMil(date0, date1) {
	var diff = new Date(date1-date0);;
	return pad(diff.getMinutes(),2)+":"+pad(diff.getSeconds(),2)+":"+pad(diff.getMilliseconds(),3);
}

function paddedDateDMY(date) {
	return pad(date.getDate(),2)+"/"+pad(date.getMonth()+1,2)+"/"+pad(date.getFullYear(),2);
}
function paddedDateHMS(date) {
	return pad(date.getHours(),2)+":"+pad(date.getMinutes(),2)+":"+pad(date.getSeconds(),2);
}

function appendBalloonDataToIndividualBuffer() {
	// Data regarding one balloon
	balloondata2send += pad(pID,3) + ",";
	balloondata2send += trialIndex + ",";
	balloondata2send += maxRand + ",";
	balloondata2send += maxPumps + ",";
	balloondata2send += numPumps + ",";
	balloondata2send += balloonExploded + ",";
	balloondata2send += currentBalloonEarning + ",";
	balloondata2send += totalcurrentEarning + ",";

	var time_totalOnBalloon = dateDifferenceMinSecMil(date_balloon_start,date_balloon_end);
	balloondata2send += time_totalOnBalloon + ",";

	balloondata2send += time_befFirstPump + ",";
	balloondata2send += time_betwLastPumpAndCollect + "\n";
}

function prepareOverallDataToSend() {

	var averageNumPumps = totalNumPumps/numBalloonsCompleted;
	var numNonExplodedBalloonsCompleted = numBalloonsCompleted - totalExplodedBalloons;
	var averageNumPumpsForNonExplodedBalloons = totalNumPumpsForNonExplodedBalloons/numNonExplodedBalloonsCompleted;

	// If the participant has exited the game before doing any balloon.
	if(date_game_start == 0 || numBalloonsCompleted == 0) {
		date_game_start = date_experience_start;
		averageNumPumps = 0; // replace NaN
		averageNumPumpsForNonExplodedBalloons = 0; // replace NaN
	}

	overalldata2send += pad(pID,3) + ",";
	overalldata2send += paddedDateDMY(date_game_start) + ",";
	overalldata2send += paddedDateHMS(date_game_start) + ",";
	overalldata2send += paddedDateHMS(date_game_end) + ",";
	overalldata2send += taskCompleted + ",";
	overalldata2send += numBalloonsCompleted + ",";
	overalldata2send += totalNumPumps + ",";
	overalldata2send += averageNumPumps + ",";
	overalldata2send += totalExplodedBalloons + ",";
	overalldata2send += numNonExplodedBalloonsCompleted + ",";
	overalldata2send += totalNumPumpsForNonExplodedBalloons + ",";
	overalldata2send += averageNumPumpsForNonExplodedBalloons + "\n";

}

function sendOverallData() {
	$.ajax({
	 type: "POST",
	 url: "write_overall_data.php",
	 data: { data : overalldata2send },
	 success: function(msg){
	     if(msg != "") alert(msg);
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
	     if(msg != "") alert(msg);
	 },
	 error: function(XMLHttpRequest, textStatus, errorThrown) {
	    alert("Some error occured");
	 }
	 });
}

function displayPart1() {
	console.log( "part1 : setup" );

	document.getElementById("exit_game").style.display = 'none';

	document.getElementById("setup").style.display = 'block';
	document.getElementById("instructions").style.display = 'none';
	document.getElementById("game").style.display = 'none';
	document.getElementById("thankYou").style.display = 'none';
}

function displayPart2() {
	console.log( "part2 : Instructions" );

	document.getElementById("exit_game").style.display = 'block';

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
	console.log( "part4 : End of game" );

	document.getElementById("exit_game").style.display = 'none';

	document.getElementById("setup").style.display = 'none';
	document.getElementById("instructions").style.display = 'none';
	document.getElementById("game").style.display = 'block';
	document.getElementById("thankYou").style.display = 'none';

	document.getElementById("game_final_earning").innerHTML = "You have banked $" + totalFinalEarning.toFixed(2) + " overall in the game."
	document.getElementById("game_balloon").style.display = 'none';
	document.getElementById("game_final_screen").style.display = 'block';
}

function displayPart5() {
	console.log( "part5 : Thank you" );

	document.getElementById("setup").style.display = 'none';
	document.getElementById("instructions").style.display = 'none';
	document.getElementById("game").style.display = 'none';
	document.getElementById("thankYou").style.display = 'block';
}




