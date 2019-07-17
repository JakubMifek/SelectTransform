import { assert } from '../../helper';
import { ST } from '../../../st';

export class GeneralSyncTest {
    execute() {
        const st = new ST();

        const data = {
            name: 'Jakub',
            surname: 'Mifek',
            age: 24,
        }

        const template = {
            name: '{{ name }}',
            surname: '{{ surname }}',
            age: '{{ age }}',
            test: 'test'
        }

        const expected = {
            name: 'Jakub',
            surname: 'Mifek',
            age: 24,
            test: 'test'
        }

        const result = st.transformSync(template, data);

        assert(result.isSame(expected), `${
            JSON.stringify(result, null, 2)
        } expected to equal ${JSON.stringify(expected, null, 2)}`);   
    }
}