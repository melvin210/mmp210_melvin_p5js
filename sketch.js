let timeLeft = 0; // left in countdown
let timerInterval; // variable for time count for count down
let buttonPressed = false; // keep track of red button being pressed
let restartButton;
let randomTimer; // variable for random time count down
let randomTime; // variable for random time cound down
let finalTimer; // variable for random time count down


//may not work on safari
// Declare a "SerialPort" object
var serial;

// fill in the name of your serial port here:
//copy this from the serial control app
var portName = "COM5";

//this array will hold transmitted data

var timerReachedZero = false;
let reactionTime = 0;  // Variable to store the reaction time
let reactionTimer = 0; // Reaction timer from 0 to 5 seconds
let reactionTimerInterval; // Interval for the reaction timer



function setup() {
  createCanvas(400, 400);
  
   // make an instance of the SerialPort object
  serial = new p5.SerialPort();
   // Assuming our Arduino is connected,  open the connection to it
  serial.open(portName);
  serial.on('data', gotData);
  
  // restart button
  restartButton = createButton("Restart");
  restartButton.mousePressed(restartGame);
  
  let startButton = createButton("Start");
  startButton.mousePressed(startGame);
  //will add "start" button when startGame() is clicked
}

function gotData() {
  let currentString = serial.readStringUntil('\n'); // Read the incoming data until a newline character is encountered
  if (currentString) {
    reactionTime = parseInt(currentString);  // Parse the received data as an integer and store it in reactionTime
  }
}

function restartGame() {
  // Reset all game variables to their initial state
  timeLeft = 3;
  buttonPressed = false;
  finalTimer = false;
  reactionTimer = 0; // Reset reaction timer
}

function draw() {
  if (reactionTimer > 0 && reactionTimer <= 5) {
    // Reaction timer is active, show the countdown
    background(0, 255, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("GO!", width/2, height/2);
    
  } else {
    // Game interface
    if (timerReachedZero) {
      // Final timer has reached zero
      background(220);
      textSize(32);
      
      
      // Display reaction time
      textSize(32);
      
      text("Reaction Time: " + reactionTime + " ms", width / 2, height / 2 + 100);
    } else {
      // Timer countdown
      background(220);
      textSize(32);
      textAlign(CENTER, CENTER);
      fill(0, 0, 0);
      text(timeLeft, width / 2, height / 2);
    }

    // text for count down timer
    textSize(32);
    textAlign(CENTER, CENTER);
    text(timeLeft, width/2, height/2);

    // when red button is pressed, the text will be displayed
    if (buttonPressed) {
      textSize(32);
      textAlign(CENTER, CENTER);
      text("Button pressed!", width/2, height/2 + 50);
    }
  }
}


function startGame() {
  // reset all
  clearInterval(timerInterval);
  clearInterval(randomTimer);
  clearInterval(finalTimer);
  clearInterval(reactionTimerInterval); // Clear reaction timer interval
  timeLeft = 3;
  buttonPressed = false;
  
  // countdown timer
  timerInterval = setInterval(countdownTimer, 1000);
}
function countdownTimer() {
  // Decrement the time left variable
  timeLeft--;
  
  // when timer is at 0, red button will show up and timer will stop
  if (timeLeft == 0) {
    clearInterval(timerInterval);
    
    // Add a red button that calls startRandomTimer() when clicked
    let redButton = createButton("LETS GO");
    redButton.style('background-color', 'red');
    redButton.mousePressed(startRandomTimer);
  }
}

function startRandomTimer() {
  // random timer is active after pressing red button
  if (!buttonPressed) {
    buttonPressed = true;
    randomTime = random([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    randomTimer = setInterval(function() {
      textSize(32);
      textAlign(CENTER, CENTER);
      text(randomTime + " seconds!", width/2, height/2 + 50);
      clearInterval(randomTimer);
      
      // final timer starts
      finalTimer = setInterval(function() {
        clearInterval(finalTimer);
        timerReachedZero = true; // show when the time reaches 0
        serial.write("1"); // send signal to arduino
        
        // Start the reaction timer from 0 to 5 seconds
        reactionTimerInterval = setInterval(function() {
          reactionTimer++;
          if (reactionTimer > 5) {
            clearInterval(reactionTimerInterval);
          }
        }, 1000);
      }, randomTime * 1000);
    }, randomTime * 1000);
  }
}

p5serialcontroller