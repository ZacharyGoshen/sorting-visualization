// Perform selection sort on the array and animate the process
function selectionSort() {
	for (var i = 0; i < values.length; i++) {
		var lowestValues = [i];
		var lowest = i;
		for (var j = i + 1; j < values.length; j++) {
			if (values[j] < values[lowest]) {
				lowest = j;
				lowestValues.push(lowest);
			}
		}
		var temp = values[i];
		values[i] = values[lowest];
		values[lowest] = temp;
		selSortAnimation(i, lowest, lowestValues);
	}
	funQueue.push(wrapFunction(hidePauseButton, this, []));
	playAnimations(funQueue);
}

// Adds all the animations for one iteration of selection sort to the animation queue
function selSortAnimation(index1, index2, lowestValues) {

	var prevLowest = -1;
	var curLowest = index1;
	for (var i = index1; i < values.length; i++) {
		var removePrevHighlight = false;
		var isCurLowestValue = false;
		if ((i != index1) && ((i - 1) != curLowest)) { // Check if prev highlight should be removed
			removePrevHighlight = true;
		}
		if (lowestValues.includes(i)) { // Check if bar is the current lowest
			isCurLowestValue = true;
			prevLowest = curLowest;
			curLowest = i;
		}	
		funQueue.push(wrapFunction(highlightBar, this, [i, removePrevHighlight, isCurLowestValue, prevLowest]));
	}

	if (index1 != index2) { // Don't perform animation if bar is already in the correct place
		// Move left bar down and move right bar down twice as far
		funQueue.push(wrapFunction(moveMultDivs, this, [[index1, index2], [-1, -1], [maxHeight, (maxHeight * 2)]]));

		// Swap the horizontal positions of the two bars
		var bar1Left = parseInt(document.getElementsByClassName("sortBar")[index1].style.left);
		var bar2Left = parseInt(document.getElementsByClassName("sortBar")[index2].style.left);
		funQueue.push(wrapFunction(moveMultDivs, this, [[index1, index2], [bar2Left, bar1Left], [-1, -1]]));

		// Move both bars back to their original vertical positions
		funQueue.push(wrapFunction(moveMultDivs, this, [[index1, index2], [-1, -1], [0, 0]]));
	}

	if (index2 != values.length - 1) {
		funQueue.push(wrapFunction(colorBar, this, [values.length - 1, barDefaultColor]));
	}

	// Color the sorted bar and reorder the divs so they remain ordered by horizontal position
	funQueue.push(wrapFunction(swapValues, this, [index1, index2]));
	funQueue.push(wrapFunction(colorBar, this, [index1, barSortedColor]));
}

// Highlights the selected bar, and removes any previous highlights
function highlightBar(i, removePrevHighlight, isCurLowestValue, prevLowest) {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var curFrame = 0;
	var id = setInterval(frame, 1);
	function frame() {
		if (curFrame != numFrames) {
			curFrame++;
		} else {
			if (isCurLowestValue) {
				document.getElementsByClassName("sortBar")[i].style.backgroundColor = barHighlightColor;
				if (prevLowest != -1) {
					document.getElementsByClassName("sortBar")[prevLowest].style.backgroundColor = barDefaultColor;
				}
			} else {
				document.getElementsByClassName("sortBar")[i].style.backgroundColor = barHighlightColor;
			}

			if (removePrevHighlight == true) {
				document.getElementsByClassName("sortBar")[i - 1].style.backgroundColor = barDefaultColor;
			}

			clearInterval(id);
			playAnimations(funQueue);
		}
	}
}