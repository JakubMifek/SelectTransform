import { assert } from '../../helper';
import { ST } from '../../../st';

export class EachTest {
    async execute() {
        const st = new ST();

        const data = {
            name: 'Jakub',
            surname: 'Mifek',
            age: 24,
            friends: [{
                name: 'Michal',
                surname: 'Mozik'
            }, {
                name: 'Marian',
                surname: 'Baca'
            }, {
                name: 'Antonin',
                surname: 'Malik'
            }]
        }

        const template = {
            name: '{{ name }}',
            surname: '{{ surname }}',
            age: '{{ age }}',
            friendList: {
                '{{ #each friends }}': '{{ name + " " + surname }}'
            }
        }

        const expected = {
            name: 'Jakub',
            surname: 'Mifek',
            age: 24,
            friendList: ['Michal Mozik', 'Marian Baca', 'Antonin Malik']
        }

        const result = await st.transform(template, data);

        assert(result.isSame(expected), `${
            JSON.stringify(result, null, 2)
            } expected to equal ${JSON.stringify(expected, null, 2)}`);
    }
}