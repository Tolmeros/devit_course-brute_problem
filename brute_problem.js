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
		var passwordCache = passwordFistState;

		do {

			if (login(passwordCache)) {
				return passwordCache;
			}
			passwordArray = iterateArray(passwordArray);
			passwordCache = passwordArray.join("");
		} while (passwordCache !== passwordFistState);

	} while (passwordArray.length < maxLength);

	return null;
}

console.log(brute(maxLength));
