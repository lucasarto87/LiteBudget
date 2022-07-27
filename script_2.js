// FUNCTIONS
// ==========================================================================

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

//function to convert degrees to radians
function deg_to_rad(degrees) {
  return degrees * (Math.PI / 180);
}

// CLASSES
// ==========================================================================
class pieChart{
	
	constructor (canvas, shares, xPos, yPos, radius) {
		this.ctx = canvas;
		this.shares = shares;	
		this.xPos = xPos;
		this.yPos = yPos;
		this.radius = radius;
	}
	
	
	draw(){
		
		let minDeg = 0;
		let cnt = 0;
		
		
		for (const share of Object.keys(this.shares)) {
			
			// Determine min and max angles for each share. Then, determing the bisect angle >> to place the label
			const deltaDeg = 360*shares[share];
			const maxDeg = minDeg + deltaDeg;
			const bisectDeg =  minDeg +(maxDeg - minDeg)/2; 
			
			// Create a color
			const color = randomRGB();
			
			// Draw the pie slice
			this.ctx.fillStyle = color;
			this.ctx.beginPath();
			this.ctx.moveTo(this.xPos,this.yPos)
			this.ctx.arc(this.xPos, this.yPos, this.radius, deg_to_rad(minDeg), deg_to_rad(maxDeg));
			this.ctx.fill();
			
			//// Draw the label
			const labelDist = this.radius + 50; 
			
			const xLabel = this.xPos + labelDist * Math.cos(deg_to_rad(bisectDeg));
			const yLabel = this.yPos + (labelDist * Math.sin(deg_to_rad(bisectDeg)));
			const labelSize = 30;
			
			
			this.ctx.font = "40px Verdana";
			this.ctx.fillStyle = color;
			this.ctx.fillText(share + ": " +  this.shares[share], xLabel, yLabel + 40 );
			
			if (bisectDeg <= 180){
				this.ctx.textAlign = "right";
			} else {
				this.ctx.textAlign = "left";
			}
			
			minDeg = maxDeg;
			cnt++;
	
			}
	}
	
	
}