// Perform merge sort on the array and animate the process
function mergeSort() {
	copy = values.slice();
	values = mergeSortHelper(copy, 0, (copy.length - 1));
	for (var i = 0; i < values.length; i++) {
		funQueue.push(wrapFunction(colorBar, this, [i, barSortedColor]));
	}
	funQueue.push(wrapFunction(hidePauseButton, this, []));
	playAnimations(funQueue);
}

// Helper function for merge sort
function mergeSortHelper(array, start, end) {
	if (array.length > 1) { // Divide and conquer if more than one value
		var middle = Math.floor(array.length / 2);
		var left = mergeSortHelper(array.slice(0, middle), start, (start + middle - 1)); // Recursively sort left half
		var right = mergeSortHelper(array.slice(middle, array.length), (start + middle), end); // Recursively sort right half

		// Merge the left and right halves
		var merged = [];
		var order = []; // Keep track of order in which bars were merged
		while (left.length != 0 && right.length != 0) { // Both left and right still have values to be merged
			// Merge the first value in whichever half has the smaller first value
			if (left[0] < right[0]) { 
				merged.push(left.shift());
				order.push("left");
			} else {
				merged.push(right.shift());
				order.push("right");
			}
		}
		if (left.length == 0) { // No more values on left to be merged
			merged = merged.concat(right);
			for (var i = 0; i < right.length; i++) {
				order.push("right");
			}
		} else { // No more values on right to be merged
			merged = merged.concat(left);
			for (var i = 0; i < left.length; i++) {
				order.push("left");
			}
		}

		mergeSortAnimation(start, end, order);

		return merged;
	} else {
		return array;
	}
}

// Adds all the animations for one iteration of merge sort to the animation queue
function mergeSortAnimation(start, end, order) {
	// Move all selected bars down
	var indices = [];
	for (var i = start; i <= end; i++) {
		indices.push(i);
	}
	var endPosX = new Array(end - start + 1).fill(-1);
	var endPosY = new Array(end - start + 1).fill(2 * maxHeight);
	funQueue.push(wrapFunction(moveMultDivs, this, [indices, endPosX, endPosY]));

	var leftIndex = start; // Index of next bar from left half that needs to be merged
	var rightIndex = Math.ceil((start + end) / 2); // Index of next bar from right half that needs to be merged
	var mainIndex = start; // Index that the next bar will move to
	var barOrder = []; // Save the order in which the bars were merged

	while (order.length != 0) {
		var side = order.shift();
		if (side == "left") { // Bar from left half is merging
			var barIndex = leftIndex++;
		} else { // Bar from right half is mergin
			var barIndex = rightIndex++;
		}

		// Move the bar halfway back to its original vertical position
		funQueue.push(wrapFunction(moveMultDivs, this, [[barIndex], [-1], [maxHeight]]));

		// Move the bar horizontally to the next available space
		if (barIndex != mainIndex) { // Skip animation if bar does not need to be moved horizontally
			var posX = mainIndex * (barWidth + 1);
			funQueue.push(wrapFunction(moveMultDivs, this, [[barIndex], [posX], [-1]]));
		}
		mainIndex++;

		// Move the bar back to its original vertical position
		funQueue.push(wrapFunction(moveMultDivs, this, [[barIndex], [-1], [0]]));

		barOrder.push(barIndex);
	}

	// Reorder the divs so they remain ordered by horizontal position
	funQueue.push(wrapFunction(mergeSortFinishIteration, this, [start, barOrder]));
}

// Swaps the properties of all bars that were just animated so that divs remain ordered by their horizontal position
function mergeSortFinishIteration(start, barOrder) {
	// Make a copy of all that bars
	var barCopies = [];
	while (barOrder.length != 0) {
		barCopies.push(document.getElementsByClassName("sortBar")[barOrder.shift()].cloneNode(true));
	}

	// Replace unsorted elements with sorted copies
	var index = start;
	while (barCopies.length != 0) {
		document.getElementsByClassName("sortBar")[index].replaceWith(barCopies.shift());
		index++;
	}
	playAnimations(funQueue);
}