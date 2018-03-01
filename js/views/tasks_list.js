'use strict';

class TasksList {
    constructor (node, store, isDone) {
        this._node = node;
        this._store = store;
        this._isDone = isDone;
        this._tasks = null;

        if (!this._isDone) {
            this._store.addListener('add', this._addTaskHandler.bind(this));
        }
        this._store.addListener('remove', this._removeTaskHandler.bind(this));
        this._store.addListener('change', this._changeTaskHandler.bind(this));
        this._store.addListener('changeState', this._changeStateTaskHandler.bind(this));
        this._init();
    }

    _init() {
        this._tasks = this._getTasks().map(item => {
            const task = new Task(item);
            this._node.appendChild(task.element);
            return task;
        });
    }

    _getTasks() {
        return this._store.getTasks(this._isDone);
    }

    _addTaskHandler(taskObj) {
        const index = this._getTasks().findIndex(item => item === taskObj);
        const task = new Task(taskObj);
        this._addTask(task, index);
    }

    _removeTaskHandler(taskObj) {
        if (taskObj.isDone !== this._isDone) {
            return;
        }
        const index = this._tasks.findIndex(item => item.id === taskObj.id);
        this._removeTask(index);
    }

    _changeTaskHandler(taskObj) {
        if (taskObj.isDone !== this._isDone) {
            return;
        }
        const oldIndex = this._tasks.findIndex(item => item.id === taskObj.id);
        const newIndex = this._getTasks().findIndex(item => item.id === taskObj.id);
        this._removeTask(oldIndex);
        const task = new Task(taskObj);
        this._addTask(task, newIndex);
    }

    _changeStateTaskHandler(taskObj) {
        if (taskObj.isDone !== this._isDone) {
            const index = this._tasks.findIndex(item => item.id === taskObj.id);
            this._removeTask(index);
        } else {
            const task = new Task(taskObj);
            const index = this._getTasks().findIndex(item => item.id === taskObj.id);
            this._addTask(task, index);
        }
    }

    _addTask(task, index) {
        if (index === this._tasks.length) {
            this._node.appendChild(task.element);
            this._tasks.push(task);
        } else {
            this._node.insertBefore(task.element, this._tasks[index].element);
            this._tasks.splice(index, 0, task);
        }
    }

    _removeTask(index) {
        this._node.removeChild(this._tasks[index].element);
        this._tasks.splice(index, 1);
    }

}