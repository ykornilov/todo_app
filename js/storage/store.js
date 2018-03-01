'use strict';

class Store extends EventEmitter {
    constructor() {
        super();

        const storage = 'localStorage' in window ? localStorage.getItem('data') : null;
        if (!storage) {
            this._data = [];
            this._maxId = 0;
        } else {
            this._data = JSON.parse(storage);
            this._maxId = this._getMaxId();
        }

        this._sortByField = 'title';
        this._sortDescending = true;
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

    _getMaxId() {
        return this._getData().reduce((mem, item) => Math.max(mem, item.id), 0);
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
        this._maxId = 0;
    }

    getTasks(isDone) {
        return this._getData().filter(item => item.isDone === isDone);
    }

    addTask(taskTitle) {
        ++this._maxId;
        const task = {
            id: this._maxId,
            title: taskTitle,
            isDone: false
        };
        const newData = this._getData();
        newData.push(task);
        this._sort(newData, this._sortByField, this._sortDescending);
        this._setData(newData);
        this.emit('add', task);
    }

    changeTask(id, newTitle) {
        const newData = this._getData();
        const task = newData.find(item => item.id === parseInt(id));
        if (!task) {
            return;
        }
        task.title = newTitle;
        this._sort(newData, this._sortByField, this._sortDescending);
        this._setData(newData);
        this.emit('change', task);
    }

    removeTask(id) {
        const newData = this._getData();
        const index = newData.findIndex(item => item.id === parseInt(id));
        if (index === -1) {
            return;
        }
        const task = newData[index];
        this._setData(newData.filter(item => item !== task));
        this.emit('remove', task);
    }

    changeStateTask(id) {
        const newData = this._getData();
        const index = newData.findIndex(item => item.id === parseInt(id));
        if (index === -1) {
            return;
        }
        const task = newData[index];
        task.isDone = !task.isDone;
        this._setData(newData);
        this.emit('changeState', task);
    }
}