const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

const data = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
};

const template = {
  name: '{{ name }}',
  surname: '{{ surname }}',
  age: '{{ age }}',
  test: {
    '{{ #concat }}': ['{{ name }}', '{{ surname }}', '{{ age }}'],
  },
};

const expected = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  test: ['Jakub', 'Mifek', 24],
};

test('transform is correct', done => {
  st.transform(template, data).then(result => {
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    done();
  });
});
