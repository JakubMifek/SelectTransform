const st = require('./st');
const ST = new st.ST();

const data = {
    name: 'Jakub',
    surname: 'Mifek',
    age: 24,
}

const template = {
    name: '{{ name }}',
    surname: '{{ surname }}',
    age: '{{ age }}'
}

const result = ST.transformSync(template, data);

console.log(JSON.stringify(result, null, 2));