'use strict';

var _st = require('../st');

var st = new _st.ST();

var data = {
    name: 'Jakub',
    surname: 'Mifek',
    age: 24
};

var template = {
    name: '{{ name }}',
    surname: '{{ surname }}',
    age: '{{ age }}',
    test: 'test'
};

var result = st.transformSync(template, data);

console.log(JSON.stringify(result, null, 2));

data = {
    name: 'Jakub',
    surname: 'Mifek',
    age: 24
};

template = {
    name: [{ '{{ #if name === "Jakub" }}': 'Kuba' }, { '{{ #else }}': '{{ name }}' }],
    surname: '{{ surname }}',
    age: '{{ age }}',
    test: 'test'
};

result = st.transformSync(template, data);

console.log(JSON.stringify(result, null, 2));