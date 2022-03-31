const allowedChars = [
	'a', 'b', 'c', 'd', 'e', 'f', 'g',
	'A', 'B', 'C', 'D', 'E', 'F', 'G',
	'1', '2', '3', '4', '5', '6', '7',
	'8', '9'
];
const maxLength = 10;

function login(password) {
	return password === "99Ac9";
}

function iterateArray(stateArray) {
	let position = 0;
	let carry = true;

	do {
		let allowedCharsNextIndex =  stateArray[position] + 1;

		carry = (allowedCharsNextIndex >= allowedChars.length);
		stateArray[position] = allowedCharsNextIndex % allowedChars.length;

		position++;
	} while ((position < stateArray.length) && carry);

	return stateArray;
}

function createPasswordFromArray(passwordArray) {
  let password = '';
  for(let i = 0, length = passwordArray.length; i < length; i++) {
    password += allowedChars[passwordArray[i]];
  }

  return password;
}

function* passwordGenerator(maxLength) {
	let passwordArray = [];
	do {
		passwordArray.push(0);
		const passwordFistState = createPasswordFromArray(passwordArray);
		let passwordCache = passwordFistState;

		do {
			yield passwordCache;

			passwordArray = iterateArray(passwordArray);
			passwordCache = createPasswordFromArray(passwordArray);
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
