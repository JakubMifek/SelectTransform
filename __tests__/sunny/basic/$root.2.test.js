const ST = require('../../../dist')['SelectTransform'];

const st = new ST();

const data1 = {
  name: 'Jakub',
  surname: { value: 'Mifek' },
  friend: {
    name: 'Michal',
    surname: 'Pekny',
  },
};

const data2 = {
  name: 'Jakub',
  friend: {
    name: 'Michal',
    surname: 'Pekny',
  },
};

const data3 = {
  name: 'Jakub',
  surname: {},
  friend: {
    name: 'Michal',
    surname: 'Pekny',
  },
};

const template = {
  name: '{{ name }}',
  friend: {
    '{{ #unwrap friend }}': {
      attach: {
        '{{ #optional originSurname }}': [
          {
            '{{ #if $root.surname !== undefined && $root.surname.value !== undefined }}':
              '{{ surname.value }}',
          },
        ],
      },
    },
  },
};

const expected1 = {
  name: 'Jakub',
  friend: {
    name: 'Michal',
    surname: 'Pekny',
    originSurname: 'Mifek',
  },
};

const expected2 = {
  name: 'Jakub',
  friend: {
    name: 'Michal',
    surname: 'Pekny',
  },
};

const expected3 = {
  name: 'Jakub',
  friend: {
    name: 'Michal',
    surname: 'Pekny',
  },
};

test('transform is correct', done => {
  st.transform(template, data1).then(result => {
    expect(result).toEqual(expected1);
    done();
  });
});

test('transform is correct', done => {
  st.transform(template, data2).then(result => {
    expect(result).toEqual(expected2);
    done();
  });
});

test('transform is correct', done => {
  st.transform(template, data3).then(result => {
    expect(result).toEqual(expected3);
    done();
  });
});
