function startGame() {
	const randomNumber = Math.floor(Math.random() * 10) + 1;
	const maxAttempts = 3;
	let guessedCorrectly = false;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		const userInput = prompt(`Attempt ${attempt} of ${maxAttempts}: Enter a number between 1 and 10`);
		const guess = Number(userInput);

		if (guess === randomNumber) {
			alert(`Correct! You guessed the number ${randomNumber}.`);
			guessedCorrectly = true;
			break;
		} else if (guess > randomNumber) {
			alert("Too high!");
		} else {
			alert("Too low!");
		}
	}

	if (!guessedCorrectly) {
		alert(`Game Over! The correct number was ${randomNumber}.`);
	}
}
