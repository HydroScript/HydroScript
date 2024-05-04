// Generate a random number between 1 and 100
const secretNumber = Math.floor(Math.random() * 100) + 1;

// Initialize the number of guesses
let numGuesses = 0;

console.log("Welcome to the Guess the Number game!");

// Function to start the game
function startGame() {
  console.log("I'm thinking of a number between 1 and 100.");

  // Prompt the user for their guess
  const userGuess = parseInt(prompt("Enter your guess:"));

  // Increment the number of guesses
  numGuesses++;

  // Check if the user's guess is correct
  if (userGuess === secretNumber) {
    console.log(`Congratulations! You guessed the number in ${numGuesses} attempts.`);
  } else if (userGuess < secretNumber) {
    console.log("Too low! Try guessing a higher number.");
    startGame();
  } else {
    console.log("Too high! Try guessing a lower number.");
    startGame();
  }
}

// Start the game
startGame();