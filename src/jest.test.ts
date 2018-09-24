import {rootdb} from './repository/root';

test('whatever', async () => {
    rootdb.get('users');
});
