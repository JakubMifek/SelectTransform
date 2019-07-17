import { assert } from '../../helper';
import { ST } from '../../../st';

export class OptionalSyncTest {
    test_exists() {
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
            '{{ #optional nickname }}': [{
                "{{ #if name === 'Jakub' }}": "Kuba"
            }]
        }
        
        const expected = {
            name: 'Jakub',
            surname: 'Mifek',
            age: '24',
            nickname: 'Kuba'
        }
        
        const result = st.transformSync(template, data);
        
        assert(result.isSame(expected), `${
            JSON.stringify(result, null, 2)
        } expected to equal ${JSON.stringify(expected, null, 2)}`);
    }

    test_missing() {
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
            '{{ #optional nickname }}': [{
                "{{ #if name === 'Jan' }}": "Honza"
            }]
        }
        
        const expected = {
            name: 'Jakub',
            surname: 'Mifek',
            age: '24'
        }
        
        const result = st.transformSync(template, data);
        
        assert(result.isSame(expected), `${
            JSON.stringify(result, null, 2)
        } expected to equal ${JSON.stringify(expected, null, 2)}`);
    }

    execute() {        
        this.test_exists();
        this.test_missing();
    }
}