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

function allKfromCharsSet(k, charsSetArray, checkFn, stringState="") {
	if (k == 0) {
		return checkFn(stringState) ? stringState : null;
	}

	for (let i=0; i < charsSetArray.length; i++) {
		let newStringState = stringState + charsSetArray[i];
		let result = allKfromCharsSet(k-1, charsSetArray, checkFn, newStringState);
		if (result !== null) {
			return result;
		}
	}

	return null;
}

function brute (maxLength = 5) {
	
	for (let k = 1; k<=maxLength; k++) {
		let result = allKfromCharsSet(k, allowedChars, login);
		if (result !== null) {
			return result;
		}
	}

	return null;
}

console.log(brute(maxLength));
