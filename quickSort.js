// Perform quick sort on the array and animate the process
function quickSort() {
	quickSortHelper(0, (values.length  - 1));
	funQueue.push(wrapFunction(hidePauseButton, this, []));
	playAnimations(funQueue);
}

// Helper function for quick sort
function quickSortHelper(low, high) {
	if (low < high) { // Divide and conquer if more than one value
		var pivot = values[high]; // Set pivot as last value

		// Iterate through all values of the section and determine if they are less or greater than the pivot
		var left = [];
		var right = [];
		var pivotIndex = low;
		var order = [];
		for (var i = low; i < high; i++) {
			if (values[i] <= pivot) {
				left.push(values[i]);
				pivotIndex++;
				order.push("left");
			} else {
				right.push(values[i]);
				order.push("right");
			}
		}

		// Merge values left of the pivot, the pivot, and values right of the pivot
		values = values.slice(0, low).concat(left.concat(pivot, right), values.slice(high + 1, values.length));

		// Animate the partition
		quickSortAnimation(low, high, pivotIndex, order);

		// Recursively sort values to the left and right of the pivot
		quickSortHelper(low, pivotIndex - 1);
		quickSortHelper(pivotIndex + 1, high);
	} else {
		funQueue.push(wrapFunction(colorBar, this, [low, barSortedColor]));
	}
}


// Adds all the animations for one iteration of quick sort to the animation queue
function quickSortAnimation(start, end, pivotIndex, order) {
	// Move all selected bars down
	var indices = [];
	for (var i = start; i <= end; i++) {
		indices.push(i);
	}
	var endPosX = new Array(end - start + 1).fill(-1);
	var endPosY = new Array(end - start + 1).fill(2 * maxHeight);
	funQueue.push(wrapFunction(moveMultDivs, this, [indices, endPosX, endPosY]));

	// Color the bars based on which side of the partition they fall
	funQueue.push(wrapFunction(quickSortColorPartition, this, [start, end, pivotIndex, order.slice()]));

	// Move the partition halfway back to its original vertical position
	funQueue.push(wrapFunction(moveMultDivs, this, [[end], [-1], [maxHeight]]));

	// Move the partition horizontally to its new position
	if (end != pivotIndex) { // Skip animation if bar does not need to be moved horizontally
		var posX = pivotIndex * (barWidth + 1);
		funQueue.push(wrapFunction(moveMultDivs, this, [[end], [posX], [-1]]));
	}

	// Move the partition back to its original vertical position
	funQueue.push(wrapFunction(moveMultDivs, this, [[end], [-1], [0]]));

	var leftIndex = start; // Index of next available space before the partition
	var rightIndex = pivotIndex + 1; // Index of next available space after the partition
	var mainIndex = start; // Index that the next bar is coming from
	var barOrder = []; // Save the order in which the bars were merged

	while (order.length != 0) {
		var side = order.shift();
		if (side == "left") {
			var destIndex = leftIndex++;
		} else {
			var destIndex = rightIndex++;
		}

		// Move the partition halfway back to its original vertical position
		funQueue.push(wrapFunction(moveMultDivs, this, [[mainIndex], [-1], [maxHeight]]));

		// Move the partition horizontally to its new position
		if (mainIndex != destIndex) { // Skip animation if bar does not need to be moved horizontally
			var posX = destIndex * (barWidth + 1);
			funQueue.push(wrapFunction(moveMultDivs, this, [[mainIndex], [posX], [-1]]));
		}

		// Move the partition back to its original vertical position
		funQueue.push(wrapFunction(moveMultDivs, this, [[mainIndex], [-1], [0]]));

		barOrder.push(destIndex);
		mainIndex++;
	}
	barOrder.push(pivotIndex);
	funQueue.push(wrapFunction(quickSortFinishIteration, this, [start, pivotIndex, barOrder]));
}

// Seperates the bars into two colors based on which side of the partition they will end up on
function quickSortColorPartition(start, end, pivotIndex, order) {
	var i = start;
	while (i < end) {
		var side = order.shift();
		if (side == "left") {
			document.getElementsByClassName("sortBar")[i].style.backgroundColor = barDefaultColor;
		} else {
			document.getElementsByClassName("sortBar")[i].style.backgroundColor = barHighlightColor;
		}
		i++;
	}
	document.getElementsByClassName("sortBar")[i].style.backgroundColor = barSortedColor;
	playAnimations(funQueue);
}

// Swaps the properties of all bars that were just animated so that divs remain ordered by their horizontal position
function quickSortFinishIteration(start, pivotIndex, barOrder) {
	var i = start;
	var barCopies = [];
	while (i < (barOrder.length + start)) {
		if (i != barOrder.length + start - 1) {
			document.getElementsByClassName("sortBar")[i].style.backgroundColor = barDefaultColor;
		}
		barCopies.push(document.getElementsByClassName("sortBar")[i].cloneNode(true));
		i++;
	}

	while (barOrder.length != 0) {
		document.getElementsByClassName("sortBar")[barOrder.shift()].replaceWith(barCopies.shift());
	}
	playAnimations(funQueue);
}