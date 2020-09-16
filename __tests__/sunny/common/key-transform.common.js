module.exports = {
  generalData: {
    name: 'Jakub',
    surname: 'Mifek',
    age: 24,
    car: 'sedan',
  },

  generalTemplate: {
    name: '{{ name }}',
    surname: '{{ surname }}',
    age: '{{ age }}',
    '{{ "the-car-of-" + name }}': '{{ car }}',
  },

  generalExpected: {
    name: 'Jakub',
    surname: 'Mifek',
    age: 24,
    'the-car-of-Jakub': 'sedan',
  },

};
