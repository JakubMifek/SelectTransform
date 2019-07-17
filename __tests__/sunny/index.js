import { tests as basicTestsSync } from './basic-sync';
import { tests as combinedTestsSync } from './combined-sync';
import { tests as basicTests } from './basic';
import { tests as combinedTests } from './combined';

export const testsSync = basicTestsSync.concat(combinedTestsSync);
export const tests = basicTests.concat(combinedTests);