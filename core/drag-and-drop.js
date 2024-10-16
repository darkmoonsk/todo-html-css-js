document.addEventListener("DOMContentLoaded", () => {
  const todoList = document.querySelector(".todo-list-container");

  new Sortable(todoList, {
    animation: 150,
    ghostClass: "sortable-ghost",
    dragClass: "sortable-drag",
    handle: ".todo-list-item",
    onStart: (evt) => {
      document.body.style.cursor = "grabbing";
    },
    onEnd: (evt) => {
      document.body.style.cursor = "";
      const todos = JSON.parse(localStorage.getItem("todos"));
      const [reorderedItem] = todos.splice(evt.oldIndex, 1);
      todos.splice(evt.newIndex, 0, reorderedItem);
      localStorage.setItem("todos", JSON.stringify(todos));
    },
  });
});

function updateTodoOrder() {
  const todoItems = document.querySelectorAll(".todo-list-item");
  const todos = Array.from(todoItems).map((item) => ({
    id: parseInt(item.getAttribute("data-id")),
    text: item.querySelector(".todo-list-item-text").textContent,
    completed: item.querySelector('input[type="checkbox"]').checked,
  }));
  localStorage.setItem("todos", JSON.stringify(todos));
}
