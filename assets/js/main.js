//Necessary elements
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoErrorMsg = document.querySelector("#error-todo");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let currentTodoId = null;
let oldInputValue;

const todos = JSON.parse(localStorage.getItem("todos")) || [];

todos.forEach((todo) => {
    createTodo(todo)
});

// Functions
// This function creates a new Todo item
function createTodo(todoItem) {
    // Create a new div element with the class 'todo'
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.setAttribute("id", `${todoItem.id}`);

    // Create a new h3 element to display the title of the todo item
    const todoTitle = document.createElement("h3");
    todoTitle.innerText = todoItem.task;
    todo.appendChild(todoTitle);

    // Create a new button element to mark the todo item as done
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    // Create a new button element to edit the todo item
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    // Create a new button element to delete the todo item
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    // Append the new todo element to the todoList
    todoList.appendChild(todo);

    // Clear the todo input field and set focus on it
    todoInput.value = "";
    todoInput.focus();
}

// Function to handle displaying error message when a task is not entered
function todoError(status) {
    if (status == "error") {
        todoInput.classList.add("error"); // Add "error" class to todoInput element
        todoErrorMsg.textContent = "Please add a task"; // Set error message text
    }

    if (status == "no-error") {
        todoInput.classList.remove("error"); // Remove "error" class from todoInput element
        todoErrorMsg.textContent = ""; // Clear error message text
    }
}

// Function to toggle visibility of forms and todoList
function toggleForms() {
    editForm.classList.toggle("hide"); // Toggle "hide" class on editForm element
    todoForm.classList.toggle("hide"); // Toggle "hide" class on todoForm element
    todoList.classList.toggle("hide"); // Toggle "hide" class on todoList element
}

// Function to update a todo item
function updateTodoItem(id, updatedText) {
    // Find the todo item with the given id
    const todo = todos.find((todo) => todo.id === id);
    // Update the task of the found todo item
    todo.task = updatedText;

    // Get the todo item element from the DOM and update its title
    const todoItem = document.getElementById(id);
    const todoTitle = todoItem.querySelector("h3");
    todoTitle.innerText = updatedText;

    // Update the localStorage with the updated todos list
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to delete a todo item
function deleteTodo(tag, id) {
    // Remove the todo item element from the DOM
    tag.remove();

    // Remove the corresponding todo item from the todos array
    todos.splice(todos.findIndex(elemento => elemento.id == id), 1)

    // Update the localStorage with the updated todos list
    localStorage.setItem("todos", JSON.stringify(todos));
}

//Events
// Event listener for when the todo form is submitted
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get the input value from the todo form
    const inputValue = todoInput.value;

    // Check if the input value is not empty
    if (inputValue) {
        // Create a new todo item object with a unique id and the task value
        const todoItem = {
            id: `${Math.floor(Math.random() * 1000000)}`,
            task: inputValue
        }

        // Remove any error styling from the input and error message
        todoError("no-error");

        // Add the new todo item to the list of todos and update local storage
        todos.push(todoItem);
        localStorage.setItem("todos", JSON.stringify(todos));

        // Create the new todo item on the page
        createTodo(todoItem);
    } else {
        // If the input value is empty, show an error message and do not create a new todo item
        todoError("error");
        return;
    }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    // Find the todo item's title
    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // Toggle the todo item's done class
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
    }

    // Toggle the edit form and set the input value and current todo id
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
        currentTodoId = parentEl.id;
    }

    // Remove the todo item
    if (targetEl.classList.contains("remove-todo")) {
        deleteTodo(parentEl, parentEl.id);
    }
})

// Event listener for cancel edit button
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let todoTitle;

    // If parent element exists and contains an h3 element, get its inner text
    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // Toggle edit form and todo list display
    toggleForms();
})

// Adds an event listener to the edit form
editForm.addEventListener("submit", (event) => {
    // Prevents the form from being submitted
    event.preventDefault();

    // Gets the edited text
    const updatedText = editInput.value.trim();

    // Checks if the text was changed
    if (updatedText !== "") {
        // Updates the task with the new text
        updateTodoItem(currentTodoId, updatedText);

        // Updates the task display on the screen
        const todoItem = document.getElementById(currentTodoId);
        const todoTitle = todoItem.querySelector("h3");
        todoTitle.innerText = updatedText;
    }

    // Hides the edit form and shows the add form again
    toggleForms();
});

