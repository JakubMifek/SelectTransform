import { ST } from '../st';

const st = new ST();

let data = {
    name: 'Jakub',
    surname: 'Mifek',
    age: 24,
}

let template = {
    name: '{{ name }}',
    surname: '{{ surname }}',
    age: '{{ age }}',
    test: 'test'
}

let result = st.transformSync(template, data);

console.log(JSON.stringify(result, null, 2));


data = {
    name: 'Jakub',
    surname: 'Mifek',
    age: 24,
}

template = {
    name: [
        {'{{ #if name === "Jakub" }}': 'Kuba'},
        {'{{ #else }}': '{{ name }}'}
    ],
    surname: '{{ surname }}',
    age: '{{ age }}',
    test: 'test'
}

result = st.transformSync(template, data);

console.log(JSON.stringify(result, null, 2));