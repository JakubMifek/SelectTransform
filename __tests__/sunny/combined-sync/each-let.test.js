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

const subtemplate = {
  '{{ #let }}': [
    {
      wholeName: '{{ name + " " + surname }}',
    },
    {
      name: '{{ wholeName }}',
      friendOf: '{{ userName }}',
    },
  ],
};

const template = {
  name: '{{ name }}',
  surname: '{{ surname }}',
  age: '{{ age }}',
  friendList: {
    '{{ #let }}': [
      {
        userName: '{{ name + " " + surname }}',
      },
      {
        '{{ #each friends }}': '{{ #template subtemplate }}',
      },
    ],
  },
};

const expected = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  friendList: [
    { name: 'Michal Mozik', friendOf: 'Jakub Mifek' },
    { name: 'Marian Baca', friendOf: 'Jakub Mifek' },
    { name: 'Antonin Malik', friendOf: 'Jakub Mifek' },
  ],
};

test('transform is correct', done => {
  const result = st.addTemplates({ subtemplate }).transformSync(template, data);

  expect(result).toEqual(expected);
  done();
});
