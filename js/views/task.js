'use strict';

class Task {
    constructor (data) {
        this._element = null;
        this._data = data;

        this._createElement(this._data);
    }

    get element() {
        return this._element;
    }

    get id() {
        return this._data.id;
    }

    _createElement(data) {
        const content = e(
            'li',
            { 'class': 'task', 'data-id': data.id },
            e(
                'label',
                { 'class': 'task__label' },
                e(
                    'input',
                    { 'type': 'checkbox', 'class': 'task__state', 'checked': data.isDone },
                    null
                ),
                data.title
            ),
            e(
                'input',
                { 'type': 'text', 'class': 'task__title', 'value': data.title },
                null
            ),
            e(
                'button',
                { 'class': 'task__edit' },
                'Изменить'
            ),
            e(
                'button',
                { 'class': 'task__delete' },
                'Удалить'
            )
        );
        this._element = createElement(content);
    }
}
