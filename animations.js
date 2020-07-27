// Swaps the properties of two bars that were just animated so the divs remain ordered by their horizontal position.
function swapValues(index1, index2) {
	var bar1 = document.getElementsByClassName("sortBar")[index1].cloneNode(true);
	var bar2 = document.getElementsByClassName("sortBar")[index2].cloneNode(true);
	document.getElementsByClassName("sortBar")[index1].replaceWith(bar2);
	document.getElementsByClassName("sortBar")[index2].replaceWith(bar1);
	playAnimations(funQueue);
}

// Change the color of a bar to a chosen color
function colorBar(index, color) {
	document.getElementsByClassName("sortBar")[index].style.backgroundColor = color;
	playAnimations(funQueue);
}

// Animation that moves multiple bars to given positions
function moveMultDivs(indices, endPosX, endPosY) {
	var numFrames = framesPerAnimation; // Number of frames used to complete each animation

	var divs = [];
	var deltaX = [];
	var deltaY = [];
	var curX = [];
	var curY = [];
	for (var i = 0; i < indices.length; i++) {
		var div = document.getElementsByClassName("sortBar")[indices[i]];
		var startPosX = parseInt(div.style.left);
		var startPosY = parseInt(div.style.top);

		divs.push(div);

		if (endPosX[i] != -1) {
			deltaX.push((endPosX[i] - startPosX) / numFrames)
		} else {
			deltaX.push(0);
		}

		if (endPosY[i] != -1) {
			deltaY.push((endPosY[i] - startPosY) / numFrames)
		} else {
			deltaY.push(0);
		}

		curX.push(startPosX);
		curY.push(startPosY);
	}

	var curFrame = 0;
	var id = setInterval(frame, 10);
	function frame() {
		if (curFrame != numFrames) {
			for (var i = 0; i < divs.length; i++) {
				curX[i] += deltaX[i];
				divs[i].style.left = Math.round(curX[i]) + "px";

				curY[i] += deltaY[i];
				divs[i].style.top = Math.round(curY[i]) + "px";
			}
			curFrame++;
		} else {
			clearInterval(id);
			playAnimations(funQueue);
		}
	}
}