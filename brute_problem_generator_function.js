const allowedChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'A', 'B', 'C', 'D', 'E', 'F', 'G', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
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

function* passwordGenerator(maxLength) {
	var passwordArray = [];
	do {
		passwordArray.push(allowedChars[0]);
		const passwordFistState = passwordArray.join("");
		var passwordCache = passwordFistState;

		do {
			yield passwordCache;
			passwordArray = iterateArray(passwordArray);
			passwordCache = passwordArray.join("");
		} while (passwordCache !== passwordFistState);

	} while (passwordArray.length < maxLength);
}

function brute (maxLength = 5) {
	const passGen = passwordGenerator(maxLength);
	do {
		var result = passGen.next();
		if (login(result.value)) {
			return result.value;
		}
	} while (result.done != true);

	return null;
}


console.log(brute(maxLength));