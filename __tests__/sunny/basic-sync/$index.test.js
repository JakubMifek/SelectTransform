const ST = require('../../../dist')['SelectTransform'];

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
  name: '{{ $root.name }}',
  friends: {
    '{{ #each friends }}': {
      name: '{{ $index }}',
    },
  },
};

const expected = {
  name: 'Jakub',
  friends: [
    {
      name: 0,
    },
  ],
};

test('transform is correct', done => {
  const result = st.transformSync(template, data);

  expect(result).toEqual(expected);
  done();
});
