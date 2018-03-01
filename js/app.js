'use strict';

const store = new Store();
store.clear();

document.addEventListener('DOMContentLoaded', main);

function main() {
    const todosDone = new TasksList(document.querySelector('.todos__done .todos__items'), store, true);
    const todosUndone = new TasksList(document.querySelector('.todos__undone .todos__items'), store, false);
    [...document.querySelectorAll('.todos__items')].forEach(item => item.addEventListener('click', changeStateEventHandler));
    document.querySelector('.addform').addEventListener('submit', addTaskEventHandler);
}

function changeStateEventHandler(evt) {
    const task = evt.target.closest('.task');
    const taskId = task.dataset.id;
    switch (evt.target.className) {
        case 'task__delete':
            store.removeTask(taskId);
            break;
        case 'task__edit':
            task.classList.toggle('.task-editing');
            if (!task.classList.contains('.task-editing')) {
                store.changeTask(taskId, task.querySelector('.task__title').value);
            }
            break;
        case 'task__title':
            break;
        default:
            store.changeStateTask(taskId);
    }
}

function addTaskEventHandler(evt) {
    event.preventDefault();
    const task = document.querySelector('.addform__task').value.trim();
    if (!task) {
        return;
    }
    store.addTask(task);
    evt.currentTarget.reset();
}
