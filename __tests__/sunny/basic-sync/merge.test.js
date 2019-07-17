const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

const data = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
};

const template = {
  '{{ #merge }}': [
    {
      name: '{{ name }}',
      surname: '{{ surname }}',
    },
    {
      surname: '{{ surname }}',
      age: '{{ age }}',
    },
  ],
};

const expected = {
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
