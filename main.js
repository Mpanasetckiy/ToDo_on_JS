$(function() {
  const todos = [];
  const KEY_ENTER = 'Enter';
  let page = 1;
    function Todo(description) {
    this.id = Date.now();
    this.description = description;
    this.checked = false;
   }

  const makeTodo = (description) => {
    todos.push(new Todo(description));
  };

  const createHtml = (todo) => {
    const item = _.escape(todo.description);
    return ` <div class="flex shadow-lg p-3 mb-1 bg-white">
              <input class="elem-input" data-id="${todo.id}" id="btn" type="checkbox" ${todo.checked ? "checked" : ""}>
              <span type="text" class="task task-${todo.id}" data-id="${todo.id}">${item}</span>
              <input type="text" class="edit edit-${todo.id} none"  data-id="${todo.id}">
              <button type="button" data-id="${todo.id}" class="close btn-close" aria-label="Close"></button>
            </div>`
  };

  const checkTodo = () => {
    let check = true;
    const mainCheck = $('#main')[0];
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
    removePage();
    
  };
   
  const render = (todos) => {
    let result = '';
   
      todos.forEach((elem) => {
        result += createHtml(elem);
      });
      $('.container').html(result);
      $('.close').click(deleteTodo);
      $('.edit').keydown(checkEnterAgain);
      $('.elem-input').click(isChecked);
      $('.task').dblclick(editTodoClick);
      count();
     
     };

  const addTodo = () => {
    if ($('#text').val().trim().length !== 0) {
        makeTodo($('#text').val());
        $('#text').val("");
         render(todos);
         fillButtons();
      } 
   };
     
  const checkEnter = (event) => {
    if (event.key === KEY_ENTER) {
      addTodo();
    }
  };
  
  const checkEnterAgain = (event) => {
    if (event.key === KEY_ENTER) {
      const id = Number(event.target.dataset.id);
       qwe(id);
    }
  };

  const removePage = () => {
    let start = (page-1)*5;
    let end = start + 5;
     if (page !== 1 && (todos.slice(start, end).length === 0)) {
        $(`.page-${page}`).remove();
        page -= 1;
        fillFiveTodos();
      } else {
        fillFiveTodos();
      }
      console.log(todos.slice(start, end));
      console.log(page);
 };

  const deleteTodo = (event) => {
        const id = Number(event.target.dataset.id);
    todos.forEach((elem, index) => {
      if (id === elem.id) {
        todos.splice(index, 1);
      }
    });    
    removePage();
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
    removePage();
  };

 // const  currentPageChecked = (arr) =>{
 //   let start = (page-1)*5;
 //    let end = start + 5;
 //    render(arr.slice(start, end));
  //}

  const switchTabs = (activeBtn) => {
   
    switch (activeBtn) {
      case 'All':
      //  render(todos);
        removePage();
        break;
      case 'Active':
        render(todos.filter((elem) => !elem.checked))
        
        break;
      case 'Completed': 
        render(todos.filter((elem) => elem.checked));
        
        break;
      }
  };
  
  const getActiveBtn = (event) => {
    const activeBtn = event.target.getAttribute('data');
     switchTabs(activeBtn);
  };

  $('#btn').click(addTodo);
  $('#text').keydown(checkEnter);
  $('#main').click(checkAll);
  $(".tasks-counter").click(getActiveBtn);
    
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
    return `
            <button class="total-tasks btn-secondary btn-lg" data="All">All: ${todos.length}</button>
            <button class="active-tasks btn-secondary btn-lg" data="Active">Active: ${active}</button>
            <button class="completed-tasks btn-secondary btn-lg" data="Completed">Completed: ${done}</button>  
	         `
  };

  const inner = (active, done) => {
    let result = '';
    result = createHtmlTask(active, done);
    $('.tasks-counter').html(result);
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
  
  const onBlur = (event) => {
    const id = Number(event.target.dataset.id);
        qwe(id);
    };

  const qwe = (id) => {
    const span = document.querySelector(`.task-${id}`);
    const input = document.querySelector(`.edit-${id}`);
    
      input.classList.add('none');
      span.classList.remove('none');
    
      if(input.value.trim() !== ""){
           
        span.innerHTML = _.escape(input.value);
        todos.forEach((elem) => {
          if (id === elem.id){
             elem.description = input.value;
          }
        });
      }
  };

  const fillFiveTodos = () => {
    let start = (page - 1) * 5;
    let end = start + 5;
    let slicedTodos = todos.slice(start, end)
    render(slicedTodos);
  };

  const fillButtons = () => {
    page = Math.ceil(todos.length/5);
    let buttons = '';
    $('.pagination').html(buttons)
    for(let i = 1; i <= page; i++) {
      buttons += makeButtons(i);
    }
    $('.pagination').html(buttons);
    fillFiveTodos();
  };

  const makeButtons = (num) => {
    return `
      <button class='page page-${num} btn-secondary btn-lg'data="${num}">${num}</button>
    `
  };
    
  const currentPage = (event) => {
     if (event.target.type === 'submit') {
     page = event.target.getAttribute(`data`);
     let start = (page-1)*5;
     let end = start + 5;
     render(todos.slice(start, end));
    }
  };

  $('.pagination').click(currentPage);
  render(todos);
});

