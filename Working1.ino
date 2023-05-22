const int buttonPin = 2;   // Button connected to digital pin 2
const int ledPin = 13;     // LED connected to digital pin 13

unsigned long randomTime = 0;  // Random time received from p5.js
unsigned long startTime = 0;  // Variable to store the start time
bool gameActive = false;      // Flag to track if the game is active or not

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);  // Set the button pin as input with internal pull-up resistor
  pinMode(ledPin, OUTPUT);            // Set the LED pin as output
  Serial.begin(9600);                 // Initialize Serial communication
}

void loop() {
  if (Serial.available() > 0) {
    randomTime = Serial.parseInt();  // Read the random time sent from p5.js
    digitalWrite(ledPin, HIGH);      // Turn on the LED when the random time reaches 0
    delay(randomTime);               // Wait for the random time

    // Game start
    gameActive = true;
    startTime = millis();       // Store the start time
  }

  if (gameActive && digitalRead(buttonPin) == LOW) {
    // Game end
    gameActive = false;
    unsigned long endTime = millis();  // Store the end time
    unsigned long reactionTime = endTime - startTime;
    Serial.println(reactionTime);  // Send the reaction time to p5.js

    digitalWrite(ledPin, LOW);  // Turn off the LED after the button is pressed
  }
}
