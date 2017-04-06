// Configure the game

var pID = 0;
var totalcurrentEarning = 0;
var totalFinalEarning = 0;
var currentBalloonEarning = 0;
var pumpIncrement = 1;
var maxPump = 20;
var balloonExploded = false;
var numPumps = 0;
var balloonExploded = false;
var balloonIndex = 1;
var totalNumBalloons = 4;

// $( document ).ready(function() {
//     console.log( "ready!" );
// });

$( document ).ready(start);

function start() {
	console.log( "ready" );

	displayPart1();
}

function setBalloonInitialState() {
	currentBalloonEarning = 0;
	numPumps = 0;
	balloonExploded = false;
	updateGameUI();
}

function buttonClickedSendID() {

	var pID = document.getElementById("id_number").value;
	// If ID entered is invalid
	if( pID == "" || pID < 0 || pID > 300 ) {
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
	displayPart3();
}

function updateGameUI() {
	var image = document.getElementById("img_balloon");
	image.style.width = Math.round( screen.width * (5 + numPumps) / 100.0)+'px';
	image.style.height = 'auto';
	document.getElementById("game_total_current_earning").innerHTML = "Total earnings : $" + totalcurrentEarning;
	document.getElementById("game_current_balloon_earning").innerHTML = "Current earnings : $" + currentBalloonEarning;
}

function buttonClickedPumpBalloon() {
	if(++numPumps <= maxPump) {
		currentBalloonEarning += pumpIncrement;
		updateGameUI();
	} else {
		balloonExploded = true;
		currentBalloonEarning = 0;
		balloonFinished();
	}
}

function buttonClickedCollectMoney() {
	totalcurrentEarning += currentBalloonEarning;
	balloonFinished();
}

function balloonFinished() {
	document.getElementById("img_balloon").style.display = 'none';
	document.getElementById("game_balloon_final_earning").innerHTML = "You have earned $" + currentBalloonEarning + " total for this balloon.";
	document.getElementById("game_balloon_final_earning").style.display = 'block';
	// Temporization to let the person see the text of #game_balloon_final_earning
	setTimeout(function(){return true;},2000); // TODO : It does't work, other solution ?
	document.getElementById("img_balloon").style.display = 'block';
	document.getElementById("game_balloon_final_earning").style.display = 'none';


	if(++balloonIndex <= totalNumBalloons) {
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
	prepareDataToSend();
	sendData();
	displayPart4();
}

function prepareDataToSend() {
	// Data needed to be sent :
	// 
	// Date of the day
	// start_time
	// end_time
	// task_completed (0 or 1)
	// ID number
}

function sendData() {

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



