$(document).ready(function() {
  const todos = [];
  const KEY_ENTER = 'Enter';


  function Todo(description) {
    this.id = Date.now();
    this.description = description;
    this.checked = false;
    // this.class = "active";
  
  }

  const makeTodo = (description) => {
    todos.push(new Todo(description));
  };

  const createHtml = (todo) => {
    const item = _.escape(todo.description);
    return ` <div class="flex grid">
              <input class="elem-input" data-id="${todo.id}" type="checkbox" ${todo.checked ? "checked" : ""}>
              <span type="text" class="task task-${todo.id}" data-id="${todo.id}">${item}</span>
              <input type="text" class="edit edit-${todo.id} none"  data-id="${todo.id}">
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
        console.log(elem);
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
    return `<label for="total-tasks">All:</label>
            <div class="total-tasks">${todos.length}</div>
            <div class="active-tasks">Active: ${active}</div>
            <div class="completed-tasks">Completed: ${done}</div>  
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
    
    let i = _.escape(input.value);

    if(input.value.trim() !== ""){
    const inputValue = input.value;
     
    span.innerHTML = i;
  
    todos.forEach((elem) => {
      if (id === elem.id){
        elem.description = inputValue;
      }
      });
    }
    };
  
    const pagination = () => {
    const tasks = document.querySelector(`.total-tasks`);
    const taskDiv = $(`.flex`);
    const taskCount = tasks.innerHTML;
       let fig = taskCount%5;
       let m = Math.ceil(taskCount/5);
            if (fig === 1) {
          $('.pagination').append("<div class='page'>"+m+"</div>");
          }
          $(".page:first-child").addClass('active');
          $(`.flex`).filter(function( index ) { return index < 5;}).addClass('active');
          $('body').delegate('.page','click',function(){
            let page_index=$(this).index();
            let start=page_index*5;
            taskDiv.removeClass('active');
          $(".page").removeClass('active');
          $(".page").eq(page_index).addClass('active');
            for(let j=0;j<5;j++){
            taskDiv.eq(start+j).addClass('active');
          }
        });
    };render(todos);
});

