$(() => {
  const TODOS = [];
  const KEY_ENTER = 'Enter';
  const PAGESTODO = 5;
  const INITIAL_EVENT = document.querySelector('.main');
  const CONTAINER_EVENT = document.querySelector('.container');
  const INPUT_ENTER = document.querySelector('.input');
  const TASK_COUNTER = document.querySelector('.tasks-counter');
  const ACTUAL_PAGE = document.querySelector('.pagination');
  let page = 1;
  const { _ } = window;

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

  const counter = () => {
    let active = 0;
    let done = 0;
    TODOS.forEach((elem) => {
      if (elem.checked) {
        done += 1;
      } else {
        active += 1;
      }
    });
    inner(active, done);
  };

  const render = (arr) => {
    console.log(arr);
    let result = '';

    arr.forEach((todo) => {
      const item = _.escape(todo.description);
      result += `<div class="flex shadow-lg p-3 mb-1 bg-white">
                  <input class="elem-input" data-id="${todo.id}" id="btn" type="checkbox" ${todo.checked ? 'checked' : ''}>
                  <span type="text" class="task task-${todo.id}" data-id="${todo.id}">${item}</span>
                  <input type="text" class="edit edit-${todo.id} none" data-id="${todo.id}">
                  <button type="button" data-id="${todo.id}" class="close btn-close" aria-label="Close"></button>
                </div>`;
    });
    $('.container').html(result);
    counter();
  };

  const fillFiveTodos = () => {
    const start = (page - 1) * PAGESTODO;
    const end = start + PAGESTODO;
    const slicedTodos = TODOS.slice(start, end);
    render(slicedTodos);
  };

  const checkTodo = () => {
    const checked = true;
    const checkAll = $('#main')[0];
    const check = TODOS.every((elem) => checked === elem.checked);
    checkAll.checked = check;
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
    const elem = TODOS.find((element) => element.id === id);
    if (event.target.checked) {
      elem.checked = true;
    } else {
      elem.checked = false;
    }
    checkTodo();
    removePage();
  };

  const fillButtons = () => {
    page = Math.ceil(TODOS.length / PAGESTODO);
    let buttons = '';
    for (let i = 1; i <= page; i += 1) {
      buttons += `<button class='page page-${i} btn-secondary btn-sm' 
      data="${i}">${i}</button>`;
    }
    $('.pagination').html(buttons);
    fillFiveTodos();
  };

  const addTodo = () => {
    if ($('#text').val().length !== 0) {
      const inputValue = $('#text').val().trim();
      const newTodo = {
        description: inputValue,
        checked: false,
        id: Date.now(),
      };
      TODOS.push(newTodo);
      $('#text').val('');
      render(TODOS);
      fillButtons();
      checkTodo();
    }
  };

  const deleteTodo = (event) => {
    const id = Number(event.target.dataset.id);
    TODOS.forEach((elem, index) => {
      if (id === elem.id) {
        TODOS.splice(index, 1);
      }
    });
    checkTodo();
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
    if (event.target.type === 'submit') {
      const activeBtn = event.target.getAttribute('data');
      switchTabs(activeBtn);
    }
  };

  const editTodoBlur = (id) => {
    const span = document.querySelector(`.task-${id}`);
    const input = document.querySelector(`.edit-${id}`);

    input.classList.add('none');
    span.classList.remove('none');

    if (input.value !== '') {
      span.innerHTML = _.escape(input.value.trim());
      TODOS.forEach((element) => {
        const elem = element;
        if (id === elem.id) {
          elem.description = input.value;
        }
      });
    }
  };

  const editTodoClick = (event) => {
    const id = Number(event.target.dataset.id);

    const span = document.querySelector(`.task-${id}`);
    const input = document.querySelector(`.edit-${id}`);

    span.classList.add('none');
    input.classList.remove('none');
    input.focus();

    input.value = span.innerHTML;
    input.addEventListener('blur', (Event) => {
      const idElem = Number(Event.target.dataset.id);
      editTodoBlur(idElem);
    });
  };

  const currentPage = (event) => {
    page = event.target.getAttribute('data');
    const start = (page - 1) * PAGESTODO;
    const end = start + PAGESTODO;
    render(TODOS.slice(start, end));
  };

  CONTAINER_EVENT.addEventListener('click', (event) => {
    if (event.target.type === 'button') {
      deleteTodo(event);
    } else if (event.target.type === 'checkbox') {
      isChecked(event);
    }
  });

  CONTAINER_EVENT.addEventListener('dblclick', (event) => {
    if (event.target.matches('.task')) {
      editTodoClick(event);
    }
  });

  CONTAINER_EVENT.addEventListener('keydown', (event) => {
    if (event.key === KEY_ENTER) {
      const id = Number(event.target.dataset.id);
      editTodoBlur(id);
    }
  });

  INITIAL_EVENT.addEventListener('click', (event) => {
    if (event.target.type === 'submit') {
      addTodo(event);
    } else if (event.target.type === 'checkbox') {
      checkAll(event);
    }
  });

  INPUT_ENTER.addEventListener('keydown', (event) => {
    if (event.key === KEY_ENTER) {
      addTodo(event);
    }
  });

  TASK_COUNTER.addEventListener('click', (event) => {
    if (event.target.type === 'submit') {
      getActiveBtn(event);
    }
  });

  ACTUAL_PAGE.addEventListener('click', (event) => {
    if (event.target.type === 'submit') {
      currentPage(event);
    }
  });
});
