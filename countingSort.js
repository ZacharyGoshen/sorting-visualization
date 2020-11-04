// Perform counting sort or radix sort on the array and animate the process
function countingSort(radix) {
	if (radix == false) {
		var iterations = 1;
	} else {
		var iterations = Math.floor(Math.log10(maxValue + 1));
	}

	for (var exponent = 0; exponent < iterations; exponent++) {
		if (radix == false) { // If performing normal counting sort
			counts = new Array(maxValue).fill(0)
			funQueue.push(wrapFunction(generateCountDisplay, this, [-1]));
		} else { // If performing radix sort
			counts = new Array(10).fill(0);
			funQueue.push(wrapFunction(generateCountDisplay, this, [exponent]));
		}

		// Iterate through each value and increment its corresponding count
		var prevCountBoxIndex = -1;
		var i = 0;
		for (i; i < values.length; i++) {
			var value = values[i];
			
			if (radix == false) { // If performing normal counting sort
				var countBoxIndex = value;
			} else { // If performing radix sort
				var countBoxIndex = Math.floor(value / Math.pow(10, exponent)) % 10;
			}

			counts[countBoxIndex] = counts[countBoxIndex] + 1;
			funQueue.push(wrapFunction(updateCountBox, this, [i, countBoxIndex, prevCountBoxIndex]));
			prevCountBoxIndex = countBoxIndex;
		}
		funQueue.push(wrapFunction(resetColors, this, [i - 1, prevCountBoxIndex]));

		// Iterate through all the count boxes and change their values to the sum of themselves and all of the lower count boxes
		if (radix == false) { // If performing normal counting sort
			for (i = 1; i <= maxValue; i++) {
				counts[i] = counts[i - 1] + counts[i];
			}
		} else { // If performing radix sort
			for (i = 1; i < 10; i++) {
				counts[i] = counts[i - 1] + counts[i];
			}
		}
		funQueue.push(wrapFunction(sumCountBoxes, this, []));

		// Sort each value by finding its corresponding count, decrementing the count, and moving the value to the resulting index
		prevCountBoxIndex = -1;
		var barDests = [];
		for (i = values.length - 1; i >= 0; i--) {
			var value = values[i];

			if (radix == false) { // If performing normal counting sort
				var countBoxIndex = value;
			} else { // If performing radix sort
				var countBoxIndex = Math.floor(value / Math.pow(10, exponent)) % 10;
			}

			var countBox = document.getElementsByClassName("countValue")[countBoxIndex];
			var destIndex = counts[countBoxIndex] - 1;
			barDests.push(destIndex);

			// Decrement count corresponding to the current bar being sorted
			counts[countBoxIndex] = counts[countBoxIndex] - 1;
			funQueue.push(wrapFunction(decrementCountBox, this, [countBoxIndex]));

			// Remove highlight from the previous iteration's count box
			if (prevCountBoxIndex != -1) {
				funQueue.push(wrapFunction(removeHighlightCountBox, this, [prevCountBoxIndex]));
			}

			// Move the bar from its starting position to the half down point
			funQueue.push(wrapFunction(moveMultDivs, this, [[i], [-1], [maxHeight]]));

			// Move the bar horizontally to its sorted position
			if (i != destIndex) { // Skip animation if bar does not need to be moved horizontally
				var posX = destIndex * (barWidth + 1);
				funQueue.push(wrapFunction(moveMultDivs, this, [[i], [posX], [-1]]));
			}

			// Move the bar from the half down point all the way down
			funQueue.push(wrapFunction(moveMultDivs, this, [[i], [-1], [2 * maxHeight]]));

			// Color bars as sorted if doing normal counting sort or final iteration of radix sort
			if (exponent == (iterations - 1)) {
				funQueue.push(wrapFunction(colorBar, this, [i, barSortedColor]));
			}

			prevCountBoxIndex = countBoxIndex;
		}

		// Reorder the divs so they remain ordered by horizontal position
		var valuesCopy = values.slice(0);
		i = values.length - 1;
		while (i >= 0) {
			values[barDests[values.length - 1 - i]] = valuesCopy[i];
			i--;
		}
		funQueue.push(wrapFunction(resetBarOrder, this, [barDests]));

		// Remove highlight from the last iteration's count box
		funQueue.push(wrapFunction(removeHighlightCountBox, this, [prevCountBoxIndex]));

		// Move all the sorted bars up to their original vertical position
		var indices = [];
		for (var i = 0; i < values.length; i++) {
			indices.push(i);
		}
		var endPosX = new Array(values.length).fill(-1);
		var endPosY = new Array(values.length).fill(0);
		funQueue.push(wrapFunction(moveMultDivs, this, [indices, endPosX, endPosY]));

		funQueue.push(wrapFunction(clearCountDisplay, this, []));
	}

	funQueue.push(wrapFunction(hidePauseButton, this, []));
	playAnimations(funQueue);
}

// Create a display for the counts of all possible values in the range from 0 to 99
function generateCountDisplay(exponent) {
	var countDiv = document.getElementById("countDiv");

	var leftHTML = "<div class=\"countBox\"><div class=\"countIndex\">";
	var rightHTML = "</div><div class=\"countValue\">0</div></div>";

	if (exponent == -1) { // If performing normal counting sort
		for (var i = 0; i < 100; i++) { // Generate row of count boxes
			countDiv.innerHTML += (leftHTML + i + rightHTML);
		}
	} else { // If performing radix sort
		for (var i = 0; i < 10; i++) { // Generate a count box for each digit (to some power of 10)
			countDiv.innerHTML += (leftHTML + (i * (Math.pow(10, exponent))) + rightHTML);
		}

		countBoxesPerRow = 10;
		countBoxRows = 1;
	}

	resizeDisplay();

	playAnimations(funQueue);
}

// Increment and highlight the updated count box
function updateCountBox(index, value, prevCountBoxIndex) {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var curFrame = 0;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) {
			curFrame++;
		} else {
			// Update count box and color
			var countBox = document.getElementsByClassName("countValue")[value];
			countBox.innerHTML = parseInt(countBox.innerHTML) + 1;
			countBox.style.backgroundColor = countBoxHighlightColor;
			if (prevCountBoxIndex != -1) {
				document.getElementsByClassName("countValue")[prevCountBoxIndex].style.backgroundColor = countBoxDefaultColor;
			}

			document.getElementsByClassName("sortBar")[index].style.backgroundColor = barHighlightColor;
			if (index != 0) {
				document.getElementsByClassName("sortBar")[index - 1].style.backgroundColor = barDefaultColor;
			}
			clearInterval(id);
			playAnimations(funQueue);
		}
	}
}

// Iterate through all the count boxes and change their values to the sum of themselves and all of the lower count boxes
function sumCountBoxes() {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	// Highlight first count box
	document.getElementsByClassName("countValue")[0].style.backgroundColor = countBoxHighlightColor;

	var curFrame = 0;
	var index = 1;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) {
			curFrame++;
		} else {
			if (index >= counts.length) { // All boxes have been summed
				// Remove highlight from last box
				document.getElementsByClassName("countValue")[index - 1].style.backgroundColor = countBoxDefaultColor;

				clearInterval(id);
				playAnimations(funQueue);
			} else { // Not all boxes have been summed
				// Update current count boxes value to be the sum of itself and the previous box
				var prevBox = document.getElementsByClassName("countValue")[index - 1];
				var curBox = document.getElementsByClassName("countValue")[index];
				curBox.innerHTML = parseInt(curBox.innerHTML) + parseInt(prevBox.innerHTML);

				// Highlight the current box and remove highlight from the previous box
				curBox.style.backgroundColor = countBoxHighlightColor;
				prevBox.style.backgroundColor = countBoxDefaultColor;

				index += 1;
				curFrame = 0;
				numFrames = framesPerAnimation; // Check if user changed animation speed
			}
		}
	}
}

// Change the given bar and count box back to their default color
function resetColors(barIndex, countBoxIndex) {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var curFrame = 0;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) {
			curFrame++;
		} else {
			document.getElementsByClassName("sortBar")[barIndex].style.backgroundColor = barDefaultColor;
			document.getElementsByClassName("countValue")[countBoxIndex].style.backgroundColor = countBoxDefaultColor;
			playAnimations(funQueue);
			clearInterval(id);
		}
	}
}

// Decrement and highlight the given count box
function decrementCountBox(index) {
	var countBox = document.getElementsByClassName("countValue")[index];
	countBox.innerHTML = parseInt(countBox.innerHTML) - 1;
	countBox.style.backgroundColor = countBoxHighlightColor;
	playAnimations(funQueue);
}

// Remove highlight from the given count box
function removeHighlightCountBox(index) {
	document.getElementsByClassName("countValue")[index].style.backgroundColor = countBoxDefaultColor;
	playAnimations(funQueue);
}

// Reorder the divs so they remain ordered by horizontal position
function resetBarOrder(swapOrder) {
	var barCopies = [];
	var index = values.length - 1;
	while (index >= 0) {
		barCopies.push(document.getElementsByClassName("sortBar")[index].cloneNode(true));
		index--;
	}

	while (swapOrder.length != 0) {
		document.getElementsByClassName("sortBar")[swapOrder.shift()].replaceWith(barCopies.shift());
	}
	playAnimations(funQueue);
}

// Remove the count box display
function clearCountDisplay() {
	document.getElementById("countDiv").innerHTML = "";
	playAnimations(funQueue);
}