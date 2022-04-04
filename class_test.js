
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
    console.log('handle');
    this.tmpLogTasksArrays();
    this.#tasksRunning.shift();
    this.tmpLogTasksArrays();
    if ((this.#tasksPending.length == 0) && (this.#tasksRunning.length == 0)) {
      this.tmpLogTasksArrays();
      this.stop();
    } else {
      this.#handle();
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
    console.log('#handle');
    if (this.#stoped) {
      return false;
    }

    console.log('run >');
    //for (; this.#running < this.#concurrency; this.#running++) {
    //  console.log('run: this.#running:' + this.#running);

    while (this.#tasksRunning.length < this.#concurrency) {
      console.log('run: this.#tasksRunning.length ' + this.#tasksRunning.length);
      const newTask = this.#tasksPending.shift();
      if (newTask === undefined) {
        console.log('run: newTask undefined');
        //this.stop();
        return false;
      }

      const newTaskPromise = new Promise((resolve, reject) => {
        //resolve(() => {return [newTask.fn(...newTask.args), newTask.args]});
        resolve({result: newTask.fn(...newTask.args), args: newTask.args});
      });

      this.#tasksRunning.push(newTaskPromise);

      newTaskPromise.then((result) => {this.#analyzingFunction(result)});

    }

    /*
    for (let task of this.#tasksRunning) {
      task.then((result) => {this.#analyzingFunction(result)});
    }
    */
  }

  run() {
    this.#stoped = false;
    this.#handle();
  }

}

function login(password) {
  console.log('login: ' + password);
  if (password == 'aa') {
    return true;
  }
  return false;
}

let pwdTasks = new TasksQueue(2, login);

function testLogin(results) {
  if (results.functionResult) {
    pwdTasks.stop();
    return results.functionArgs;
  }
  return null;
}

//pwdTasks.analyzingFunction = testLogin;

//pwdTasks.setAnalyzingFunction(testLogin); // Maybe that way better?

console.log('\n## Pass 2\n');

pwdTasks = new TasksQueue(2, login);

function testLogin(results) {
  if (results.result) {
    pwdTasks.stop();
    return results.args;
  }
  return null;
}

function resultsCallback(results) {
  console.log('resultsCallback: ');
  for(let result of results) {
    console.log(result);
  }
}

console.log(pwdTasks.concurrency);

pwdTasks.stopCalllbackFunction = resultsCallback;

passwords = [['aa'], ['bb'], ['cc']];
pwdTasks.addTaskByArguments(passwords);
pwdTasks.run();

console.log(pwdTasks.tasksResults);
