import { assert } from '../../helper';
import { ST } from '../../../st';

export class OptionalTest {
    async test_exists() {
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
        
        const result = await st.transform(template, data);
        
        assert(result.isSame(expected), `${
            JSON.stringify(result, null, 2)
        } expected to equal ${JSON.stringify(expected, null, 2)}`);
    }

    async test_missing() {
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
        
        const result = await st.transform(template, data);
        
        assert(result.isSame(expected), `${
            JSON.stringify(result, null, 2)
        } expected to equal ${JSON.stringify(expected, null, 2)}`);
    }

    async execute() {
        await this.test_exists();
        await this.test_missing();
    }
}