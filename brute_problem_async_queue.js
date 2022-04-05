
class TasksQueue {
  #concurrency = 1;
  #loadFunction = null;

  #stoped = true;
  #tasksRunningCounter = 0;

  constructor(loadFunction, concurrency = 1) {
    this.#concurrency = concurrency;
    this.#loadFunction = loadFunction;
  }

  run() {
    this.#stoped = false;
    return this.#runTasks();
  }

  handleNextPendingTasks() {
    this.#tasksRunningCounter--;
    return this.#runTasks();
  }

  stop () {
    this.#stoped = true;
  }

  get concurrency() {
    return this.#concurrency;
  }

  #runTasks() {
    if (this.#stoped) {
      return false;
    }
    let addedTasks = 0;
    while (this.#tasksRunningCounter < this.#concurrency) {
      const newTask = this.#loadFunction();
      if (newTask == null) {
        this.stop();
        console.log('runTasks addedTasks: '+addedTasks);
        return false;
      }

      const newTaskPromise = newTask.fn(newTask.arg);

      newTaskPromise.then((result) => {
        newTask.afn({result: result, arg: newTask.arg})
      });

      this.#tasksRunningCounter++;
      addedTasks++;
    }
    console.log('runTasks addedTasks: '+addedTasks);
    return true;
  }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function login(password) {
  await delay(100 + Math.random() * 100);
  if (password == 'bb') {
    return true;
  }
  return false;
}

function* passwordGenerator(maxLength) {
  const allowedChars = [
    'a', 'b', 'c',
    'A', 'B', 'C',
  ];

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

let passwords = passwordGenerator(5);

function taskLoading() {
  let password = passwords.next();
  if (password.done) {
    return null;
  }
  return {fn: login, afn: testLogin, arg: password.value};
}

let pwdTasks = new TasksQueue(taskLoading, 5, login);

function testLogin(results) {
  if (results.result === true) {
    pwdTasks.stop();
    console.log('password is: '+results.arg);
    return results.arg;
  } else {
    pwdTasks.handleNextPendingTasks();
  }
  return null;
}

pwdTasks.run();
