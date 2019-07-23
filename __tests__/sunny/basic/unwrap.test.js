const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

const data = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
};

const template = {
  '{{ #unwrap }}': {
    attach: {
      nickname: 'Kuba',
    },
    exclude: ['age'],
  },
};

const expected = {
  name: 'Jakub',
  surname: 'Mifek',
  nickname: 'Kuba',
};

test('transform is correct', done => {
  st.transform(template, data).then(result => {
    expect(result).toEqual(expected);
    done();
  });
});
