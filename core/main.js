const todoInput = document.querySelector(".input");
const addButton = document.querySelector(".todo-add-button");
const todoList = document.querySelector(".todo-list-container");

let todos = [];

function showErrorToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("error-toast");
  toast.textContent = message;
  document.body.appendChild(toast);

  toast.offsetHeight;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.add("hide");
    toast.addEventListener(
      "transitionend",
      () => {
        toast.remove();
      },
      { once: true }
    );
  }, 3000);
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
    renderTodos();
  }
}

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText !== "") {
    const todo = {
      id: Date.now(),
      text: todoText,
      completed: false,
    };
    todos.push(todo);
    renderTodo(todo);
    todoInput.value = "";
    saveTodos();
  } else {
    showErrorToast("Por favor, insira um texto para a tarefa.");
  }
}

function renderTodo(todo) {
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo-list-item");
  todoItem.setAttribute("data-id", todo.id);
  todoItem.innerHTML = `
        <label class="checkbox-container">
            <input type="checkbox" ${todo.completed ? "checked" : ""} />
            <div class="checkmark"></div>
        </label>
        <p class="todo-list-item-text ${todo.completed ? "checked" : ""}">${
    todo.text
  }</p>
        <button class="todo-list-item-delete-button">Excluir</button>
    `;

  todoList.appendChild(todoItem);

  // Add event listeners for checkbox and delete button
  const checkbox = todoItem.querySelector('input[type="checkbox"]');
  checkbox.addEventListener("change", () => toggleTodo(todo.id));

  const deleteButton = todoItem.querySelector(".todo-list-item-delete-button");
  deleteButton.addEventListener("click", () => deleteTodo(todo.id));
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  todo.completed = !todo.completed;

  // Find the corresponding todo item element
  const todoItem = document.querySelector(`[data-id="${id}"]`);
  const checkbox = todoItem.querySelector('input[type="checkbox"]');
  const checkmark = todoItem.querySelector(".checkmark");
  const todoText = todoItem.querySelector(".todo-list-item-text");

  // Update the checkbox state
  checkbox.checked = todo.completed;

  // Toggle the 'checked' class on the todo text
  todoText.classList.toggle("checked", todo.completed);

  // Reset and trigger the animation only for this checkmark
  checkmark.style.animation = "none";
  checkmark.offsetHeight; // Trigger reflow
  checkmark.style.animation = null;

  saveTodos();
}

// Função para excluir uma tarefa
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  renderTodos();
  saveTodos();
}

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach(renderTodo);
  updateTodoOrder(); // Adicione esta linha
}

addButton.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

renderTodos();
loadTodos();

function updateTodoOrder() {
  const todoItems = document.querySelectorAll(".todo-list-item");
  todos = Array.from(todoItems).map((item) => ({
    id: parseInt(item.getAttribute("data-id")),
    text: item.querySelector(".todo-list-item-text").textContent,
    completed: item.querySelector('input[type="checkbox"]').checked,
  }));
  saveTodos();
}
