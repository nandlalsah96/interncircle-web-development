/* =========================================
   TASKFLOW - INTERACTIVE TODO LIST
   ========================================= */


/* ---------- DOM ELEMENTS ---------- */

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");

const emptyState = document.getElementById("emptyState");

const errorMessage = document.getElementById("errorMessage");

const totalTasks = document.getElementById("totalTasks");

const activeTasks = document.getElementById("activeTasks");

const completedTasks = document.getElementById("completedTasks");

const clearCompletedBtn = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll(".filter-btn");

const currentDate = document.getElementById("currentDate");


/* ---------- LOCAL STORAGE KEY ---------- */

const STORAGE_KEY = "taskflow_tasks";


/* ---------- APPLICATION STATE ---------- */

let tasks = [];

let currentFilter = "all";


/* =========================================
   INITIALIZE APPLICATION
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadTasks();

    displayDate();

    renderTasks();

});


/* =========================================
   LOAD TASKS FROM LOCAL STORAGE
   ========================================= */

function loadTasks() {

    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
        tasks = [];
        return;
    }

    try {

        tasks = JSON.parse(savedTasks);

        if (!Array.isArray(tasks)) {
            tasks = [];
        }

    } catch (error) {

        console.error("Unable to load tasks:", error);

        tasks = [];

    }

}


/* =========================================
   SAVE TASKS TO LOCAL STORAGE
   ========================================= */

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


/* =========================================
   ADD NEW TASK
   ========================================= */

taskForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const taskText = taskInput.value.trim();


    /* Prevent empty tasks */

    if (taskText === "") {

        showError("Please enter a task.");

        taskInput.focus();

        return;

    }


    /* Create new task */

    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    /* Add task to beginning of array */

    tasks.unshift(newTask);


    /* Save and update UI */

    saveTasks();

    renderTasks();


    /* Clear input */

    taskInput.value = "";

    taskInput.focus();


    clearError();

});


/* =========================================
   RENDER TASKS
   ========================================= */

function renderTasks() {

    /* Clear current list */

    taskList.innerHTML = "";


    /* Get filtered tasks */

    const filteredTasks = getFilteredTasks();


    /* Show empty state if needed */

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    /* Create task elements */

    filteredTasks.forEach((task) => {

        const taskElement = createTaskElement(task);

        taskList.appendChild(taskElement);

    });


    /* Update statistics */

    updateStatistics();

}


/* =========================================
   FILTER TASKS
   ========================================= */

function getFilteredTasks() {

    switch (currentFilter) {

        case "active":

            return tasks.filter(
                (task) => !task.completed
            );


        case "completed":

            return tasks.filter(
                (task) => task.completed
            );


        default:

            return tasks;

    }

}


/* =========================================
   CREATE TASK ELEMENT
   ========================================= */

function createTaskElement(task) {

    /* Main list item */

    const listItem = document.createElement("li");

    listItem.className = "task-item";


    if (task.completed) {

        listItem.classList.add("completed");

    }


    /* Checkbox */

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "task-checkbox";

    checkbox.checked = task.completed;

    checkbox.setAttribute(
        "aria-label",
        `Mark "${task.text}" as complete`
    );


    /* Checkbox event */

    checkbox.addEventListener("change", () => {

        toggleTask(task.id);

    });


    /* Task text */

    const textElement = document.createElement("span");

    textElement.className = "task-text";

    textElement.textContent = task.text;


    /* Delete button */

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className = "delete-btn";

    deleteButton.innerHTML = "×";

    deleteButton.setAttribute(
        "aria-label",
        `Delete "${task.text}"`
    );


    /* Delete event */

    deleteButton.addEventListener("click", () => {

        deleteTask(task.id);

    });


    /* Add elements */

    listItem.appendChild(checkbox);

    listItem.appendChild(textElement);

    listItem.appendChild(deleteButton);


    return listItem;

}


/* =========================================
   TOGGLE TASK COMPLETION
   ========================================= */

function toggleTask(taskId) {

    const task = tasks.find(
        (task) => task.id === taskId
    );


    if (!task) {
        return;
    }


    task.completed = !task.completed;


    saveTasks();

    renderTasks();

}


/* =========================================
   DELETE TASK
   ========================================= */

function deleteTask(taskId) {

    tasks = tasks.filter(
        (task) => task.id !== taskId
    );


    saveTasks();

    renderTasks();

}


/* =========================================
   FILTER BUTTONS
   ========================================= */

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        /* Remove active class */

        filterButtons.forEach((btn) => {

            btn.classList.remove("active");

        });


        /* Activate selected button */

        button.classList.add("active");


        /* Change current filter */

        currentFilter = button.dataset.filter;


        /* Update tasks */

        renderTasks();

    });

});


/* =========================================
   CLEAR COMPLETED TASKS
   ========================================= */

clearCompletedBtn.addEventListener("click", () => {

    const completedCount = tasks.filter(
        (task) => task.completed
    ).length;


    if (completedCount === 0) {

        showError("There are no completed tasks to clear.");

        return;

    }


    tasks = tasks.filter(
        (task) => !task.completed
    );


    saveTasks();

    renderTasks();

    clearError();

});


/* =========================================
   UPDATE STATISTICS
   ========================================= */

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(
        (task) => task.completed
    ).length;

    const active = total - completed;


    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;

}


/* =========================================
   DISPLAY CURRENT DATE
   ========================================= */

function displayDate() {

    const today = new Date();


    const options = {
        weekday: "short",
        month: "short",
        day: "numeric"
    };


    currentDate.textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );

}


/* =========================================
   ERROR MESSAGE
   ========================================= */

function showError(message) {

    errorMessage.textContent = message;

}


function clearError() {

    errorMessage.textContent = "";

}


/* =========================================
   KEYBOARD SUPPORT
   ========================================= */

taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        /*
         * Form submission already handles Enter.
         * This keeps keyboard behavior explicit.
         */

        event.preventDefault();

        taskForm.requestSubmit();

    }

});