const ST = require('../../../dist')['SelectTransform'];
const allData = require('../common/key-transform.common');

const st = new ST();

test('transform is correct', done => {
  st.transform(allData.generalTemplate, allData.generalData).then(result => {
    expect(result).toEqual(allData.generalExpected);
    done();
  });
});
