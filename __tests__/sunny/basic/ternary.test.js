const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

const data = {
  name: 'Jakub',
};

const template = {
  name: '{{ #? name }}',
  age: '{{ #? age }}',
};

const expected = {
  name: 'Jakub',
};

test('transform is correct', done => {
  st.transform(template, data).then(result => {
    expect(result).toEqual(expected);
    done();
  });
});
