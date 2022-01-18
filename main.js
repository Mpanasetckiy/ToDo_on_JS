$(() => {
  const TODOS = [];
  const KEY_ENTER = 'Enter';
  const PAGESTODO = 5;
  let page = 1;
  const { _ } = window;

  function Todo(description) {
    this.id = Date.now();
    this.description = description;
    this.checked = false;
  }

  const makeTodo = (description) => {
    TODOS.push(new Todo(description));
  };

  const render = (arr) => {
    let result = '';

    arr.forEach((todo) => {
      const item = _.escape(todo.description);
      result += `<div class="flex shadow-lg p-3 mb-1 bg-white">
                  <input class="elem-input" data-id="${todo.id}" id="btn" type="checkbox" ${todo.checked ? 'checked' : ''}>
                  <span type="text" class="task task-${todo.id}" data-id="${todo.id}">${item}</span>
                  <input type="text" class="edit edit-${todo.id} none"  data-id="${todo.id}">
                  <button type="button" data-id="${todo.id}" class="close btn-close" aria-label="Close"></button>
                </div>`;
    });
    $('.container').html(result);
    count();
  };

  const fillFiveTodos = () => {
    const start = (page - 1) * PAGESTODO;
    const end = start + PAGESTODO;
    const slicedTodos = TODOS.slice(start, end);
    render(slicedTodos);
  };

  const checkTodo = () => {
    let check = true;
    const mainCheck = $('#main')[0];
    TODOS.forEach((elem) => {
      check = check && elem.checked;
    });
    if (check) {
      mainCheck.checked = true;
    } else {
      mainCheck.checked = false;
    }
  };

  const removePage = () => {
    const start = (page - 1) * PAGESTODO;
    const end = start + PAGESTODO;
    if (page !== 1 && (TODOS.slice(start, end).length === 0)) {
      $(`.page-${page}`).remove();
      page -= 1;
      fillFiveTodos();
    } else {
      fillFiveTodos();
    }
  };

  const isChecked = (event) => {
    const id = Number(event.target.dataset.id);
    TODOS.forEach((element) => {
      const elem = element;
      if (id === elem.id) {
        if (event.target.checked) {
          elem.checked = true;
        } else {
          elem.checked = false;
        }
      }
    });
    checkTodo();
    removePage();
  };

  const fillButtons = () => {
    page = Math.ceil(TODOS.length / PAGESTODO);
    let buttons = '';
    for (let i = 1; i <= page; i += 1) {
      buttons += `<button class='page btn-secondary btn-lg' 
      data="${i}">${i}</button>`;
    }
    $('.pagination').html(buttons);
    fillFiveTodos();
  };

  const addTodo = () => {
    if ($('#text').val().trim().length !== 0) {
      makeTodo($('#text').val());
      $('#text').val('');
      render(TODOS);
      fillButtons();
    }
  };

  const checkEnter = (event) => {
    if (event.key === KEY_ENTER) {
      addTodo();
    }
  };

  const deleteTodo = (event) => {
    const id = Number(event.target.dataset.id);
    TODOS.forEach((elem, index) => {
      if (id === elem.id) {
        TODOS.splice(index, 1);
      }
    });
    removePage();
  };

  const checkAll = (event) => {
    TODOS.forEach((element) => {
      const elem = element;
      if (event.target.checked) {
        elem.checked = true;
      } else {
        elem.checked = false;
      }
    });
    render(TODOS);
    removePage();
  };

  const switchTabs = (activeButton) => {
    switch (activeButton) {
      case 'All':
        removePage();
        break;
      case 'Active':
        render(TODOS.filter((elem) => !elem.checked));
        break;
      case 'Completed':
        render(TODOS.filter((elem) => elem.checked));
        break;
      default: render();
    }
  };

  const getActiveBtn = (event) => {
    const activeBtn = event.target.getAttribute('data');
    switchTabs(activeBtn);
  };

  const createHtmlTask = (active, done) => `
            <button class="total-tasks btn-secondary btn-lg" data="All">All: ${TODOS.length}</button>
            <button class="active-tasks btn-secondary btn-lg" data="Active">Active: ${active}</button>
            <button class="completed-tasks btn-secondary btn-lg" data="Completed">Completed: ${done}</button>  
          `;

  const inner = (active, done) => {
    let result = '';
    result = createHtmlTask(active, done);
    $('.tasks-counter').html(result);
  };

  const editTodoBlur = (id) => {
    const span = document.querySelector(`.task-${id}`);
    const input = document.querySelector(`.edit-${id}`);

    input.classList.add('none');
    span.classList.remove('none');

    if (input.value.trim() !== '') {
      span.innerHTML = _.escape(input.value);
      TODOS.forEach((element) => {
        const elem = element;
        if (id === elem.id) {
          elem.description = input.value;
        }
      });
    }
  };

  const checkEnterAgain = (event) => {
    if (event.key === KEY_ENTER) {
      const id = Number(event.target.dataset.id);
      editTodoBlur(id);
    }
  };

  const onBlur = (event) => {
    const id = Number(event.target.dataset.id);
    editTodoBlur(id);
  };

  const editTodoClick = (event) => {
    const id = Number(event.target.dataset.id);

    const span = document.querySelector(`.task-${id}`);
    const input = document.querySelector(`.edit-${id}`);

    span.classList.add('none');
    input.classList.remove('none');

    input.value = span.innerHTML;
    input.addEventListener('blur', onBlur);
  };

  const count = () => {
    let active = 0;
    let done = 0;
    TODOS.forEach((elem) => {
      if (elem.checked) {
        done += 1;
      } else {
        active += 1;
      }
    });
    $('.close').click(deleteTodo);
    $('.task').dblclick(editTodoClick);
    $('.edit').keydown(checkEnterAgain);
    $('.elem-input').click(isChecked);
    inner(active, done);
  };
  $('.close').click(deleteTodo);
  const currentPage = (event) => {
    if (event.target.type === 'submit') {
      page = event.target.getAttribute('data');
      const start = (page - 1) * PAGESTODO;
      const end = start + PAGESTODO;
      render(TODOS.slice(start, end));
    }
  };
  $('#btn').click(addTodo);
  $('#text').keydown(checkEnter);
  $('#main').click(checkAll);
  $('.tasks-counter').click(getActiveBtn);
  $('.pagination').click(currentPage);
});
