import { assert } from '../../helper';
import { ST } from '../../../st';

export class ConditionSyncTest {
    execute() {        
        const st = new ST();

        const data = {
            name: 'Jakub',
            surname: 'Mifek',
            age: 24,
        }
        
        const template = {
            name: [
                {'{{ #if name === "Jakub" }}': 'Kuba'},
                {'{{ #else }}': '{{ name }}'}
            ],
            surname: '{{ surname }}',
            age: '{{ age }}',
            test: 'test'
        }
        
        const expected = {
            name: 'Kuba',
            surname: 'Mifek',
            age: '24',
            test: 'test'
        }
        
        const result = st.transformSync(template, data);
        
        assert(result.isSame(expected), `${
            JSON.stringify(result, null, 2)
        } expected to equal ${JSON.stringify(expected, null, 2)}`);
    }
}