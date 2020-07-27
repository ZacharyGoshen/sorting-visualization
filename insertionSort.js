// Perform insertion sort on the array and animate the process
function insertionSort() {
	for (var i = 1; i < values.length; i++) {
		var lowest = i;
		for (var j = i - 1; j > -1; j--) {
			if (values[j + 1] < values[j]) {
				var temp = values[j+ 1];
				values[j + 1] = values[j];
				values[j] = temp;
				lowest = j;
			}
		}
		insertSortAnimation(lowest, i);
	}
	for (var i = 0; i < values.length; i++) {
		funQueue.push(wrapFunction(colorBar, this, [i, barSortedColor]));
	}
	funQueue.push(wrapFunction(hidePauseButton, this, []));
	playAnimations(funQueue);
}

// Adds all the animations for one iteration of insertion sort to the animation queue
function insertSortAnimation(index1, index2) {
	// Move the bar being inserted down
	funQueue.push(wrapFunction(moveMultDivs, this, [[index2], [-1], [maxHeight]]));

	// Move all bars after the insertion one space to the right
	var curIndex = index2 - 1;
	while (curIndex >= index1) {
		var endX = (curIndex + 1) * (barWidth + 1);
		funQueue.push(wrapFunction(moveMultDivs, this, [[curIndex], [endX], [-1]]));
		curIndex--;
	}

	// Move the bar being inserted left and down into its new position
	var endX = index1 * (barWidth + 1);
	funQueue.push(wrapFunction(moveMultDivs, this, [[index2], [endX], [-1]]));
	funQueue.push(wrapFunction(moveMultDivs, this, [[index2], [-1], [0]]));
	
	// Reorder the divs so they remain ordered by horizontal position
	var i = index2;
	while (i > index1) {
		funQueue.push(wrapFunction(swapValues, this, [i, i - 1]));
		i--;
	}
}