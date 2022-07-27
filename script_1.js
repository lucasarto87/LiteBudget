// CLASSES
// ==========================================================================

class Expense {
	
	constructor(description, amount, currency, category){
		
		// Class properties
		this.description = description;
		this.amount_in = parseFloat(amount);
		this.amount_EUR = 0;
		this.amount_CHF = 0;
		this.currency = currency;
		this.category = category;
		this.date_time = 'None';
		
		this.eur2chf = 0.98;
		
		// Automatically Convert to EUR or CHF
		if (this.currency==='EUR') {
			this.amount_EUR = this.amount_in;	
			this.amount_CHF = this.amount_EUR*this.eur2chf;			
		} else {
			this.amount_CHF = this.amount_in;
			this.amount_EUR = this.amount_CHF*(1/this.eur2chf);
		}
		
		// Complete with current date
		this.getDateTime();
		this.printInfo();
	}
	
	// recover current date and time
	getDateTime() {
		let today = new Date();
		this.date_time = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} - ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
		
	}
	
	// print for debug
	printInfo() {
		console.log('-----------------------------------');
		console.log('Date: ' + this.date_time);
		console.log('Description: ' + this.description);
		console.log('Amount EUR: ' + this.amount_EUR);
		console.log('Amount CHF: ' + this.amount_CHF);
		console.log('Category: ' + this.category);
		console.log('-----------------------------------');
	}
	

}



// FUNCTIONS
// ==========================================================================
function submitNewExpense(){
	// Retrieve description, amount, currency and category
	const exp_descr = document.getElementById("exp_descr").value; 
	const exp_amount = document.getElementById("exp_amount").value; 
	const exp_currency = document.getElementById('exp_currency').value; 
	const exp_category = document.getElementById('exp_category').value; 

	// Create a new expense
	const expense = new Expense(exp_descr, exp_amount, exp_currency, exp_category);
	
	// Add it to the list
	exp_all.push(expense);

}

function populateCategories(){
	const selectCat = document.getElementById("exp_category");
	
	// First, remove all options >> remove the placeholder
	while (selectCat.options.length > 0) {
        selectCat.remove(0);
    }

	for (category of categories){
		const newCat = document.createElement('option');
		newCat.text = category;
		selectCat.add(newCat);
	}
	
}

function categorizeExpenses(){
	
	shares = {};
	for (category of categories){
		exp_total = 0;
		
		for (const exp of exp_all){
			if(exp.category === category) {
				exp_total += exp.amount_CHF;
			}
		}
		//console.log(`category: ${category} tot: ${exp_total}`);
		shares[category] = exp_total;
	}
	
	return shares
}


function drawPieChart(){
	
	
	if (togglePieChart){
		// Remove pie chart
		const canvasDiv = document.getElementById("canvas_div");
		
		body.removeChild(canvasDiv);
		
		togglePieChart = false;
	}
	else {
		// Create canvas
		const canvasDiv = document.createElement('div');
		const canvas = document.createElement('canvas');
		
		canvasDiv.className ="canvas_div";
		canvasDiv.id ="canvas_div";
		canvas.id ="canvas";
		
		canvasDiv.appendChild(canvas);
		body.appendChild(canvasDiv);
		
		// Find total expense for each category
		shares = categorizeExpenses();
		
		
		const width = canvas.width = window.innerWidth;
		const height = canvas.height = window.innerHeight/1.5;
		const ctx = canvas.getContext('2d');
		
		// Draw a pie chart
		const pie = new pieChart(ctx, shares, width/2, height/3, 200);
		
		pie.draw();
		
		togglePieChart = true;
	}
		

}


function listAllExpenses(){
	console.log(toggleAllExpenses);
	
	if (toggleAllExpenses){
		const allExpDiv = document.getElementById("all_expenses");
		body.removeChild(allExpDiv);
		toggleAllExpenses = false;
	}
	else {
		const allExpDiv = document.createElement('div');
		allExpDiv.className ="outer_div";
		allExpDiv.id = "all_expenses";
		const allExpList = document.createElement('ul');
		
		for (exp of exp_all){
			const span = document.createElement('span');
			const listItem = document.createElement('li');
			
			listItem.appendChild(span);
			
			span.textContent = `[${exp.date_time}] ${exp.description} - ${exp.amount_CHF}CHF - ${exp.category}`;
			allExpList.appendChild(listItem);
		}
		allExpDiv.appendChild(allExpList);
		body.appendChild(allExpDiv);
		
		toggleAllExpenses = true;
	}
	
}





// MAIN STARTS HERE
// ==========================================================================

// initialize variables
const body = document.querySelector('body');
const exp_all = [];			// Array containing all expenses
let togglePieChart = false;
let toggleAllExpenses = false;


// Define standard categories and populate the <select> block
let categories = ['Uncategorized'];
populateCategories();

// add an event listener to 'insert new expense' submit button
const exp_submit_btn = document.querySelector('#exp_submit');
exp_submit_btn.addEventListener('click', submitNewExpense);

// add an event listener to 'draw pie chart' button
const draw_chart_btn = document.querySelector('#pie_chart_on');
draw_chart_btn.addEventListener('click', drawPieChart);

// add an event listener to 'all expenses' button
const all_exp_btn = document.querySelector('#all_exp');
all_exp_btn.addEventListener('click', listAllExpenses);