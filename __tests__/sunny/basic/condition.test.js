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
  surname: 'Mifek',
  age: 24,
  test: 'test',
  name: 'Kuba',
};

test('transform is correct', done => {
  st.transform(template, data).then(result => {
    expect(result).toEqual(expected);
    done();
  });
});
