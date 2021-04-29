const ST = require('../../../dist')['SelectTransform'];
const allData = require('../common/key-transform.common');

const st = new ST();

test('transform is correct', done => {
  const result = st.transformSync(allData.generalTemplate, allData.generalData);
  expect(result).toEqual(allData.generalExpected);
  done();
});
