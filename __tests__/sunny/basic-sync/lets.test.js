const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

const data = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  item: {
    name: 'item',
    quantity: 2,
    price: 20,
  },
};

const template = {
  name: '{{ name }}',
  surname: '{{ surname }}',
  age: '{{ age }}',
  test: {
    '{{ #lets }}': [
      {
        partialPrice: '{{ item.price }}',
        wholePrice: '{{ item.quantity * partialPrice }}',
      },
      {
        name: '{{ item.quantity + " " + item.name + "s" }}',
        price: '{{ wholePrice }}',
      },
    ],
  },
};

const expected = {
  name: 'Jakub',
  surname: 'Mifek',
  age: 24,
  test: {
    name: '2 items',
    price: 40,
  },
};

test('transform is correct', done => {
  st.transform(template, data).then(result => {
    expect(result).toEqual(expected);
    done();
  });
});
