//so here's the deal, I want to make a stock trading game where you can mouseclick to buy, press a key to sell, and a mouseover to see the price at any given time. 

const svgDef = "http://www.w3.org/2000/svg";
let lines = [];
let gameInterval;
let svg;
let priceTracker;
let cashTracker;
let stockTracker;

//main function
window.addEventListener("load", function () {

    //store svg object for later functions conveinience.
    svg = document.querySelector("svg");
    priceTracker = this.document.querySelector("#priceTracker");
    cashTracker = this.document.querySelector("#cashTracker")
    stockTracker = this.document.querySelector("#stocks");

    //Starting the game
    //when the start/pause button is pressed for the first time, load new chart values
    this.document.querySelector("#gameButton").addEventListener("click", function boot() {

        let newLine = document.createElementNS(svgDef, "line")
            
        // set line attributes
        newLine.setAttribute("x1",0)
        newLine.setAttribute("x2",10)
        newLine.setAttribute("y1",450 - Math.random()*400)
        newLine.setAttribute("y2",newLine.getAttribute("y1"))
        newLine.setAttribute("stroke","red")
        newLine.setAttribute("stroke-width","5px")
        console.log("First Line Successful at " + newLine.getAttribute("y1"));
        
        //add line to array and svg
        lines.push(newLine);
        svg.appendChild(newLine);

        //until the lines are past the border of the svg object, keep adding new line objects
        while(lines[lines.length-1].getAttribute("x2") < svg.width.baseVal.value){
            createNewLine();
        }
        gameInterval=setInterval(function () {newFrame()}, 16);
        
        //clear event listener on button, add new listener and change button text 
        document.querySelector("#gameButton").removeEventListener("click",  boot)
        document.querySelector("#gameButton").addEventListener("click", function(){
            pauseGame();
        });
        document.querySelector("#gameButton").innerHTML = "Pause";
        cashTracker.innerHTML="1000.00"
        
        //set up buy/sell event listeners
        document.querySelector("#buy1").addEventListener("click",  buy1);
        document.querySelector("#buyAll").addEventListener("click",  buyAll);
        svg.addEventListener("contextmenu", sell);
    });
});

//new frame function, updates the visuals displayed on the svg
function newFrame(){

    //shift every line backwards a number of pixels
    for (let index = 0; index < lines.length; index++) {
        const e = lines[index];
        e.setAttribute("x1", parseFloat(e.getAttribute("x1"))-1);
        e.setAttribute("x2", parseFloat(e.getAttribute("x2"))-1);
    }
    
    //If the first line ends before the beginning of the svg item, remove them from the list and the svg
    if (lines[0].getAttribute("x2")<=0){
        lines[0].setAttribute("id", "toRemove")
        for (let i = 1; i < lines.length; i++) {
            const e = lines[i];

            lines[i-1] = e;
        }
        lines.pop();
        document.getElementById("toRemove").remove();
        
    }
    if (lines[lines.length-1].getAttribute("x2") <= svg.width.baseVal.value){
        createNewLine();
    }
    priceTracker.innerHTML = Math.floor(Math.abs(parseFloat(lines[lines.length-1].getAttribute("y1")) + ((svg.width.baseVal.value - lines[lines.length-1].getAttribute("x1")) / (lines[lines.length-1].getAttribute("x2") - lines[lines.length-1].getAttribute("x1"))*(lines[lines.length-1].getAttribute("y2") - lines[lines.length-1].getAttribute("y1"))) -500)*100)/100
}

//pauses a running game, clear interval
//clear event listener on button, add new listener and change button text 
function pauseGame(){
    document.querySelector("#gameButton").removeEventListener("click", pauseGame)
    clearInterval(gameInterval);
    document.querySelector("#gameButton").addEventListener("click", resumeGame);
    document.querySelector("#gameButton").innerHTML = "Play";
    document.querySelector("#buy1").removeEventListener("click", buy1);
    document.querySelector("#buyAll").removeEventListener("click", buyAll);
    svg.removeEventListener("contextmenu", sell);
}

//resumes a paused game, set interval
//clear event listener on button, add new listener and change button text 
function resumeGame(){
    document.querySelector("#gameButton").removeEventListener("click", resumeGame)
    gameInterval=setInterval(function () {newFrame()}, 16);
    document.querySelector("#gameButton").addEventListener("click", pauseGame);
    document.querySelector("#gameButton").innerHTML = "Pause";
    document.querySelector("#buy1").addEventListener("click",  buy1);
    document.querySelector("#buyAll").addEventListener("click",  buyAll);
    svg.addEventListener("contextmenu", sell);
}


//create a new line in the SVG (assumes a line will always exist when called)
function createNewLine(){
    //inititalize the start and end points for the lines
    let lineXStart = lines[lines.length-1].getAttribute("x2");
    let lineXEnd;
    let lineYStart = lines[lines.length-1].getAttribute("y2");
    let lineYEnd = lineYStart;

    //initialize a place to store new line objects
    let newLine;

    //boolean to determine if the line endpoint is above or below the previous
    //0 means that the line ends above the start, 1 means the line ends below the start
    let up = 0;

    //randomly determine how long the line will be in the x coordinate
    lineXEnd = parseFloat(lineXStart)+Math.random()*150+50
    
    // If the line at it's peak, send it in the other direction. otherwise, randomly determine if the line is going up or down
    if (lineYStart == 450) up = 0;
    else if (lineYStart == 50) up = 1; 
    else up = Math.floor(Math.random()*2);

    //randomly determine how large of an increase there will be, capped at their extremes
    if (up==0) {
        lineYEnd = parseFloat(lineYStart)-Math.random()*200;
        if (lineYEnd<50){
            lineYEnd=50
        }
    }
    else {
        lineYEnd = parseFloat(lineYStart)+Math.random()*200;
        if (lineYEnd>450){
            lineYEnd=450
        }
    }
    //create new line
    newLine = document.createElementNS(svgDef, "line")
    
    // set line attributes
    newLine.setAttribute("x1",lineXStart)
    newLine.setAttribute("x2",lineXEnd)
    //console.log("x successful")
    newLine.setAttribute("y1",lineYStart)
    newLine.setAttribute("y2",lineYEnd)
    //console.log("y successful")
    newLine.setAttribute("stroke","red")
    newLine.setAttribute("stroke-width","5px")
    //console.log("stroke settings successful")
    
    //add line to array and svg
    lines.push(newLine);
    svg.appendChild(newLine);

    //update the line start values to where these lines ended
    lineXStart=lineXEnd;
    lineYStart=lineYEnd;
}

//buy 1 function
//check the current price against current cash on hand. If cash is greater than the price, add 1 stock
function buy1(){
    let cash = parseFloat(cashTracker.innerHTML);
    let price = parseFloat(priceTracker.innerHTML);
    let stocks = parseInt(stockTracker.innerHTML);
    console.log("buy1")
    if (cash >= price){
        cash -= price;
        stocks++;
        cashTracker.innerHTML = Math.floor(100*cash)/100;
        stockTracker.innerHTML = stocks;
    }
    console.log("buy successful")
}

//buy all function
//repeatedly buy 1 stock until you no longer have enough money to buy another.
function buyAll(){
    let cash = parseFloat(cashTracker.innerHTML);
    let price = parseFloat(priceTracker.innerHTML);
    let stocks = parseInt(stockTracker.innerHTML)
    while (cash >= price){
        cash -= price;
        stocks++;
    }
    stockTracker.innerHTML = stocks;
    cashTracker.innerHTML = Math.floor(100*cash)/100;
}

//sell function
//sell all stock at once, add the value to your cash on hand
function sell(){
    let cash = parseFloat(cashTracker.innerHTML);
    let price = parseFloat(priceTracker.innerHTML);
    cash += price*parseInt(stockTracker.innerHTML);

    stockTracker.innerHTML = 0;
    cashTracker.innerHTML = Math.ceil(100*cash)/100;
}

/*to do list
    1: Add new line when needed in newFrame (Done)
    2: Add current value tracker to newFrame (Done)
    3: Add user display (Done)
    4: Add Buy/Sell

*/