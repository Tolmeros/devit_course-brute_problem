
class TasksQueue {
  #tasksPending = [];
  #tasksRunning = [];
  #tasksResults = [];

  #concurrency = 1;
  #defaultFunction = null;
  #analyzingFunction = null;
  #stopCalllbackFunction = null;

  #stoped = true;

  #defaultAnalyzingFunction(results){
    console.log('#defaultAnalyzingFunction: '+results.args);
    this.#tasksResults.push(results);
    this.handle();
  }

  tmpLogTasksArrays() {
    console.log('Pending');
    for (let task of this.#tasksPending) {
      console.log(task);
    }

    console.log('Running');
    for (let task of this.#tasksRunning) {
      console.log(task);
    }
  }

  handle() {
    //this.tmpLogTasksArrays();
    this.#tasksRunning.shift();
    //this.tmpLogTasksArrays();
    if ((this.#tasksPending.length == 0) && (this.#tasksRunning.length == 0)) {
      //this.tmpLogTasksArrays();
      this.stop();
      return false;
    } else {
      return this.#handle();
    }
  }

  constructor(concurrency = 1, defaultFunction = null) {
    this.#concurrency = concurrency;
    this.#defaultFunction = defaultFunction;
    this.#analyzingFunction = this.#defaultAnalyzingFunction;
  }

  get concurrency() {
    return this.#concurrency;
  }

  get tasksResults() {
    return this.#tasksResults;
  }

  set analyzingFunction(fn) {
    this.#analyzingFunction = fn;
  }

  set stopCalllbackFunction(fn) {
    this.#stopCalllbackFunction = fn;
  }

  stop () {
    this.#stoped = true;
    if (this.#stopCalllbackFunction) {
      this.#stopCalllbackFunction(this.#tasksResults);
    }
  }

  addTask(taskArgs, taskFunction = null) {
    if (taskFunction !== null) {
      this.#tasksPending.push({
        fn: taskFunction,
        args: taskArgs
      });
      return true;
    }
    if (this.#defaultFunction !== null) {
      this.#tasksPending.push({
        fn: this.#defaultFunction,
        args: taskArgs
      });
      return true;
    }
    return false;
  }

  addTaskByArguments(tasksArgs) {
    for (let taskArgs of tasksArgs) {
      if (!this.addTask(taskArgs)) {
        return false;
      }
      console.log('task: '+taskArgs);
    }  
    return true;
  }

  #handle() {
    if (this.#stoped) {
      return false;
    }

    while (this.#tasksRunning.length < this.#concurrency) {
      const newTask = this.#tasksPending.shift();
      if (newTask === undefined) {
        return false;
      }

      const newTaskPromise = new Promise((resolve, reject) => {
        resolve({result: newTask.fn(...newTask.args), args: newTask.args});
      });

      this.#tasksRunning.push(newTaskPromise);

      newTaskPromise.then((result) => {this.#analyzingFunction(result)});

    }
    return true;
  }

  run() {
    this.#stoped = false;
    return this.#handle();
  }

}

function login(password) {
  console.log('login: ' + password);
  if (password == 'bb') {
    return true;
  }
  return false;
}

let pwdTasks = new TasksQueue(2, login);

function testLogin(results) {
  //console.log('testLogin');
  //console.log(results);
  if (results.result) {
    pwdTasks.stop();
    console.log('password is: '+results.args[0]);
    return results.args;
  } else {
    pwdTasks.handle();
  }
  return null;
}

//pwdTasks.analyzingFunction = testLogin;

//pwdTasks.setAnalyzingFunction(testLogin); // Maybe that way better?

console.log('\n## Pass 2\n');

pwdTasks = new TasksQueue(2, login);

function resultsCallback(results) {
  console.log('resultsCallback: ');
  for(let result of results) {
    console.log(result);
  }
}

console.log(pwdTasks.concurrency);

//pwdTasks.stopCalllbackFunction = resultsCallback;
pwdTasks.analyzingFunction = testLogin;

passwords = [['aa'], ['bb'], ['cc']];
pwdTasks.addTaskByArguments(passwords);
pwdTasks.run();

//console.log(pwdTasks.tasksResults);

