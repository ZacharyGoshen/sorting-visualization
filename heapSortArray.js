// Perform heap sort on the array and animate the process
function heapSortArray() {
	// Build max heap
	for (var i = (Math.floor(values.length / 2) - 1); i >= 0; i--) {
		sinkRoot(i, values.length, true);
	}

	// Extract element from heap one by one
	for (i = values.length - 1; i > 0; i--) {
		temp = values[0];
		values[0] = values[i];
		values[i] = temp;
		heapSortAnimation(0, i);
		funQueue.push(wrapFunction(colorBar, this, [i, barSortedColor]));
		sinkRoot(0, i, false);
	}
	funQueue.push(wrapFunction(colorBar, this, [0, barSortedColor]));
	funQueue.push(wrapFunction(hidePauseButton, this, []));
	playAnimations(funQueue);
}

// Sinks the root of the tree down until all values underneath it are lower
function sinkRoot(i, n, buildingMaxHeap) {
	var largest = i;
	var left = (2 * i) + 1;
	var right = (2 * i) + 2;

	if (buildingMaxHeap == false) {
		funQueue.push(wrapFunction(colorBar, this, [i, "grey"]));
	}

	if ((left < n) && (values[left] > values[largest])) { // Left value is larger than root
		largest = left;
	} 
	if ((right < n) && (values[right] > values[largest])) { // Right value is larger than largest so far
		largest = right;
	}
	if (largest != i) { // If largest is not root
		var temp = values[i];
		values[i] = values[largest];
		values[largest] = temp;
		heapSortAnimation(i, largest);
		funQueue.push(wrapFunction(colorBar, this, [i, barDefaultColor]));

		// Recursively sinkRoot affected subtree
		if (buildingMaxHeap == true) { 
			sinkRoot(largest, n, true);
		} else {
			sinkRoot(largest, n, false);
		}
	} else {
		funQueue.push(wrapFunction(colorBar, this, [i, barDefaultColor]));
	}
}

function heapSortAnimation(index1, index2) {
	// Move left bar down and move right bar down twice as far
	funQueue.push(wrapFunction(moveMultDivs, this, [[index1, index2], [-1, -1], [maxHeight, (maxHeight * 2)]]));

	// Swap the horizontal positions of the two bars
	var bar1Left = parseInt(document.getElementsByClassName("sortBar")[index1].style.left);
	var bar2Left = parseInt(document.getElementsByClassName("sortBar")[index2].style.left);
	funQueue.push(wrapFunction(moveMultDivs, this, [[index1, index2], [bar2Left, bar1Left], [-1, -1]]));

	// Move both bars back to their original vertical positions
	funQueue.push(wrapFunction(moveMultDivs, this, [[index1, index2], [-1, -1], [0, 0]]));

	// Reorder the divs so they remain ordered by horizontal position
	funQueue.push(wrapFunction(swapValues, this, [index1, index2]));
}