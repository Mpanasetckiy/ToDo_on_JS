$(document).ready(function() {
  const todos = [];
  const KEY_ENTER = 'Enter';

  function Todo(description) {
    this.id = Date.now();
    this.description = description;
    this.checked = false;
  }

  const makeTodo = (description) => {
    todos.push(new Todo(description));
  };

  const createHtml = (todo) => {
    return ` <div class="flex">
              <input type="checkbox">
              <div class="alert alert-success alert-dismissible fade in">${todo.description}</div>
              <button data-id="${todo.id}" class="close">x</button>
            </div>`
  };

  const render = (arr) => {
    let result = '';
      $('.container').html(result);
      arr.forEach((elem) => {
        result += createHtml(elem);
      });
      $('.container').html(result);
      $('.close').click(deleteTodo);
  };

  const addTodo = () => {
    if ($('#text').val().length != 0) {
        makeTodo($('#text').val());
        $('#text').val("");
        render(todos);
    }
  };

  const checkEnter = (event) => {
    if (event.key === KEY_ENTER) {
      addTodo();
    }
  };

  const deleteTodo = (event) => {
    const id = Number(event.target.dataset.id);
    todos.forEach((elem, index) => {
      if (id == elem.id) {
        todos.splice(index, 1);
      }
    });
    render(todos);
  };

  $('.btn').click(addTodo);
  $('#text').keydown(checkEnter);
});