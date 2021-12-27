const addTaskBtn = document.getElementById('add-task-btn');
const deskTaskInput = document.getElementById('description-task');
const todosWrapper = document.getElementById('todos-wrapper');

let tasks =[];
function Task(description) {
    this.description = description;
    this.completed = false;
}

addTaskBtn.addEventListener("click", () => {
    tasks.push(new task(deskTaskInput.value));
    console.log(tasks)
});

const makeTodos = (todo) => {
    return `
        <div></div>
    `

};