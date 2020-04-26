# SelectTransform

This project is based upon https://github.com/SelectTransform/st.js but differs
in implementation, functionality and robustness.

## Description
SelectTransform is a module that eases transformation of JS objects using JSON template and JS input data object.

JSON template may contain special readable notation describing how to transform data objects.

## Installation

`npm i selecttransform`

## Example Usage

### JavaScript
```js
const ST = require('selecttransform').SelectTransform;

const st = new ST();

const data = {
  name: 'Jakub',
  friends: [
    {
      name: 'Michal',
    },
  ],
};

const template = {
  name: '{{ name }}',
  friends: {
    '{{ #each friends }}': {
      index: '{{ $index }}',
      name: '{{ name }}',
    },
  },
};

// Or you can use transformSync
st.transform(template, data).then(console.log);

// Result:
/**
 * {
 *   "name": "Jakub",
 *   "friends": [
 *     {
 *       "index": 0,
 *       "name": "Michal"
 *     },
 *   ],
 * }
 */
```

### TypeScript
```js
import { SelectTrasnform as ST } from 'selecttransform';

const st = new ST();

const data = {
  name: 'Jakub',
  friends: [
    {
      name: 'Michal',
    },
  ],
};

const template = {
  name: '{{ name }}',
  friends: {
    '{{ #each friends }}': {
      index: '{{ $index }}',
      name: '{{ name }}',
    },
  },
};

// Or you can use transform and promise-like structure
console.log(st.transformSync(template, data));

// Result:
/**
 * {
 *   "name": "Jakub",
 *   "friends": [
 *     {
 *       "index": 0,
 *       "name": "Michal"
 *     },
 *   ],
 * }
 */
```

For complete documentation see **[Wiki](https://github.com/JakubMifek/SelectTransform/wiki)** or *[tests](https://github.com/JakubMifek/SelectTransform/tree/master/__tests__)*.

## Contributions
You are welcome to make a pull request to the repository which I will try to resolve as quickly as possible.

Mainly I'd expect you to want to extend functions available to you in templates. That is done using executors. Executors are separated into three categories:
- **Value executors** - those are executors that are in place of any value in the template (eg. `ternary` executor: `"name": "{{ #? path.to.name }}"`)
- **Key executors** - those are executors that are in place of any key, usually represent a function which has name and parameters (eg. `optional` executor: `"{{ #optional name }}": { ... }`)
- **Array executors** - those are executors that are in place of an array (eg. `conditional` executor: `[{ "{{ #if someCondition === true }}": "Correct" }, { "{{ #else }}": "Incorrect" }]`)

You can freely create new executor in each of these categories using provided templates and by adding them into corresponding `index.ts` files.

Alternatively, if you would like to make changes to `Select` or `Transform` classes I would gladly see to your requests or proposals.
