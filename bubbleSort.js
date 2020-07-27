// Perform bubble sort on the array and animate the process
function bubbleSort() {
	for (var i = values.length - 1; i > 0; i--) {
		var swaps = [];
		for (var j = 0; j < i; j++) {
			if (values[j] > values[j + 1]) {
				var temp = values[j];
				values[j] = values[j + 1];
				values[j + 1] = temp;
				swaps.push(j);
			}
		}
		bubbleSortAnimation(swaps, i);
	}
	funQueue.push(wrapFunction(hidePauseButton, this, []));
	playAnimations(funQueue);
}

// Adds all the animations for one iteration of bubble sort to the animation queue
function bubbleSortAnimation(swaps, last) {
	// Iterate through each pair of bars (left to right) that have not been sorted yet
	while (swaps.length != 0) {
		var index = swaps.shift();

		// Move the right bar down
		funQueue.push(wrapFunction(moveMultDivs, this, [[index + 1], [-1], [maxHeight]]));

		// Swap the horizontal positions of the left and right bars
		var bar1Left = parseInt(document.getElementsByClassName("sortBar")[index].style.left);
		var bar2Left = parseInt(document.getElementsByClassName("sortBar")[index + 1].style.left);
		funQueue.push(wrapFunction(moveMultDivs, this, [[index, index + 1], [bar2Left, bar1Left], [-1, -1]]));

		// Move the raised bar back up to its original vertical position
		funQueue.push(wrapFunction(moveMultDivs, this, [[index + 1], [-1], [0]]));

		// Reorder the divs so they remain ordered by horizontal position
		funQueue.push(wrapFunction(swapValues, this, [index, index + 1]));
	}

	// Color the sorted bar(s)
	if (last == 1) {
		funQueue.push(wrapFunction(colorBar, this, [0, barSortedColor]));
	}
	funQueue.push(wrapFunction(colorBar, this, [last, barSortedColor]));
}