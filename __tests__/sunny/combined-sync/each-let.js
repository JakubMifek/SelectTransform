import { assert } from '../../helper';
import { ST } from '../../../st';

export class EachLetSyncTest {
    execute() {
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

        const subtemplate = {
            '{{ #let }}': [
                {
                    wholeName: '{{ name + " " + surname }}'
                },
                {
                    name: '{{ wholeName }}',
                    friendOf: '{{ userName }}'
                }
            ]
        };

        const template = {
            name: '{{ name }}',
            surname: '{{ surname }}',
            age: '{{ age }}',
            friendList: {
                '{{ #let }}': [
                    {
                        userName: '{{ name + " " + surname }}'
                    },
                    {
                        '{{ #each friends }}': '{{ #template subtemplate }}'
                    }
                ]
            }
        }

        const expected = {
            name: 'Jakub',
            surname: 'Mifek',
            age: 24,
            friendList: [
                { name: 'Michal Mozik', friendOf: 'Jakub Mifek' },
                { name: 'Marian Baca', friendOf: 'Jakub Mifek' },
                { name: 'Antonin Malik', friendOf: 'Jakub Mifek' }
            ]
        }

        const result = st.addTemplates({ subtemplate }).transformSync(template, data);

        assert(result.isSame(expected), `${
            JSON.stringify(result, null, 2)
            } expected to equal ${JSON.stringify(expected, null, 2)}`);
    }
}