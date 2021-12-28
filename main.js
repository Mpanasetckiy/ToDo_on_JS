const addTaskBtn = document.getElementById('add-task-btn');
const deskTaskInput = document.getElementById('description-task');
const todosWrapper = document.getElementById('todos-wrapper');

let tasks =[];
function Task(description) {
    this.description = description;
    this.completed = false;
}

addTaskBtn.addEventListener("click", () => {
    tasks.push(new Task(deskTaskInput.value));
    console.log(tasks)
})

const makeTodos = (todo) => {
    return `
    <div class="todo-item">
      <input type="checkbox" name="" id="" class="">
      <div class="description">${todo.description}</div>
      <button class="delete-button">Delete</button>
    </div>
  `

};