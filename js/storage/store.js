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
        const task = newData.find(item => item.id === id);
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
        const index = newData.findIndex(item => item.id === id);
        if (index === -1) {
            return;
        }
        const task = newData[index];
        this._setData(newData.filter(item => item !== task));
        this.emit('remove', task);
    }

    changeStateTask(id, isDone) {
        const newData = this._getData();
        const index = newData.findIndex(item => item.id === id);
        if (index === -1) {
            return;
        }
        const task = newData[index];
        task.isDone = isDone;
        this._setData(newData);
        this.emit('changeState', task);
    }
}