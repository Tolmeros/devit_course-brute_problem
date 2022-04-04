
class TasksQueue {
  #tasksPending = [];
  #tasksRunning = [];

  #concurrency = 1;
  #defaultFunction = null;
  #analyzingFunction = null;

  #stoped = true;

  constructor(concurrency = 1, defaultFunction = null) {
    this.#concurrency = concurrency;
    this.#defaultFunction = defaultFunction;
  }

  addTaskByArguments(tasksArg, run = false) {
    for (let taskArg of tasksArg) {
      if (!this.addTask(taskArg)) {
        return false;
      }
    }
    if (run === true) {
      this.run();
    }
    return true;
  }

  addTask(taskArg, taskFunction = null) {
    if (taskFunction !== null) {
      this.#tasksPending.push({
        fn: taskFunction,
        arg: taskArg
      });
      return true;
    }
    if (this.#defaultFunction !== null) {
      this.#tasksPending.push({
        fn: this.#defaultFunction,
        arg: taskArg
      });
      return true;
    }
    return false;
  }

  run() {
    this.#stoped = false;
    return this.#runTasks();
  }

  handleNextPendingTasks() {
    this.#tasksRunning.shift();
    if ((this.#tasksPending.length == 0) && (this.#tasksRunning.length == 0)) {
      this.stop();
      return false;
    } else {
      return this.#runTasks();
    }
  }

  stop () {
    this.#stoped = true;
  }

  get concurrency() {
    return this.#concurrency;
  }

  set analyzingFunction(fn) {
    this.#analyzingFunction = fn;
  }

  #runTasks() {
    if (this.#stoped) {
      return false;
    }

    while (this.#tasksRunning.length < this.#concurrency) {
      const newTask = this.#tasksPending.shift();
      if (newTask === undefined) {
        return false;
      }

      const newTaskPromise = newTask.fn(newTask.arg);

      newTaskPromise.then((result) => {this.#analyzingFunction({result: result, arg: newTask.arg})});

    }
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

function resultsCallback(results) {
  console.log('resultsCallback: ');
  for(let result of results) {
    console.log(result);
  }
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

let pwdTasks = new TasksQueue(2, login);

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

pwdTasks.analyzingFunction = testLogin;

passwords = Array.from(passwordGenerator(5));

//console.log(passwords);

pwdTasks.addTaskByArguments(passwords, true);
//pwdTasks.run();
