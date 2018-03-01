'use strict';

function e(name, props, ...childs) {
    return {name, props, childs};
}

function createElement(el) {
    if (typeof el === 'string') {
        return document.createTextNode(el);
    }

    if (typeof el === 'object' && el !== null && el.name) {
        const element = document.createElement(el.name);

        if (el.props && typeof el.props === 'object') {
            for (const prop in el.props) {
                if (prop === 'class') {
                    element.className = el.props[prop];
                } else if (prop === 'style') {
                    //?????????? ??????
                } else if (prop.indexOf('data-') !== -1) {
                    //?????????? data-??????????
                    let nameOfParam = prop
                        .split('-')
                        .slice(1)
                        .reduce((mem, part) =>
                            mem
                                ? mem + part.split('')
                                .map(letter, index => index ? letter : letter.toUpperCase())
                                .join('')
                                : part
                        , null);
                    element.dataset[nameOfParam] = el.props[prop];
                } else if (prop === 'checked') {
                    if (el.props[prop]) {
                        element.setAttribute(prop, el.props[prop]);
                    }
                } else {
                    element.setAttribute(prop, el.props[prop]);
                }
            }
        }

        if ('childs' in el && Array.isArray(el.childs)) {
            el.childs.forEach(child => element.appendChild(createElement(child)));
        }

        return element;
    }

    return document.createTextNode('');
}