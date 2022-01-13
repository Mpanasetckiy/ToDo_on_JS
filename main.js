$(function() {
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
    const item = _.escape(todo.description);
    return ` <div class="flex">
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
    render(todos);
  };

  const render = (arr) => {
    let result = '';
   
      arr.forEach((elem) => {
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
      }pagination();
   
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

 
  
  const switchTabs = (activeBtn) => {
    let filtratedArray = [];
    switch (activeBtn) {
      case 'All':
        render(todos);
        break;
      case 'Active':
        render(todos.filter((elem) => !elem.checked));
        break;
      case 'Completed': 
        render(todos.filter((elem) => elem.checked));
        break;
      default: return filtratedArray;
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
            <button id ="btn-total" class="total-tasks badge bg-secondary" data="All">All: ${todos.length}</button>
            <button class="active-tasks badge bg-secondary" data="Active">Active: ${active}</button>
            <button class="completed-tasks badge bg-secondary" data="Completed">Completed: ${done}</button>  
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
  
  const pagination = () => {
     const m = Math.ceil(todos.length/5);

       if (todos.length%5 === 1) {
        $('.pagination').append(`<div  class='page btn-secondary' data="${m}">${m}</div>`);
       }


     
  };
//const btns = document.querySelector('.pagination');
 //   btns.addEventListener('click', (event) => {
 //     showCurrentPage(event);
  //  });
  
  const showCurrentPage = (event) => {
    let currentPage = event.target.getAttribute(`data`);
    showCurrentList(currentPage)
    console.log(currentPage);
  };

  const showCurrentList = (currentPage) => {
    let start = (currentPage-1)*5;
    render(todos.slice((currentPage-1)*5, (start) + 5));

      
      console.log(currentPage);
    
  }
  
  
  
   $('.pagination').click(showCurrentPage);

  
  
render(todos);
});

