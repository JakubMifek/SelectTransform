const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

const data = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  friends: {
    a: {
      name: 'Michal',
      surname: 'Mozik',
    },
    b: {
      name: 'Marian',
      surname: 'Baca',
    },
    c: {
      name: 'Antonin',
      surname: 'Malik',
    },
  },
};

const template = {
  name: '{{ name }}',
  surname: '{{ surname }}',
  age: '{{ age }}',
  friendList: {
    '{{ #for friends }}': '{{ name + " " + surname }}',
  },
};

const expected = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  friendList: { a: 'Michal Mozik', b: 'Marian Baca', c: 'Antonin Malik' },
};

test('transform is correct', done => {
  st.transform(template, data).then(result => {
    expect(result).toEqual(expected);
    done();
  });
});
