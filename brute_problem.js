const allowedChars = ['a', 'b', 'c', 'A', 'B', 'C'];
const maxLength = 10;

function login(password) {
	return password === "99Ac9";
}

function iterateArray(arrayOfSymbols) {
	var arrayNext = [...arrayOfSymbols];

	var position = 0;
	var carry = true;

	do {
		var allowedCharsActualIndex = allowedChars.indexOf(arrayNext[position]);
		var allowedCharsNextIndex = allowedCharsActualIndex + 1;

		carry = (allowedCharsNextIndex >= allowedChars.length);

		arrayNext[position] = allowedChars[allowedCharsNextIndex % allowedChars.length];

		position++;
	} while ((position < arrayNext.length) && carry);

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
