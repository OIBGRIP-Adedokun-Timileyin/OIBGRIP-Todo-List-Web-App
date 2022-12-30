"strict mode";

const closeModal = document.querySelector(".modal-cancel");
const overlay = document.querySelector(".overlay");
const inputTitle = document.querySelector(".title");
const InputDescription = document.querySelector(".description");
const save = document.querySelector(".save");
const listCompleted = document.querySelector(".list-completed");
const listPending = document.querySelector(".list-pending");
const listAllTasks = document.querySelector(".list-all-tasks");

const modalStatus = document.querySelector(".modal-status");

const modalTitleBox = document.querySelector(".modal-title-box");

const modalDescription = document.querySelector(".modal-description");

const modalComplete = document.querySelector(".modal-complete");

const modalDelete = document.querySelector(".modal-delete");

const successDelete = document.querySelector(".success-delete");

const successComplete = document.querySelector(".success-complete");

const tabBtn = document.querySelectorAll(".tab");
const taskLists = document.querySelectorAll(".task-lists");

closeModal.addEventListener("click", function () {
  overlay.classList.add("none");
  modalStatus.classList.remove("completed");
  modalStatus.classList.remove("pending");
  modalComplete.classList.remove("none");
});

let todoData;

if (!todoData) {
  todoData = JSON.parse(localStorage.getItem("todoData"));
}

function expandModal(obj) {
  modalStatus.classList.add(`${obj.completed ? "completed" : "pending"}`);

  modalTitleBox.innerHTML = `<b>Title:</b>${obj.title} `;

  modalDescription.innerHTML = `<b>Description:</b>${obj.description} `;

  if (obj.completed) {
    modalComplete.classList.add("none");
  }
}

console.log(todoData);
////

class Todo {
  allTasks = [];
  completedTasks = [];
  pendingTasks = [];
  taskID = 0;
  currentTask;

  constructor() {
    this.valdation();
    this.switchTabs();
    this.accessSave();
    this.pendingTasksAdd();
    this.completedTasksAdd();
    this.reloadTasks();
    this.deleteTask(listAllTasks);
    this.deleteTask(listCompleted);
    this.deleteTask(listPending);
    this.completeTask();
    this.modalDel();
  }

  valdation() {
    const app = this;
    console.log(this);
    save.addEventListener("click", function () {
      console.log(inputTitle.value);
      console.log(InputDescription.value);
      if (!inputTitle.value || !InputDescription.value) {
        console.log("error");
        inputTitle.placeholder = " field requires input";
        InputDescription.placeholder = " field requires input";

        inputTitle.classList.add("wrong-input");
        InputDescription.classList.add("wrong-input");
        setTimeout(() => {
          inputTitle.classList.remove("wrong-input");
          InputDescription.classList.remove("wrong-input");
        }, 800);
        return;
      }

      //   ///////////

      ////////////////////////

      const newTask = {
        title: app.toLower(inputTitle.value),
        description: app.firstLowerCase(InputDescription.value),
        id: (app.taskID += 1),
        completed: false,
      };

      console.log(app.allTasks);
      app.allTasks.push(newTask);

      app.addTaskEl(newTask, listAllTasks);
      inputTitle.value = "";
      InputDescription.value = "";
      app.saveData();
      console.log(todoData);
      console.log(app.allTasks);
      app.pendingTasksAdd();
      app.completedTasksAdd();
      //    this.reloadTasks();
      app.reloadTasks();
    });
  }

  saveData() {
    todoData = {
      allTasks: this.allTasks,
      completedTasks: this.completedTasks,
      pendingTasks: this.pendingTasks,
      taskID: this.taskID,
    };
    localStorage.setItem("todoData", JSON.stringify(todoData));

    //  {
    //   allTasks: this.allTasks,
    //   completedTasks: this.completedTasks,
    //   pendingTasks: this.pendingTasks,
    //   taskID: this.taskID,
    // }
  }

  toLower(string) {
    return string.toLowerCase();
  }

  firstLowerCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  addTaskEl(task, parentEl) {
    const html = `


   <div class="task-box" data-id = "${task.id}">
            <div class="task-title">${this.firstLowerCase(task.title)}</div>
            <div class="task-descr">${this.firstLowerCase(
              task.description.slice(0, 20)
            )}... 🔽</div>
            <div class="task-status">
              <button class="status ${
                task.completed ? "completed" : "pending"
              }">${task.status ? "completed" : "pending"}</button>
            </div>
            <div class="task-delete"><button class="del">X</button></div>
          </div>

`;

    parentEl.insertAdjacentHTML("beforeend", html);
  }

  completedTasksAdd() {
    this.completedTasks = this.allTasks.filter((ts) => {
      return ts.completed === true;
    });

    this.saveData();
  }

  pendingTasksAdd() {
    this.pendingTasks = this.allTasks.filter((ts) => {
      return ts.completed === false;
    });

    this.saveData();
  }

  displayTaskStatus(taskType, parentEl) {
    taskType.forEach((ts) => {
      this.addTaskEl(ts, parentEl);
    });
  }

  switchTabs() {
    tabBtn.forEach((btn) => {
      btn.addEventListener("click", function () {
        ///on click remove active
        tabBtn.forEach((btn) => {
          btn.classList.remove("active-tab");
        });

        if (btn.classList.contains("completed-tab")) {
          taskLists.forEach((taskl) => {
            taskl.classList.add("none");
          });

          listCompleted.classList.remove("none");
        }

        if (btn.classList.contains("pending-tab")) {
          taskLists.forEach((taskl) => {
            taskl.classList.add("none");
          });

          listPending.classList.remove("none");
        }

        if (btn.classList.contains("all-task-tab")) {
          taskLists.forEach((taskl) => {
            taskl.classList.add("none");
          });

          listAllTasks.classList.remove("none");
        }

        btn.classList.add("active-tab");
      });
    });
  }

  accessSave() {
    if (todoData) {
      //   todoData = JSON.parse(localStorage.getItem(`todoData`));

      this.allTasks = todoData.allTasks;
      this.completedTasks = todoData.completedTasks;
      this.pendingTasks = todoData.pendingTasks;
      this.taskID = todoData.taskID;

      //   this.reloadTasks();
      //   allTasks;
      //   completedTasks;
      //   pendingTasks;
      //   taskID;
    }
  }

  reloadTasks() {
    listAllTasks.textContent = "";
    listPending.textContent = "";
    listCompleted.textContent = "";

    this.displayTaskStatus(this.allTasks, listAllTasks);
    this.displayTaskStatus(this.pendingTasks, listPending);
    this.displayTaskStatus(this.completedTasks, listCompleted);
  }

  deleteTask(taskListsEl) {
    const app = this;
    taskListsEl.addEventListener("click", function (e) {
      if (e.target?.classList?.contains("del")) {
        const id = e.target.closest(".task-box").getAttribute("data-id");
        console.log(e.target);
        console.log(id);

        app.allTasks = app.allTasks.filter((task) => {
          return task.id !== +id;
        });
        app.taskID -= 1;
        app.pendingTasksAdd();
        app.completedTasksAdd();
        app.reloadTasks();
        app.saveData();
        succesdel();

        console.log(app.allTasks);
      }

      ///////////

      ///////
      if (e.target?.classList?.contains("task-descr")) {
        const id = e.target.closest(".task-box").getAttribute("data-id");
        console.log(id);

        app.currentTask = app.allTasks.find((task) => {
          return task.id === +id;
        });

        console.log(app.currentTask);

        app.expandModal(app.currentTask);
      }
    });
  }

  expandModal(obj) {
    overlay.classList.remove("none");
    modalStatus.classList.add(`${obj.completed ? "completed" : "pending"}`);

    modalTitleBox.innerHTML = `<b>Title:</b>  ${obj.title} `;

    modalDescription.innerHTML = `<b>Description:</b>  ${obj.description} `;

    if (obj.completed) {
      modalComplete.classList.add("none");
    }
  }

  completeTask() {
    const app = this;
    modalComplete.addEventListener("click", function () {
      app.currentTask.completed = true;
      app.pendingTasksAdd();
      app.completedTasksAdd();
      app.reloadTasks();
      app.saveData();
      console.log(app.allTasks);
      succescomp();
      modalStatus.classList.add("completed");
    });
  }

  modalDel() {
    const app = this;

    modalDelete.addEventListener("click", function () {
      app.allTasks = app.allTasks.filter((task) => {
        return task.id !== +app.currentTask.id;
      });
      app.taskID -= 1;
      app.pendingTasksAdd();
      app.completedTasksAdd();
      app.reloadTasks();
      app.saveData();
      succesdel();

      console.log(app.allTasks);
    });
  }
}

const App = new Todo();

function succesdel() {
  successDelete.classList.add("translate-back");

  setTimeout(() => {
    successDelete.classList.remove("translate-back");
  }, 2000);
}

function succescomp() {
  successComplete.classList.add("translate-back");

  setTimeout(() => {
    successComplete.classList.remove("translate-back");
  }, 2000);
}
