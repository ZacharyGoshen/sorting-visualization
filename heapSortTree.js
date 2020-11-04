function heapSortTree() {
	funQueue.push(wrapFunction(shortenBars, this, [])); // Hide values and shorten bars into squares
	funQueue.push(wrapFunction(roundBars, this, [])); // Round squares into circles

	// Move each node to position in tree
	for (var i = values.length - 1; i >= 0; i--) {
		funQueue.push(wrapFunction(moveNodeToPositionInTree, this, [i]));
	}
	funQueue.push(wrapFunction(expandNodes, this, [values.slice(0)])); // Expand node and show value

	// Build max heap
	for (var i = (Math.floor(values.length / 2) - 1); i >= 0; i--) {
		sinkRoot2(i, values.length, false);
	}

	// Extract element from heap one by one
	for (i = values.length - 1; i > 0; i--) {
		temp = values[0];
		values[0] = values[i];
		values[i] = temp;
		funQueue.push(wrapFunction(swapNodes, this, [0, i]));
		funQueue.push(wrapFunction(swapValues, this, [0, i]));
		funQueue.push(wrapFunction(colorBar, this, [i, barSortedColor]));
		sinkRoot2(0, i, false);
	}
	funQueue.push(wrapFunction(colorBar, this, [i, barSortedColor]));
	funQueue.push(wrapFunction(shrinkNodes, this, []));

	for (i = 0; i < values.length; i++) {
		funQueue.push(wrapFunction(moveNodeToSortedPosition, this, [i]));
	}
	funQueue.push(wrapFunction(squareNodes, this, []));
	funQueue.push(wrapFunction(lengthenBars, this, []));
	funQueue.push(wrapFunction(hidePauseButton, this, []));
	playAnimations(funQueue);
}

// Animation that shortens all bars simultaneously
function shortenBars() {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var endHeight = barWidth; // Height of all bars at end of animation

	var shrinkRates = [];
	var bars = [];
	var heights = [];
	for (var i = 0; i < values.length; i++) {
		// Store height of bar before being shrunk
		var height = values[i] + 50;
		heights.push(height);

		// Calculate how much each bar must shrink during each frame so they all reach their end height during the same frame
		shrinkRates.push((height - endHeight) / numFrames);

		// Temporarily store bar to avoid searching for it every frame
		var bar = document.getElementsByClassName("sortBar")[i];
		bars.push(bar);

		// Remove value text from bar
		bar.innerHTML = "";
	}

	var curFrame = 0;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) {
			for (var i = 0; i < values.length; i++) { // Shrink each bar by shrink rate
				heights[i] -= shrinkRates[i];
				bars[i].style.height = Math.round(heights[i]) + "px";
			}
			curFrame++;
		} else {
			clearInterval(id);
			playAnimations(funQueue); // Play next animation in queue
		}
	}
}

// Animation that rounds all bars simultaneously so that they become a circle after a given number of frames
function roundBars() {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var radius = barWidth / 2; // Radius of circles after animation
	var roundRate = radius / numFrames; // Rate at which the corners round per frame

	var bars = [];
	for (var i = 0; i < values.length; i++) {
		// Temporarily store bar to avoid searching for it every frame
		var bar = document.getElementsByClassName("sortBar")[i];
		bars.push(bar);
	}

	var curFrame = 0;
	var curRadius = 0;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) {
			curRadius += roundRate;
			for (var i = 0; i < values.length; i++) { // Slightly round the corners of each bar
				bars[i].style.borderRadius = Math.round(curRadius) + "px";
			}
			curFrame++;
		} else {
			clearInterval(id);
			playAnimations(funQueue); // Play next animation in queue
		}
	}
}

// Animation that moves the node to its position in the tree
function moveNodeToPositionInTree(i) {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation
	
	// Calculate number of pixels between the top value of a node in one row and the top value of a node in the row below it
	var sortingDivHeight = parseInt(document.getElementById("sortingDiv").style.height);
	var numRows = Math.floor(Math.log2(values.length)) + 1; 
	var pixBetwRows = sortingDivHeight / (numRows + 1);

	var totalHorizDist = parseInt(window.innerWidth) - sideNavWidth; // Total horizontal distance of the animation window

	var node = document.getElementsByClassName("sortBar")[i];

	var startTop = parseInt(node.style.top); // Top value of node before animation

	var row = Math.floor(Math.log2(i + 1)); // Row in tree that node will move to
	var endTop = (pixBetwRows * (row + 1)) - (barWidth / 2); // Top value of node after animation
	endTop -= (barWidth / 2); // Move node slightly up so its center is at the calculated vertical position

	var vertChangeRate = (endTop - startTop) / numFrames; // Rate at which node moves vertically per frame

	var startLeft = parseInt(node.style.left); // Left value of node before animation
	var rowIndex = i - Math.pow(2, row) + 1; // Index of node in its row

	var nodesInRow = Math.pow(2, row); // Number of nodes in the node's row
	var pixBetwNodes = totalHorizDist / (nodesInRow + 1); // Number of pixels between the lefts of each node in the row
	var endLeft = Math.round(pixBetwNodes * (rowIndex + 1)) - (barWidth / 2); // Left value of node after animation
	var sortingDivWidth = parseInt(document.getElementById("sortingDiv").style.width);
	endLeft -= Math.floor((totalHorizDist - sortingDivWidth) / 2);

	var horizChangeRate = (endLeft - startLeft) / numFrames; // Rate at which node moves horizontally per frame

	var curFrame = 0;
	var curTop = startTop;
	var curLeft = startLeft;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) { // Slightly modify the top and left values of the node
			curTop += vertChangeRate;
			curLeft += horizChangeRate;
			node.style.top = Math.round(curTop) + "px";
			node.style.left = Math.round(curLeft) + "px";
			curFrame++;
		} else {
			clearInterval(id);
			playAnimations(funQueue); // Play next animation in queue
		}
	}
}

// Animation that doubles the radius of each node and displays its value
function expandNodes(values) {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var totalHorizDist = parseInt(window.innerWidth) - sideNavWidth; // Total horizontal distance of the animation window
	var maxNodesInLastRow = Math.pow(2, Math.floor(Math.log2(values.length))); // Number of nodes in last row of heap if it was full
	var pixBetwNodes = totalHorizDist / (maxNodesInLastRow + 1);
	var maxRadius = Math.floor((pixBetwNodes / 2) - 1); // Largest radius nodes can have without overlapping

	var startRadius = barWidth / 2; // Radius of circles before animation
	var endRadius;
	if (barWidth > maxRadius) {
		endRadius = maxRadius;
	} else {
		endRadius = barWidth; // Radius of circles after animation
	}
	var growthRate = (endRadius - startRadius) / numFrames; // Rate at which the nodes' radii grow per frame

	var nodes = [];
	var curTops = [];
	var curLefts = [];
	for (var i = 0; i < values.length; i++) {
		// Temporarily store node to avoid searching for it every frame
		var node = document.getElementsByClassName("sortBar")[i];
		nodes.push(node);
		curTops.push(parseInt(node.style.top));
		curLefts.push(parseInt(node.style.left));
	}

	var curFrame = 0;
	var curRadius = startRadius;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) {
			curRadius += growthRate;
			for (var i = 0; i < values.length; i++) { // Slightly expand each node
				nodes[i].style.borderRadius = Math.round(curRadius) + "px";
				nodes[i].style.width = Math.round(curRadius * 2) + "px";
				nodes[i].style.height = Math.round(curRadius * 2) + "px";

				// Prevent node from drifting when expanding
				curTops[i] -= growthRate;
				curLefts[i] -= growthRate;
				nodes[i].style.top = Math.round(curTops[i]) + "px";
				nodes[i].style.left = Math.round(curLefts[i]) + "px";
			}
			curFrame++;
		} else {
			for (var i = 0; i < values.length; i++) { // Add value text to each node
				nodes[i].innerHTML = values[i];
				nodes[i].style.lineHeight = (2 * endRadius) + "px";
				var width = parseInt(nodes[i].style.width);
				if (width < 25) {
					nodes[i].innerHTML = "<p class=\"nodeValueText\">" + values[i] + "</p>";
					nodes[i].style.color = barDefaultColor;
				}
			}
			clearInterval(id);
			playAnimations(funQueue); // Play next animation in queue
		}
	}
}

// Swap the positions of two nodes
function swapNodes(index1, index2) {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation
	
	var node1 = document.getElementsByClassName("sortBar")[index1];
	var node2 = document.getElementsByClassName("sortBar")[index2];

	var node1StartTop = parseInt(node1.style.top); // Top value of node1 before animation
	var node2StartTop = parseInt(node2.style.top); // Top value of node2 before animation

	var vertChangeRate = (node1StartTop - node2StartTop) / numFrames; // Rate at which nodes move vertically per frame

	var node1StartLeft = parseInt(node1.style.left); // Left value of node1 before animation
	var node2StartLeft = parseInt(node2.style.left); // Left value of node2 before animation

	var horizChangeRate = (node1StartLeft - node2StartLeft) / numFrames; // Rate at which nodes move horizontally per frame

	var curFrame = 0;
	var curTop1 = node1StartTop;
	var curTop2 = node2StartTop;
	var curLeft1 = node1StartLeft;
	var curLeft2 = node2StartLeft;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) { // Slightly modify the top and left values of the node
			curTop1 -= vertChangeRate;
			curTop2 += vertChangeRate;
			curLeft1 -= horizChangeRate;
			curLeft2 += horizChangeRate;
			node1.style.top = Math.round(curTop1) + "px";
			node2.style.top = Math.round(curTop2) + "px";
			node1.style.left = Math.round(curLeft1) + "px";
			node2.style.left = Math.round(curLeft2) + "px";
			curFrame++;
		} else {
			clearInterval(id);
			playAnimations(funQueue); // Play next animation in queue
		}
	}
}

// Sinks the root of the tree down until all values underneath it are lower
function sinkRoot2(i, n, buildingMaxHeap) {
	var largest = i; // Set root as largest node
	var left = (2 * i) + 1; // Left child of root
	var right = (2 * i) + 2; // Right child of root

	if (buildingMaxHeap == false) {
		funQueue.push(wrapFunction(colorBar, this, [i, barHighlightColor]));
	}

	if ((left < n) && (values[left] > values[largest])) { // Left value is larger than root
		largest = left; // Set left as largest node
	} 
	if ((right < n) && (values[right] > values[largest])) { // Right value is larger than largest so far
		largest = right; // Set right as largest node
	}
	if (largest != i) { // If largest is not root, swap root and largest value
		var temp = values[i];
		values[i] = values[largest];
		values[largest] = temp;
		funQueue.push(wrapFunction(swapNodes, this, [i, largest]));
		funQueue.push(wrapFunction(swapValues, this, [i, largest]));

		// Recursively sinkRoot affected subtree
		if (buildingMaxHeap == true) { 
			sinkRoot2(largest, n, true);
		} else {
			sinkRoot2(largest, n, false);
		}
	} else {
		funQueue.push(wrapFunction(colorBar, this, [i, barDefaultColor]));
	}
}

// Animation that halves the radius of each node and hides its value
function shrinkNodes() {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var startRadius = barWidth; // Radius of circles before animation
	var endRadius = barWidth / 2; // Radius of circles after animation
	var shrinkRate = (endRadius - startRadius) / numFrames; // Rate at which the nodes' radii grow per frame

	var nodes = [];
	var curTops = [];
	var curLefts = [];
	for (var i = 0; i < values.length; i++) {
		// Temporarily store node to avoid searching for it every frame
		var node = document.getElementsByClassName("sortBar")[i];
		node.innerHTML = ""; // Remove value text from node
		nodes.push(node);
		curTops.push(parseInt(node.style.top));
		curLefts.push(parseInt(node.style.left));
	}

	var curFrame = 0;
	var curRadius = startRadius;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) {
			curRadius += shrinkRate;
			for (var i = 0; i < values.length; i++) { // Slightly shrink each node
				nodes[i].style.borderRadius = Math.round(curRadius) + "px";
				nodes[i].style.width = Math.round(curRadius * 2) + "px";
				nodes[i].style.height = Math.round(curRadius * 2) + "px";

				// Prevent node from drifting when shrinking
				curTops[i] -= shrinkRate;
				curLefts[i] -= shrinkRate;
				nodes[i].style.top = Math.round(curTops[i]) + "px";
				nodes[i].style.left = Math.round(curLefts[i]) + "px";
			}
			curFrame++;
		} else {
			clearInterval(id);
			playAnimations(funQueue); // Play next animation in queue
		}
	}
}

// Animation that moves the node to its position in the sorted array
function moveNodeToSortedPosition(i) {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var node = document.getElementsByClassName("sortBar")[i];

	var startTop = parseInt(node.style.top); // Top value of node before animation
	var endTop = 0; // Top value of node after animation

	var vertChangeRate = (endTop - startTop) / numFrames; // Rate at which node moves vertically per frame

	var startLeft = parseInt(node.style.left); // Left value of node before animation
	var endLeft = i * (barWidth + 1) // Left value of node after animation
	
	var horizChangeRate = (endLeft - startLeft) / numFrames; // Rate at which node moves horizontally per frame

	var curFrame = 0;
	var curTop = startTop;
	var curLeft = startLeft;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) { // Slightly modify the top and left values of the node
			curTop += vertChangeRate;
			curLeft += horizChangeRate;
			node.style.top = Math.round(curTop) + "px";
			node.style.left = Math.round(curLeft) + "px";
			curFrame++;
		} else {
			clearInterval(id);
			playAnimations(funQueue); // Play next animation in queue
		}
	}
}


// Animation that squares all bars simultaneously so that they become a circle after a given number of frames
function squareNodes() {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var radius = barWidth / 2; // Radius of circles befroe animation
	var roundRate = radius / numFrames; // Rate at which the corners round per frame

	var bars = [];
	for (var i = 0; i < values.length; i++) {
		// Temporarily store bar to avoid searching for it every frame
		var bar = document.getElementsByClassName("sortBar")[i];
		bars.push(bar);
	}

	var curFrame = 0;
	var curRadius = barWidth / 2;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) {
			curRadius -= roundRate;
			for (var i = 0; i < values.length; i++) { // Slightly round the corners of each bar
				bars[i].style.borderRadius = Math.round(curRadius) + "px";
			}
			curFrame++;
		} else {
			clearInterval(id);
			playAnimations(funQueue); // Play next animation in queue
		}
	}
}

// Animation that lengthens all bars back to their original heights simultaneously
function lengthenBars() {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var growthRates = [];
	var bars = [];
	var heights = [];
	for (var i = 0; i < values.length; i++) {
		// Temporarily store bar to avoid searching for it every frame
		var bar = document.getElementsByClassName("sortBar")[i];
		bars.push(bar);

		// Store height of bar before being shrunk
		var height = parseInt(bar.style.height);
		heights.push(height);

		var endHeight = values[i] + 50;

		// Calculate how much each bar must shrink during each frame so they all reach their end height during the same frame
		growthRates.push((endHeight - height) / numFrames);
	}

	var curFrame = 0;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) {
			for (var i = 0; i < values.length; i++) { // Shrink each bar by shrink rate
				heights[i] += growthRates[i];
				bars[i].style.height = Math.round(heights[i]) + "px";
			}
			curFrame++;
		} else {
			if (hideValues == false) {
				for (var i = 0; i < values.length; i++) { // Add value text to each node
					bars[i].innerHTML = values[i];
					bars[i].style.lineHeight = "50px";
				}
			}
			clearInterval(id);
			playAnimations(funQueue); // Play next animation in queue
		}
	}
}