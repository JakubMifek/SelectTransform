const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

const data = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
};

const template = {
  name: [
    { '{{ #if name === "Jakub" }}': 'Kuba' },
    { '{{ #else }}': '{{ name }}' },
  ],
  surname: '{{ surname }}',
  age: '{{ age }}',
  test: 'test',
};

const expected = {
  name: 'Kuba',
  surname: 'Mifek',
  age: 24,
  test: 'test',
};

test('transform is correct', done => {
  const result = st.transformSync(template, data);

  expect(result).toEqual(expected);
  done();
});
