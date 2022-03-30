//const allowedChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'A', 'B', 'C', 'D', 'E', 'F', 'G', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const allowedChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'A', 'B', 'C'];
const maxLength = 5;

function login(password) {
	return password === "99Ac9";
}

function printAllKfromCharsSet(k, charsSetArray, stringState="") {
	if (k == 0) {
		console.log(stringState);
		return stringState;
	}

	//let n = charsSetArray.length; //?
	for (let i=0; i < charsSetArray.length; i++) {
		let newStringState = stringState + charsSetArray[i];
		printAllKfromCharsSet(k-1, charsSetArray, newStringState);
	}
}

function brute (maxLength = 5) {
	
	for (let k = 1; k<=maxLength; k++) {
	  printAllKfromCharsSet(k, allowedChars);
	}
	

	/*
	if (login(passwordCache)) {
		return passwordCache;
	}
	*/
	

	return null;
}

console.log(brute(maxLength));
