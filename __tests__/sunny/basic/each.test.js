const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

const data = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  friends: [
    {
      name: 'Michal',
      surname: 'Mozik',
    },
    {
      name: 'Marian',
      surname: 'Baca',
    },
    {
      name: 'Antonin',
      surname: 'Malik',
    },
  ],
};

const template = {
  name: '{{ name }}',
  surname: '{{ surname }}',
  age: '{{ age }}',
  friendList: {
    '{{ #each friends }}': '{{ name + " " + surname }}',
  },
};

const expected = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  friendList: ['Michal Mozik', 'Marian Baca', 'Antonin Malik'],
};

test('transform is correct', done => {
  st.transform(template, data).then(result => {
    expect(result).toEqual(expected);
    done();
  });
});
