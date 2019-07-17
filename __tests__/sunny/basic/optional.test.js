const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

let data = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
};

let template = {
  name: '{{ name }}',
  surname: '{{ surname }}',
  age: '{{ age }}',
  '{{ #optional nickname }}': [
    {
      "{{ #if name === 'Jakub' }}": 'Kuba',
    },
  ],
};

let expected = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  nickname: 'Kuba',
};

test('transform is correct', done => {
  st.transform(template, data).then(result => {
    expect(Object.keys(result).length).toEqual(Object.keys(expected).length);
    for (const k of Object.keys(result)) {
      expect(result[k]).toEqual(expected[k]);
    }
    done();
  });
});

data = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
};

template = {
  name: '{{ name }}',
  surname: '{{ surname }}',
  age: '{{ age }}',
  '{{ #optional nickname }}': [
    {
      "{{ #if name === 'Jan' }}": 'Honza',
    },
  ],
};

expected = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
};

test('transform is correct', done => {
  st.transform(template, data).then(result => {
    expect(result).toEqual(expected);
    done();
  });
});
