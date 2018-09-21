import {rootdb} from './Handles/root';

test('whatever', async () => {
    rootdb.get('users');
});