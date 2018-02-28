'use strict';

class EventEmitter {
    constructor() {
        this._eventHandlers = {};
    }

    addListener(eventName, handler) {
        if (!(eventName in this._eventHandlers)) {
            this._eventHandlers[eventName] = [];
        }
        this._eventHandlers[eventName].push(handler);
    }

    removeListener(eventName, handler) {
        const handlers = eventName in this._eventHandlers ? this._eventHandlers[eventName] : null;
        if (!handlers) {
            return;
        }
        this._eventHandlers[eventName] = handlers.filter(item => item !== handler);
    }

    emit(eventName , ...args) {
        const handlers = eventName in this._eventHandlers ? this._eventHandlers[eventName] : null;
        if (!handlers) {
            return;
        }
        handlers.forEach(handler => handler.apply(this, args));
    }
}