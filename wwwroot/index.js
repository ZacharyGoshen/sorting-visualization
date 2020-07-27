// Queue to hold animation functions
var funQueue = [];

// Parameters for animation speed and display size
var minValue = 0;
var maxValue = 99;
var heightScale = 1.5;
var maxHeight = Math.floor(heightScale * (maxValue + 50));
var framesPerAnimation = 50;

// Color schemes
var barDefaultColor = "#1a1a1a";
var barHighlightColor = "#404040"
var barSortedColor = "#4CAF50";

var values = [];
var barWidth;
var hideValues;

// Counting/Radix sort parameters
var counts = [];
var countBoxWidth;
var countBoxHeight;
var countDivRowHeight;
var countBoxRows;
var countBoxesPerRow;
var countBoxHighlightColor = "#4CAF50";
var countBoxDefaultColor = "#1a1a1a";

// Top/side nav parameters
var topNavHeight = 50;
var sideNavWidth = 150;
var displayWindowPadding = 20;

// Track if animations are running
var paused = false;
var animationRunning = false;

window.onresize = resizeDisplay;

generateValues();

// Generate and display a new array of values
function generateValues() {
	endAlgorithm();

	// Create an array of random values between 0 and 99
	values = [];
	numValues = parseInt(document.getElementById("sizeInput").value);
	for (var i = 0; i < numValues; i++) {
		newValue = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
		values.push(newValue);
	}

	resizeDisplay();

	// Render the array as a group of vertical bars with heights corresponding to the values
	var sortingDiv = document.getElementById("sortingDiv");
	sortingDiv.innerHTML = "";
	for (var i = 0; i < values.length; i++) {
		var value = "";
		if (!hideValues) {
			value = values[i];
		}
		sortingDiv.innerHTML += "<div class=\"sortBar\">" + value + "</div>";
		document.getElementsByClassName("sortBar")[i].style.top = 0 + "px";
		document.getElementsByClassName("sortBar")[i].style.left = i * (barWidth + 1) + "px";
		document.getElementsByClassName("sortBar")[i].style.width = barWidth + "px";
		document.getElementsByClassName("sortBar")[i].style.height = Math.floor((values[i] * heightScale) + 50) + "px";
	}
}

// Change the speed at which the animations play
function changeFramesPerAnimation() {
	framesPerAnimation = parseInt(document.getElementById("framesPerAnimationInput").value);
	framesPerAnimation = 101 - framesPerAnimation;
}

// Wrapper function to allow animation functions to be passed to a queue so they can be played one after another
function wrapFunction(fn, context, params) {
	return function() {
		fn.apply(context, params);
	}
}

// Plays all the animations in the queue
function playAnimations(funQueue) {
	if (funQueue.length != 0) {
		if (paused == false) {
			(funQueue.shift())();
		}
	}
}

// Resize the display based on the window size
function resizeDisplay() {
	var windowWidth = parseInt(window.innerWidth);
	var windowHeight = parseInt(window.innerHeight);

	var displayDiv = document.getElementById("sortingDiv");

	var displayWidth = windowWidth - sideNavWidth - (2 * displayWindowPadding);
	barWidth = Math.floor((displayWidth / values.length) - 1); // Largest width bars can have and still fit in display
	countBoxWidth = Math.floor((displayWidth / 50) - 1); // Largest width count boxes can have and still fit in display

	if (barWidth > 30) {
		barWidth = 30;
		hideValues = false;
	} else {
		hideValues = true;
	}

	displayWidth = ((barWidth + 1) * values.length) - 1; // Trim display size to perfectly fit bars

	// Offset to center bars within remaining space
	var leftOffset = Math.floor(((windowWidth - sideNavWidth - (2 * displayWindowPadding)) / 2) - (displayWidth / 2));

	var displayHeight = windowHeight - topNavHeight; // Window height minus top nav height

	displayDiv.style.width = displayWidth + "px";
	displayDiv.style.height = displayHeight + "px";
	displayDiv.style.left = sideNavWidth + displayWindowPadding + leftOffset + "px";

	var countDiv = document.getElementById("countDiv");
	var countDivRow1 = document.getElementsByClassName("countDivRow")[0];
	var countDivRow2 = document.getElementsByClassName("countDivRow")[1];

	countDivRowHeight = countBoxRows * countBoxWidth;
	countDiv.style.left = sideNavWidth + "px";
	countDiv.style.top = - (2 * countDivRowHeight) + "px";
	countDivRow1.style.height = countDivRowHeight + "px";
	countDivRow2.style.height = countDivRowHeight + "px";

	leftOffset = (windowWidth - sideNavWidth - ((countBoxWidth + 1) * countBoxesPerRow)) / 2;
	countDivRow1.style.left = leftOffset + "px";
	countDivRow2.style.left = leftOffset + "px";
}

// Pause or resume the animation
function pauseOrResume() {
	var pauseButton = document.getElementById("pauseButton");
	if (paused == false) {
		paused = true;
		pauseButton.innerHTML = "Resume"
	} else {
		paused = false;
		pauseButton.innerHTML = "Pause"
		playAnimations(funQueue);
	}
}

// Hide the pause button
function hidePauseButton() {
	document.getElementById("pauseButton").style.visibility = "hidden";
}

// Start the selected algorithm's animation
function startAlgorithm(i) {
	if (animationRunning == false) {
		animationRunning = true;
		document.getElementById("pauseButton").style.visibility = "visible";

		if (i == 0) {
			selectionSort();
		} else if (i == 1) {
			insertionSort();
		} else if (i == 2) {
			bubbleSort();
		} else if (i == 3) {
			mergeSort();
		} else if (i == 4) {
			quickSort();
		} else if (i == 5) {
			heapSortArray();
		} else if (i == 6) {
			heapSortTree();
		} else if (i == 7) {
			countingSort(false);
		} else if (i == 8) {
			countingSort(true);
		} else {

		}
	}
}

// End the running algorithm
function endAlgorithm() {
	animationRunning = false;
	funQueue = [];
	document.getElementById("pauseButton").style.visibility = "hidden";
	clearCountDisplay();
}