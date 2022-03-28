const allowedChars = ['a', 'b', 'c', 'A', 'B', 'C'];
const maxLength = 10;

function login(passwod) {
	return passwod === "ACcA";
}

function iterateArray(arrayOfSymbols) {
	var arrayNext = [...arrayOfSymbols];

	var position = 0;
	var overflow = true;

	while ((position < arrayNext.length) && overflow) {
		var allowedCharsActualIndex = allowedChars.indexOf(arrayNext[position]);
		
		allowedCharsNextIndex = allowedCharsActualIndex + 1;

		overflow = (allowedCharsNextIndex >= allowedChars.length);

		var allowedCharsNextIndex = allowedCharsNextIndex % allowedChars.length;
		arrayNext[position] = allowedChars[allowedCharsNextIndex];

		position++;
	}

	return arrayNext;
}

function brute (maxLength = 5) {
	var passwordArray = [];

	do {
		passwordArray.push(allowedChars[0]);
		const passwordFistState = passwordArray.join("");

		do {
			if (login(passwordArray.join(""))) {
				return passwordArray.join("");
			}
			passwordArray = iterateArray(passwordArray);
		} while (passwordArray.join("") !== passwordFistState);

	} while (passwordArray.length < maxLength);

	return null;
}

console.log(brute(maxLength));
