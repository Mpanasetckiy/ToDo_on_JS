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
              <input class="elem-input" data-id="${todo.id}" type="checkbox" ${todo.checked ? "checked" : ""}>
              <div class="container" data-id="${todo.id}">${todo.description}</div>
              <button data-id="${todo.id}" class="close">x</button>
            </div>`
  };

  const checkTodo = () => {
    let check = true;
    const mainCheck = $('.main')[0];
    todos.forEach((elem) => {
      check = check && elem.checked;
    });
    if(check){
      mainCheck.checked = true;
    }else{
      mainCheck.checked = false;
    }
  }

  const isChecked = (event) => {
    const id = Number(event.target.dataset.id);
    todos.forEach((elem) => {
      if (id === elem.id) {
        if(event.target.checked){
          elem.checked = true;

        } else {
          elem.checked = false;
        }
      }
    });
    checkTodo();
    render(todos);
  };

  const render = (arr) => {
    let result = '';
      arr.forEach((elem) => {
        result += createHtml(elem);
      });
      $('.container').html(result);
      $('.close').click(deleteTodo);
      $('.elem-input').click(isChecked);
      count();
     };

  const addTodo = () => {
    if ($('#text').val().length !== 0) {
        makeTodo($('#text').val());
        $('#text').val("");
        render(todos);
    } else alert("Enter some Text!");
  };

  const checkEnter = (event) => {
    if (event.key === KEY_ENTER) {
      addTodo();
    }
  };

  const deleteTodo = (event) => {
    const id = Number(event.target.dataset.id);
    todos.forEach((elem, index) => {
      if (id === elem.id) {
        todos.splice(index, 1);
      }
    });
    render(todos);
  };

  const checkAll = (event) => {
    todos.forEach((elem, index) => {
     if(event.target.checked){
      elem.checked = true;
     } else {
      elem.checked = false;
     }
    });
    render(todos);
  };

  $('.btn').click(addTodo);
  $('#text').keydown(checkEnter);
  $('.main').click(checkAll);

  const count = () => {
    let active = 0;
    let done = 0;
    todos.forEach((elem) => {
      if(elem.checked) {
        done++;
      } else {
        active++;
      }
    });
    inner(active, done);
    
  };
  
  const createHtmlTask = (active, done) => {
    return `<div class="total-tasks">Total tasks:${todos.length}</div>
            <div class="active-tasks">Active tasks:${active}</div>
            <div class="completed-tasks">Completed tasks:${done}</div>  
	         `
  };

  const inner = (active, done) => {
    let result = '';
    result = createHtmlTask(active, done);
    $('.tasks-counter').html(result);
  };

});

