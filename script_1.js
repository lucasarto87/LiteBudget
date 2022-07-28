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
	const exp_descr = document.getElementById("exp_descr"); 
	const exp_amount = document.getElementById("exp_amount"); 
	const exp_currency = document.getElementById('exp_currency'); 
	const exp_category = document.getElementById('exp_category'); 
	
	
	// If amount or descriptor is missing, send alert. otherwise proceed
	if(exp_descr.value==='' || exp_amount.value===''){
		alert("Please insert a valid descriptor and a proper amount for this expense");
	}
	else {
	
		// Create a new expense
		const expense = new Expense(exp_descr.value, exp_amount.value, exp_currency.value, exp_category.value);
		
		// Add it to the list
		exp_all.push(expense);
		
		// Clear the content of the text boxes
		exp_descr.value='';
		exp_amount.value='';
		
		// Inform User
		alert("The expense has been recorded");
		
		
		// Update total expenses div
		updateTotalExpenses();
		
		// Show list of all expenses
		listAllExpenses();

	}
}


// Loop through all the expenses and update the sum on the relative div
function updateTotalExpenses(){
	
	exp_total = 0;
	for (const exp of exp_all){
		exp_total += exp.amount_CHF;
	}
	
	// update the text
	const tot_exp_span = document.getElementById("total_expenses_span");
	tot_exp_span.textContent = `Total expenses: ${exp_total} CHF`;
	
}


// Populate the <select> category with all available categories
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


// For each category, calculate the partial total amount of epenses
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
		
		canvasDiv.className ="outer_div";
		canvasDiv.id ="canvas_div";
		
		canvas.id ="pie_canvas";
		
		canvasDiv.appendChild(canvas);
		body.appendChild(canvasDiv);
		
		// Find total expense for each category
		shares = categorizeExpenses();
		
		// Set canvas size >> Same as parent div
		canvas.width  = 0.95*canvasDiv.clientWidth; //window.innerWidth;
		canvas.height = 0.95*canvasDiv.clientHeight; //window.innerHeight;
		
		// Draw a pie chart
		const ctx = canvas.getContext('2d');
		const pie = new pieChart(ctx, shares, canvas.width/2, canvas.height/2, canvas.width*0.2);
		
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
		
		// Create container div
		const allExpDiv = document.createElement('div');
		allExpDiv.className ="outer_div";
		allExpDiv.id = "all_expenses";
		
		// Create list
		const allExpList = document.createElement('ul');
		
		for (let i = 0; i < exp_all.length; i++){
		//for (exp of exp_all){
			exp = exp_all[i];
			
			// Create span, button and list item
			const span = document.createElement('span');
			const btn = document.createElement('button');
			const listItem = document.createElement('li');
			
			// Add an eventListener to the button i.o.t. delete the expense
			btn.classList.add("single_expense_btn");
			btn.addEventListener('click', ()=> {
										allExpList.removeChild(listItem);
										exp_all.splice(i,1);
										updateTotalExpenses();
										});
			
			// Append span, button to list item
			listItem.appendChild(btn);
			listItem.appendChild(span);
			
			// Update text in span
			span.textContent = `[${exp.date_time}] ${exp.description} - ${exp.amount_CHF} CHF - ${exp.category}`;
			
			// Append list item to list
			allExpList.appendChild(listItem);
		}
		// Append list to div, and div to body
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
let categories = ['Home', 'Food'];
populateCategories();

// ADD EVENT LISTENERS
//----------------------
// add an event listener to 'insert new expense' submit button
const exp_submit_btn = document.querySelector('#exp_submit');
exp_submit_btn.addEventListener('click', submitNewExpense);

// add an event listener to 'toggle pie chart' button
const draw_chart_btn = document.querySelector('#pie_chart_on');
draw_chart_btn.addEventListener('click', drawPieChart);

// add an event listener to 'toggle all expenses' button
const all_exp_btn = document.querySelector('#all_exp');
all_exp_btn.addEventListener('click', listAllExpenses);