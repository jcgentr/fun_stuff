/*
	Create pong using javascript
	Author: Jared Gentry
	This a code-along through "Code Your First Game" Udemy Course.
	Date Started: 1/13/2018
	Date Finished: 1/14/2018
*/

var canvas; // handles the dimensions of display area
var canvasContext; // images draw on canvas using this variable
// create ball's horizontal value
var ballX = 100;
// ball's speed in horizontal direction
var ballSpeedX = 25;
// create ball's vertical value
var ballY = 100;
// ball's speed in vertical direction
var ballSpeedY = 4;
var ballRadius = 10;

// keep track of score
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

// create variables for vertical position of paddles
var paddle1Y = 250;
var paddle2Y = 250;
// create a constant for the length and thickness of paddle
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

// make function to find mouse's position
function calculateMousePos(evt) {
	// when mouse moves event is passed in as argument
	// get the black background area of canvas
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	// returns mouse's position in game area regardless of scrolling on page
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return{ // return the mouse's x and y position
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt) {
	if (showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

// loads after the entire page loads in window
window.onload = function() {
	console.log("hello World!");
	// connect variable to html canvas display
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	var framesPerSecond = 30;
	// set speed for ball by calling drawEverything with desired interval (ms between each new frame)
	// 1000/framesPerSecond = frame rate (1000ms/desired frames each second)
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);

	// click to continue
	canvas.addEventListener('mousedown',handleMouseClick);

	// mouse moves the left paddle	
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);

		});
}

// create a function to reset ball
function ballReset() {
	// check for winning score
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
	}
	// reverse the ball's direction
	ballSpeedX = -ballSpeedX;
	ballSpeedY = -ballSpeedY*0.25;
	// reset ball to center of canvas
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

	// adjust left paddle down if it is too far above the ball (35 pixels)
	if(paddle2YCenter < ballY-35) {
		// move left paddle down towards ball
		paddle2Y += 15;
	// adjust paddle if it is too far below ball (35px)
	} else if(paddle2YCenter > ballY+35) {
		// move left paddle up towards ball
		paddle2Y -= 15;
	}
}

// create function for the ball and paddle movement
function moveEverything() {
	if (showingWinScreen) {
		return;
	}
	// move right computer paddle
	computerMovement();
	// change ballX's horizontal position
	ballX += ballSpeedX;
	// change ballX's vertical position
	ballY += ballSpeedY;

	// reset if ball hits right wall
	if (ballX+ballRadius >= canvas.width) {
		// if ball hits right paddle, then reverse ball's direction
		if (ballY >= paddle2Y && ballY <= paddle2Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			// change ball's vertical speed depending angle ball and paddle meet
			var deltaY = ballY-(paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.4;
		} else { // o/w left scored and ball is reset to center
			// increase score and check for winning score
			player1Score++; // goes BEFORE ballReset()
			ballReset();
		}
	}
	// reset if ball hits left wall
	if (ballX-ballRadius <= 0) {
		// if ball hits left paddle, then reverse ball's direction
		if (ballY >= paddle1Y && ballY <= paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			// change ball's vertical speed depending angle ball and paddle meet
			var deltaY = ballY-(paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else { // o/w right scored and ball is reset to center
			// increase score and check for winning score
			player2Score++; // goes BEFORE ballReset()
			ballReset();
		}
	}

	// reverse direction if ball hits bottom wall
	if (ballY+ballRadius >= canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
	// reverse direction if ball hits top wall
	if (ballY-ballRadius <= 0) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for (var i=0; i<canvas.height; i+=40) {
		colorRect(canvas.width/2 - 1,i,2,20,'white');
	}
}

// create function to group all draw code (drawEverything is camel-casing)
function drawEverything() {
	// create the background FIRST (first layer)
	colorRect(0,0,canvas.width,canvas.height,'black');
	if (showingWinScreen) {
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillStyle = 'white';
			canvasContext.fillText("Left Player Won!",350,200);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillStyle = 'white';
			canvasContext.fillText("Right Player Won!",350,200);
		}
		canvasContext.fillStyle = 'white';
		canvasContext.fillText("click to continue",350,500);
		return;
	}
	drawNet();
	// create a white paddle on left side
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
	// create a white paddle on right side
	colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
	// later objects created overlap previous objects
	// draw the ball
	colorCircle(ballX,ballY,ballRadius,'white');

	canvasContext.fillText(player1Score,100,100);
	canvasContext.fillText(player2Score,canvas.width-100,100);
}

// group draw round ball code into single function
function colorCircle(centerX,centerY,radius,drawColor) {
	// create a round ball
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
	canvasContext.fill();
}

// group draw code into single function
function colorRect(leftX,topY,width,height,drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY,width,height);
}