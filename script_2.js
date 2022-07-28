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
		
		// Compute total share >> used to draw pie slices according to percentages
		this.shares_tot = 0;
		for (const share of Object.keys(this.shares)){
			this.shares_tot += shares[share];
			
		}

	}
	
	
	draw(){
		
		let minDeg = 0;
		let cnt = 0;
		
		
		for (const share of Object.keys(this.shares)) {
			
			// Determine share part in %
			const share_pc = shares[share]/this.shares_tot;
			
			// Determine min and max angles for each share. Then, determing the bisect angle >> to place the label
			const deltaDeg = 360*share_pc;
			const maxDeg = minDeg + deltaDeg;
			const bisectDeg =  minDeg +(maxDeg - minDeg)/2; 
			
			// Print for debug
			console.log('------------------');
			console.log('share: ' + shares[share]);
			console.log('shares TOT: ' + this.shares_tot);
			console.log('shares %: ' + share_pc);
			console.log('minDeg: ' + minDeg);
			console.log('maxDeg: ' + maxDeg);
			console.log('bisectDeg: ' + bisectDeg);
			console.log('------------------');
			
			// Create a color
			const color = randomRGB();
			
			// Draw the pie slice
			this.ctx.fillStyle = color;
			this.ctx.beginPath();
			this.ctx.moveTo(this.xPos,this.yPos)
			this.ctx.arc(this.xPos, this.yPos, this.radius, deg_to_rad(minDeg), deg_to_rad(maxDeg));
			this.ctx.fill();
			
			//// Draw the label
			const labelDist = 1.2*this.radius; 
			
			const xLabel = this.xPos + labelDist * Math.cos(deg_to_rad(bisectDeg));
			const yLabel = this.yPos + (labelDist * Math.sin(deg_to_rad(bisectDeg)));
			const labelSize = 30;
			
			
			this.ctx.font = "1em Verdana";
			this.ctx.fillStyle = color;
			this.ctx.fillText(share + ": " +  this.shares[share] + " CHF", xLabel, yLabel );
			
			if (bisectDeg <= 180){
				this.ctx.textAlign = "center";
			} else {
				this.ctx.textAlign = "center";
			}
			
			minDeg = maxDeg;
			cnt++;
	
			}
	}
	
	
}