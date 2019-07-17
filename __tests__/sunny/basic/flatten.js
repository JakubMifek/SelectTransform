import { assert } from '../../helper';
import { ST } from '../../../st';

export class FlattenTest {
    async execute() {        
        const st = new ST();

        const data = {
            name: 'Jakub',
            surname: 'Mifek',
            age: 24,
            items: [12, 13, [14, 15, [15.3, 15.6]], 16, ['seventeen', 'eighteen']]
        }
        
        const template = {
            name: '{{ name }}',
            surname: '{{ surname }}',
            age: '{{ age }}',
            test: {
                '{{ #flatten }}': '{{ items }}'
            }
        }
        
        const expected = {
            name: 'Jakub',
            surname: 'Mifek',
            age: '24',
            test: [
                12, 13, 14, 15, [15.3, 15.6], 16, 'seventeen', 'eighteen'
            ]
        }
        
        const result = await st.transform(template, data);
        
        assert(result.isSame(expected), `${
            JSON.stringify(result, null, 2)
        } expected to equal ${JSON.stringify(expected, null, 2)}`);
    }
}