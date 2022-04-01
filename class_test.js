
class TasksQueue {
  #tasksPending = [];
  #tasksRunning = [];
  #tasksResults = [];

  #concurrency = 1;
  #defaultFunction = null;
  #analyzingFunction = null;

  #defaultAnalyzingFunction(results){
    this.tasksResults.push();
    if (this.tasksPending.length == 0) {
      this.stop();
    }
  }

  constructor(concurrency = 1, defaultFunction = null) {
    this.#concurrency = concurrency;
    this.#defaultFunction = defaultFunction;
  }

  get concurrency() {
    return this.#concurrency;
  }

  set analyzingFunction(fn) {
    this.#analyzingFunction = fn;
  }

  addTask(taskArgs, taskFunction = null) {
    if (taskFunction != null) {
      this.#tasksPending.push({
        fn: taskFunction,
        args: taskArgs
      });
      return true;
    }
    if (this.#defaultFunction != null) {
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

  run() {

  }

}

function login(password) {
  console.log(password);
}

console.log('\n## Pass 1\n');

let pwdTasks = new TasksQueue(2, login);

function testLogin(results) {
  if (results.functionResult) {
    pwdTasks.stop();
    return results.functionArgs;
  }
  return null;
}

pwdTasks.analyzingFunction = testLogin;

//pwdTasks.setAnalyzingFunction(testLogin); // Maybe that way better?

console.log(pwdTasks.concurrency);

let passwords = ['aa', 'bb'];
pwdTasks.addTaskByArguments(passwords);

console.log('\n## Pass 2\n');

pwdTasks = new TasksQueue(2);

console.log(pwdTasks.concurrency);

passwords = ['aa', 'bb'];
pwdTasks.addTaskByArguments(passwords);
