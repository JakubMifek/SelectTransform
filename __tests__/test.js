import { tests as sunnyTests } from './sunny';
import { testsSync as sunnyTestsSync } from './sunny';

const testsSync = [].concat(sunnyTestsSync);
const tests = [].concat(sunnyTests);

const total = tests.length + testsSync.length;
let success = 0;
let fail = 0;

(async () => {
    for (const test of testsSync) {
        try {
            (new test()).execute();
            console.info(`${test.name} passed.`)
            success += 1;
        } catch (error) {
            console.error('Error -- ' + error.message);
            console.error(error.stack);
            fail += 1;
        }
    }

    for (const test of tests) {
        console.log(test.name);
        try {
            await (new test()).execute();
            console.info(`${test.name} passed.`)
            success += 1;
        } catch (error) {
            console.error('Error -- ' + error.message);
            console.error(error.stack);
            fail += 1;
        }
    }
    console.log(`Test results:\n\t[${success}/${total}]\tsucceeded\n\t[${fail}/${total}]\tfailed`);
})();
