'use strict';

class Store extends EventEmitter {
    constructor() {
        super();

        const storage = 'localStorage' in window ? localStorage.getItem('data') : null;
        if (!storage) {
            this._data = [];
        } else {
            this._data = JSON.parse(storage);
        }

        this._sortByField = 'title';
        this._sortDescending = false;
    }

    _getData() {
        return [...this._data];
    }

    _setData(newData) {
        this._data = newData;
        if('localStorage' in window) {
            localStorage.setItem('data', JSON.stringify(newData));
        }
    }

    _sortCallback(a, b, descending) {
        const res = a.localeCompare(b);
        return descending ? -1 * res : res;
    }

    _sort(objects, key, descending) {
        return objects.sort((a, b) => this._sortCallback(a[key], b[key], descending));
    }

    clear() {
        this._setData([]);
    }

    addTask(taskTitle) {
        const task = {
            title: taskTitle,
            isDone: false
        };
        const newData = this._getData();
        newData.push(task);
        this._sort(newData, this._sortByField, this._sortDescending);
        this._setData(newData);

        const index = newData.findIndex(item => item === task);
        this.emit('add', task, index);
    }

    changeTask(oldTitle, newTitle) {
        const newData = this._getData();
        const task = newData.find(item => item.title === oldTitle);
        if (!task) {
            return;
        }
        const oldIndex = newData.findIndex(item => item === task);
        task.title = newTitle;
        this._sort(newData, this._sortByField, this._sortDescending);
        this._setData(newData);

        const newIndex = newData.findIndex(item => item === task);
        this.emit('change', task, oldIndex, newIndex);
    }

    removeTask(taskTitle) {
        const newData = this._getData();
        const index = newData.findIndex(item => item.title === taskTitle);
        if (index === -1) {
            return;
        }
        const task = newData[index];
        this._setData(newData.filter(item => item !== task));

        this.emit('remove', task, index);
    }

    changeStateTask(taskTitle, isDone) {
        const newData = this._getData();
        const index = newData.findIndex(item => item.title === taskTitle);
        if (index === -1) {
            return;
        }
        const task = newData[index];
        task.isDone = isDone;
        this._setData(newData);

        this.emit('changeState', task, index);
    }
}