$(() => {
  let TODOS = [];
  const KEY_ENTER = 'Enter';
  const PAGESTODO = 5;
  const INITIAL_EVENT = document.querySelector('.todo__menu');
  const CONTAINER_EVENT = document.querySelector('.todo__wrapper');
  const INPUT_ENTER = document.querySelector('.todo__input');
  const TASK_COUNTER = document.querySelector('.todo__counter');
  const ACTUAL_PAGE = document.querySelector('.todo__pagination');
  let page = 1;
  const { _ } = window;
  let tabValue = 'All';

  const createHtmlTask = (active, done) => `
            <button class="total-tasks btn-secondary btn-lg" data="All">All: ${TODOS.length}</button>
            <button class="active-tasks btn-secondary btn-lg" data="Active">Active: ${active}</button>
            <button class="completed-tasks btn-secondary btn-lg" data="Completed">Completed: ${done}</button>  
          `;

  const inner = (active, done) => {
    let result = '';
    result = createHtmlTask(active, done);
    $('.todo__counter').html(result);
    
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
    let result = '';

    arr.forEach((todo) => {
      result += `<li class="todo__task shadow-lg p-3 mb-1 bg-white">
                  <input class="todo__task-input" data-id="${todo.id}" id="btn" type="checkbox" ${todo.checked ? 'checked' : ''}>
                  <span type="text" class="task task-${todo.id}" data-id="${todo.id}">${todo.description}</span>
                  <input type="text" value="${todo.description}" class="edit edit-${todo.id} disabled" data-id="${todo.id}">
                  <button type="button" data-id="${todo.id}" class="close btn-close" aria-label="Close"></button>
                </li>`;
    });
    $('.todo__wrapper').html(result);
    counter();
  };

  const fillFiveTodos = (arr = TODOS) => {
    const start = (page - 1) * PAGESTODO;
    const end = start + PAGESTODO;
    const slicedTodos = arr.slice(start, end);
    render(slicedTodos);
  };

  const checkTodo = () => {
    const checked = true;
    const checkAll = $('#main')[0];
    const check = TODOS.every((elem) => checked === elem.checked);
    checkAll.checked = check;
    addActive();
  };

  const removePage = () => {
    const start = (page - 1) * PAGESTODO;
    const end = start + PAGESTODO;
    if (page !== 1 && (TODOS.slice(start, end).length === 0)) {
      $(`.page-${page}`).remove();
      page -= 1;
      fillButtons();
      addActive();
    } else {
      fillButtons();
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
    fillFiveTodos();
  };

  const fillButtons = (arr = TODOS) => {
    page = Math.ceil(arr.length / PAGESTODO);
    let buttons = '';
    for (let i = 1; i <= page; i += 1) {
      buttons += `<button class='todo__page page-${i} btn-secondary btn-sm' 
      data="${i}">${i}</button>`;
    }
    $('.todo__pagination').html(buttons);
    fillFiveTodos(arr);
    addActive();
  };

  const addTodo = () => {
    if ($('.todo__input').val().trim().length !== 0) {
      const inputValue = $('.todo__input').val().trim();
      const newTodo = {
        description: _.escape(inputValue),
        checked: false,
        id: Date.now(),
      };
      TODOS.push(newTodo);
      $('.todo__input').val('');
      fillButtons();
      checkTodo();
    }
  };

  const deleteAllTodo = () => {
    TODOS = TODOS.filter((element) => !element.checked);
    removePage();
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
    fillButtons();
  };

  const switchTabs = (activeButton) => {
    switch (activeButton) {
      case 'All':
        removePage();
        fillButtons();
        tabValue = 'All';
        break;
      case 'Active':
        fillButtons(TODOS.filter((elem) => !elem.checked));
        tabValue = 'Active';
        break;
      case 'Completed':
        fillButtons(TODOS.filter((elem) => elem.checked));
        tabValue = 'Completed';
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

    input.classList.add('disabled');
    span.classList.remove('disabled');

    if (input.value.trim() !== '') {
      span.innerHTML = input.value.trim();
      TODOS.forEach((element) => {
        const elem = element;
        if (id === elem.id) {
          elem.description = _.escape(input.value);
        }
      });
    }
  };

  const editTodoClick = (event) => {
    const id = Number(event.target.dataset.id);

    const span = document.querySelector(`.task-${id}`);
    const input = document.querySelector(`.edit-${id}`);
    const inputEditValue = input.value;

    span.classList.add('disabled');
    input.classList.remove('disabled');
    input.focus();
    span.innerHTML = inputEditValue;
    input.addEventListener('blur', (Event) => {
      const idElem = Number(Event.target.dataset.id);
      editTodoBlur(idElem);
    });
  };

  const addActive = (pg = page) => {
    const buttonsPage = document.querySelectorAll('.todo__page');
    buttonsPage.forEach((elem) => {
      elem.classList.remove('active');
      if (elem.innerHTML == pg) {
          elem.classList.add('active');
      }
    });
  };

  const currentPage = (event) => {
    page = event.target.getAttribute('data');
    const start = (page - 1) * PAGESTODO;
    const end = start + PAGESTODO;
    if (tabValue === 'All') {
      render(TODOS.slice(start, end));
    } else if (tabValue === 'Active') {
      fillFiveTodos(TODOS.filter((elem) => !elem.checked));
    } else {
      fillFiveTodos(TODOS.filter((elem) => elem.checked));
    }
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
    if (event.target.type === 'button') {
      deleteAllTodo();
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
      addActive();
    }
  });
});
