import { assert } from '../../helper';
import { ST } from '../../../st';

export class LetTest {
    async execute() {        
        const st = new ST();

        const data = {
            name: 'Jakub',
            surname: 'Mifek',
            age: 24,
            item: {
                name: 'item',
                quantity: 2,
                price: 20
            }
        }
        
        const template = {
            name: '{{ name }}',
            surname: '{{ surname }}',
            age: '{{ age }}',
            test: {
                '{{ #let }}': [
                    {
                        wholePrice: '{{ item.quantity * item.price }}'
                    },
                    {
                        name: '{{ item.quantity + " " + item.name + "s" }}',
                        price: '{{ wholePrice }}'
                    }
                ]
            }
        }
        
        const expected = {
            name: 'Jakub',
            surname: 'Mifek',
            age: '24',
            test: {
                name: '2 items',
                price: 40
            }
        }
        
        const result = await st.transform(template, data);
        
        assert(result.isSame(expected), `${
            JSON.stringify(result, null, 2)
        } expected to equal ${JSON.stringify(expected, null, 2)}`);
    }
}