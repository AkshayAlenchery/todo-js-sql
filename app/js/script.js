//! Global bindings
const listMainContainer = document.getElementById('list-container')
const listContainer = document.getElementById('lists')
const listAddInput = document.getElementById('list-add-input')
const listEditInput = document.getElementById('list-name-edit')
const todoMainContainer = document.getElementById('todo-container')
const todoHeader = document.getElementById('todo-header')
const todoContainer = document.getElementById('todos')
const todoAddInput = document.getElementById('todo-add-input')
const todoEditContainer = document.getElementById('todo-edit-container')
const todoNameEdit = document.getElementById('todo-name-edit')
const todoDate = document.getElementById('todo-date')
const todoPriority = document.getElementById('todo-priority')
const todoNote = document.getElementById('todo-note')

const apiBaseURL = 'http://192.168.0.122:3000/api/v1.0'
let allLists = []
let allTodos = []

//! Reset input field
const resetInput = (event, text) => {
  event.target.setAttribute('placeholder', text)
  if (event.target.classList.contains('error')) event.target.classList.remove('error')
}

//! function to create elements
const createElement = (type, props, ...children) => {
  const dom = document.createElement(type)
  if (props) Object.assign(dom, props)
  for (const child of children) {
    if (typeof child !== 'string') dom.appendChild(child)
    else dom.appendChild(document.createTextNode(child))
  }
  return dom
}

//! To fetch a request to the API
const fetchAPI = async req => {
  try {
    const res = await fetch(req.url, req.data)
    if (res.status === 200) {
      const result = await res.json()
      return result
    }
    if (res.status === 500) {
      createError({ message: 'There was an error. Please try again later' })
      return null
    }
    if (res.status === 404) {
      createError({ message: "Couldn't find what you were looking for. Try again later" })
      return null
    }
  } catch (err) {
    createError({ message: 'There was an error. Please try again later' })
  }
}

//! Function to go back
const goBack = () => {
  todoMainContainer.classList.remove('block')
  todoMainContainer.classList += 'hide'
  listMainContainer.classList.remove('hide')
  listMainContainer.classList += 'block'
  closeEdit()
}

//! Close edit container
const closeEdit = () => {
  if (todoEditContainer.classList.contains('block')) {
    todoEditContainer.classList.remove('block')
    todoEditContainer.classList += 'hide'
  }
}

//! Function to show errors
const createError = errObj => {
  const err = document.getElementById('errors')
  err.style.display = 'block'
  err.textContent = errObj.message
  setTimeout(() => {
    err.textContent = ''
    err.style.display = 'none'
  }, 5000)
}

/* Todo Functions */

const deleteTodo = async event => {
  const todoId = parseInt(todoEditContainer.getAttribute('data-todo-id'))
  const req = {
    url: apiBaseURL + '/todo/' + todoId,
    data: {
      method: 'DELETE'
    }
  }
  const result = await fetchAPI(req)
  if (result !== null) {
    closeEdit()
    document.getElementById('td' + todoId).remove()
  }
}

const renderTodo = todo => {
  let divClass = 'todo'
  if (todo.completed === true) divClass += ' completed'
  divClass += todo.priority === 2 ? ' high' : todo.priority === 1 ? ' medium' : ''
  const todoRow = createElement(
    'div',
    {
      className: divClass,
      id: 'td' + todo.todo_id
    },
    createElement('input', {
      type: 'checkbox',
      checked: todo.completed,
      onclick: completeTodo
    }),
    createElement(
      'p',
      {
        onclick: showTodoDetails
      },
      todo.todo_name
    )
  )
  todoContainer.appendChild(todoRow)
}

const completeTodo = event => {
  const id = parseInt(event.target.parentNode.getAttribute('id').slice(2))
  updateTodo(event, 'completed', id)
}

const showTodoDetails = event => {
  const todoId = parseInt(event.target.parentNode.getAttribute('id').slice(2))
  todoEditContainer.setAttribute('data-todo-id', todoId)
  if (todoEditContainer.classList.contains('hide')) {
    todoEditContainer.classList.remove('hide')
    todoEditContainer.classList += 'block'
  }
  // else {
  //   todoEditContainer.classList.remove('block')
  //   todoEditContainer.classList += 'hide'
  // }
  const index = allTodos.findIndex(todo => todoId === todo.todo_id)
  const todo = allTodos[index]
  todoNameEdit.value = todo.todo_name
  if (todo.scheduled !== null) todoDate.value = todo.scheduled
  else todoDate.value = ''
  todoPriority.selectedIndex = todo.priority
  todoNote.textContent = todo.note
  if (todo.completed === true) toggleInputs('disable')
  else toggleInputs('enable')
}

const toggleInputs = type => {
  const inputs = [todoNameEdit, todoDate, todoPriority, todoNote]
  inputs.forEach(input => (input.disabled = type === 'disable' ? true : false))
}

const showTodos = async event => {
  const listId = parseInt(event.target.parentNode.getAttribute('id').slice(2))
  todoMainContainer.setAttribute('data-list-id', listId)
  todoHeader.setAttribute('data-list-id', listId)
  const index = allLists.findIndex(list => list.list_id === listId)
  todoHeader.childNodes[3].textContent = allLists[index].list_name
  todoHeader.childNodes[5].setAttribute('value', allLists[index].list_name)
  todoContainer.innerHTML = ''
  if (todoMainContainer.classList.contains('hide')) todoMainContainer.classList.remove('hide')
  todoMainContainer.classList += 'block'
  listMainContainer.classList.remove('block')
  listMainContainer.classList += 'hide'
  const req = {
    url: apiBaseURL + '/todo/' + listId,
    data: {
      method: 'GET'
    }
  }
  const result = await fetchAPI(req)
  if (result !== null) {
    if (result.todoCount === 0) {
      // todoContainer.appendChild(createElement('p', {}, result.message))
    } else {
      allTodos = result
      result.forEach(todo => renderTodo(todo))
    }
  }
}

const createTodo = async event => {
  const listId = parseInt(event.target.parentNode.parentNode.getAttribute('data-list-id'))
  const todoName = event.target.value
  const req = {
    url: apiBaseURL + '/todo/' + listId,
    data: {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ name: todoName })
    }
  }
  const result = await fetchAPI(req)
  if (result !== null) {
    renderTodo(result)
    allTodos.push(result)
    event.target.value = ''
  }
}

const updateTodo = async (event, type, id) => {
  const todoId = id || parseInt(todoEditContainer.getAttribute('data-todo-id'))
  const body = { type: type }
  if (type === 'completed') body.value = event.target.checked
  else body.value = event.target.value
  const req = {
    url: apiBaseURL + '/todo/' + todoId,
    data: {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(body)
    }
  }
  const result = await fetchAPI(req)
  if (result !== null) {
    if (type === 'name') {
      document.getElementById('td' + todoId).childNodes[1].textContent = body.value
      console.log(result.todo_name)
    }
    if (type === 'completed') {
      if (event.target.checked === true) {
        document.getElementById('td' + todoId).classList += ' completed'
        toggleInputs('disable')
      } else if (document.getElementById('td' + todoId).classList.contains('completed')) {
        document.getElementById('td' + todoId).classList.remove('completed')
        toggleInputs('enable')
      }
    }
    if (type === 'completed' || type === 'priority') {
      console.log('scheduled')
      const listId = parseInt(todoMainContainer.getAttribute('data-list-id'))
      const req = {
        url: apiBaseURL + '/todo/' + listId,
        data: {
          method: 'GET'
        }
      }
      todoContainer.innerHTML = ''
      const result = await fetchAPI(req)
      if (result !== null) {
        if (result.todoCount === 0) {
          // todoContainer.appendChild(createElement('p', {}, result.message))
        } else {
          allTodos = result
          result.forEach(todo => renderTodo(todo))
        }
      }
    }
  }
}

/* List Functions */

//! Load all lists
const loadAllLists = async () => {
  const req = {
    url: apiBaseURL + '/list',
    data: { method: 'GET' }
  }
  const result = await fetchAPI(req)
  if (result !== null && result.listCount !== 0) {
    allLists = result
    allLists.forEach(list => renderList(list))
  }
}

//! To delete a list
const deleteList = async event => {
  const listId = parseInt(event.target.parentNode.getAttribute('id').slice('2'))
  const req = {
    url: apiBaseURL + '/list/' + listId,
    data: { method: 'DELETE' }
  }
  const result = await fetchAPI(req)
  if (result !== null) document.getElementById('li' + listId).remove()
}

//! To add a list
const createList = async event => {
  const listName = event.target.value
  const req = {
    url: apiBaseURL + '/list',
    data: {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ listName: event.target.value })
    }
  }
  const result = await fetchAPI(req)
  if (result !== null) renderList(result)
  allLists.push(result)
  event.target.value = ''
}

//! Render all list
const renderList = list => {
  const listRow = createElement(
    'div',
    { id: 'li' + list.list_id, className: 'list' },
    createElement(
      'p',
      {
        onclick: showTodos
      },
      list.list_name
    ),
    createElement('i', {
      className: 'fas fa-trash-alt',
      onclick: deleteList
    })
  )
  listContainer.appendChild(listRow)
}

const editListName = event => {
  const listId = parseInt(event.target.parentNode.getAttribute('data-list-id'))
  if (todoHeader.childNodes[5].classList.contains('hide')) {
    todoHeader.childNodes[5].classList.remove('hide')
    todoHeader.childNodes[3].classList += 'hide'
  } else {
    todoHeader.childNodes[3].classList.remove('hide')
    todoHeader.childNodes[5].classList += 'hide'
  }
}

const updateList = async event => {
  const listId = parseInt(event.target.parentNode.getAttribute('data-list-id'))
  const req = {
    url: apiBaseURL + '/list/' + listId,
    data: {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ listName: event.target.value })
    }
  }
  const result = await fetchAPI(req)
  if (result !== null) {
    todoHeader.childNodes[3].classList.remove('hide')
    todoHeader.childNodes[3].textContent = result.list_name
    todoHeader.childNodes[5].classList += 'hide'
    document.getElementById('li' + listId).childNodes[0].textContent = result.list_name
  }
}

const searchInput = event => {
  listContainer.innerHTML = ''
  const listName = listAddInput.value
  const regex = RegExp(listName)
  allLists.forEach(list => {
    if (regex.test(list.list_name)) renderList(list)
  })
}

//! Load all lists onload
loadAllLists()

listAddInput.addEventListener('keydown', event => {
  resetInput(event, 'Search | Add a new list')
  if (event.keyCode === 13) {
    if (event.target.value === '') {
      event.target.setAttribute('placeholder', 'Please enter a list name')
      event.target.classList += 'error'
    } else createList(event)
  } else searchInput(event)
})

listEditInput.addEventListener('keydown', event => {
  resetInput(event, 'Enter a list name')
  if (event.keyCode === 13) {
    if (event.target.value === '') {
      event.target.setAttribute('placehoder', 'Please enter a list name')
      event.target.classList += 'error'
    } else updateList(event)
  }
})

todoAddInput.addEventListener('keydown', event => {
  closeEdit()
  resetInput(event, 'Add a new todo')
  if (event.keyCode === 13) {
    if (event.target.value === '') {
      event.target.setAttribute('placeholder', 'Todo cannot be empty')
      event.target.classList += 'error'
    } else createTodo(event)
  }
})

todoNameEdit.addEventListener('keydown', event => {
  resetInput(event, 'Enter a todo')
  if (event.keyCode === 13) {
    if (event.target.value === '') {
      event.target.setAttribute('placeholder', 'Todo cannot be empty')
      event.target.classList += 'error'
    } else updateTodo(event, 'name')
  }
})
todoDate.addEventListener('change', event => {
  updateTodo(event, 'scheduled')
})
todoPriority.addEventListener('change', event => {
  updateTodo(event, 'priority')
})
todoNote.addEventListener('keydown', event => {
  if (event.keyCode === 13 && event.shiftKey) updateTodo(event, 'note')
})
