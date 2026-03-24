const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalInput = document.getElementById("modalInput");
const modalCancelButton = document.getElementById("modalCancelButton");
const modalConfirmButton = document.getElementById("modalConfirmButton");

function openModal(config) {
	return new Promise((resolve) => {
		modalTitle.textContent = config.title;
		modalMessage.textContent = config.message;
		modalConfirmButton.textContent = config.confirmText || "OK";
		modalCancelButton.hidden = !config.showCancel;
		modalInput.hidden = !config.showInput;

		if (config.showInput) {
			modalInput.value = "";
			modalInput.focus();
		} else {
			modalConfirmButton.focus();
		}

		modalOverlay.hidden = false;

		function cleanup(result) {
			modalOverlay.hidden = true;
			modalConfirmButton.removeEventListener("click", handleConfirm);
			modalCancelButton.removeEventListener("click", handleCancel);
			document.removeEventListener("keydown", handleKeyDown);
			resolve(result);
		}

		function handleConfirm() {
			cleanup(config.showInput ? modalInput.value : true);
		}

		function handleCancel() {
			cleanup(null);
		}

		function handleKeyDown(event) {
			if (event.key === "Enter") {
				event.preventDefault();
				handleConfirm();
			}

			if (event.key === "Escape" && config.showCancel) {
				event.preventDefault();
				handleCancel();
			}
		}

		modalConfirmButton.addEventListener("click", handleConfirm);
		modalCancelButton.addEventListener("click", handleCancel);
		document.addEventListener("keydown", handleKeyDown);
	});
}

async function showGuessPrompt(attempt, maxAttempts) {
	const result = await openModal({
		title: `Attempt ${attempt} of ${maxAttempts}`,
		message: "Enter a number between 1 and 10.",
		confirmText: "Guess",
		showCancel: true,
		showInput: true
	});

	if (result === null) {
		return null;
	}

	return Number(result);
}

function showMessage(title, message) {
	return openModal({
		title,
		message,
		confirmText: "OK",
		showCancel: false,
		showInput: false
	});
}

async function startGame() {
	const randomNumber = Math.floor(Math.random() * 10) + 1;
	const maxAttempts = 3;
	let guessedCorrectly = false;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		const guess = await showGuessPrompt(attempt, maxAttempts);

		if (guess === null) {
			return;
		}

		if (guess === randomNumber) {
			await showMessage("Correct!", `You guessed the number ${randomNumber}.`);
			guessedCorrectly = true;
			break;
		} else if (attempt === maxAttempts) {
			break;
		} else if (guess > randomNumber) {
			await showMessage("Too High!", "Try a lower number.");
		} else {
			await showMessage("Too Low!", "Try a higher number.");
		}
	}

	if (!guessedCorrectly) {
		await showMessage("Game Over!", `The correct number was ${randomNumber}.`);
	}
}
