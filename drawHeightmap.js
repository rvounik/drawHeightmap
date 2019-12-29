const context = document.getElementById("canvas").getContext("2d");
const heightMap = [];
const rows = 40;
const cols = 30;
const tileWidth = 800 / cols;
const tileHeight = 800 / rows;
const attenuation = 10; // the lower this number, the more dramatised the peaks will be visualised (probably make it at least 2 * peakMaxHeight)
const probability = 5; // one out of n chance of generating a peak
const peakMaxHeight = 5; // note this value is cummulative, it can add to existing peak heights and its siblings
const scrollSpeed = 0; // 0 = max
let scrollCounter = 0; 

function getTotalX(array, row, col) {
	let total = 0;

	while (col >= 0) {
		total++; // for x the offset is not visualised since the view is fully frontal
		col--;
	}

	return total;
}

function getTotalY(array, row, col) {
	let total = 0;

	while (row >= 0) {
		total+=1 - array[row][col] / attenuation; // for y the offset is visualised but the effect has to be attenuated to make it appear less dramatised
		row--;
	}

	return total;
}

function draw() {
	for (let row = 0; row < rows-1; row++) {
		for (let col = 0; col < cols; col++) {
			context.beginPath();

			context.lineTo(getTotalX(heightMap, row, col) * tileWidth, getTotalY(heightMap, row, col) * tileHeight);
			context.lineTo(getTotalX(heightMap, row, col+1) * tileWidth, getTotalY(heightMap, row, col) * tileHeight);
			context.lineTo(getTotalX(heightMap, row, col+1) * tileWidth, getTotalY(heightMap, row+1, col) * tileHeight);
			context.lineTo(getTotalX(heightMap, row, col) * tileWidth, getTotalY(heightMap, row+1, col) * tileHeight);

			context.closePath();

			let tileColour = 150 + ((heightMap[row][col] + heightMap[row][col+1] + heightMap[row+1][col+1] + heightMap[row+1][col]) * 10);

			if (tileColour > 255) {tileColour = 255}
			context.fillStyle = `rgb(100, ${tileColour}, 100)`;
			context.fill();

			// visualise edges
			context.lineWidth = .25;
			context.strokeStyle = '#669966';
			context.stroke();
		}
			
	}
}

function addToHeightMap() {
	const tempArray = [];

	for (let col = 0; col < cols; col ++) {
		if (parseInt(Math.random() * probability) === 1) {
			tempArray.push(Math.random() * peakMaxHeight)
		} else {
			tempArray.push(1)
		}
	}

	heightMap.push(tempArray);
	heightMap.shift();
}

function clearCanvas() {
	context.fillStyle = '#fff';
	context.fillRect(0, 0, 800, 600);
}

function update() {
	scrollCounter++;

	if (scrollCounter > scrollSpeed) {
		clearCanvas();

    	draw();
    	addToHeightMap();
		scrollCounter = 0;
	}

    requestAnimationFrame(() => { update(); });
}

// construct inital array
for (let row = 0; row < rows; row ++) {
	let tempArray = [];

	for (let col = 0; col < cols; col ++) {
		if (parseInt(Math.random() * probability) === 1) {
			tempArray.push(Math.random() * peakMaxHeight)
		} else {
			tempArray.push(1)
		}
	}

	heightMap.push(tempArray);
}

// deliberately move the canvas out of screen so it starts outside the edges
context.translate(0-tileWidth, 0-tileHeight);

// start the loop
update();