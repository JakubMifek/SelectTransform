const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

const data = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  items: [12, 13, [14, 15, [15.3, 15.6]], 16, ['seventeen', 'eighteen']],
};

const template = {
  name: '{{ name }}',
  surname: '{{ surname }}',
  age: '{{ age }}',
  test: {
    '{{ #flatten }}': '{{ items }}',
  },
};

const expected = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  test: [12, 13, 14, 15, [15.3, 15.6], 16, 'seventeen', 'eighteen'],
};

test('transform is correct', done => {
  st.transform(template, data).then(result => {
    expect(result).toEqual(expected);
    done();
  });
});
