import GunAsync from './index';
let gun = new GunAsync("http://localhost:1337/gun");


const getVal = async (key: string | string[]) => {
    if (typeof key === 'string') {
        const data = await gun.get(key);
        return data[key];
    } else {
        const data = await gun.get(key);
        return data[key[key.length - 1]];
    }
}

test('Simple put & get (async)', async () => {
    try {
        const test: GunAsync = await gun.get('test');
        await test.put('test', {hello: 'there'});

        const data = await getVal('test');
        expect(data).toBe({'hello': 'there'});
    } catch (e) {
        // console.log(e);
    }
});

test('multiple puts & gets (async)', async () => {
    try {
        const paths = [
            'branch1',
            'branch2',
            'branch3',
            'test'
        ];
        await gun.put(paths, {this: 'is a test'});

        const data = await getVal(paths);
        expect(data).toBe({'this': 'is a test'});
    } catch (e) {
        // console.log(e);
    }
});

test('can go back a branch with raw put & raw get test (async)', async () => {
    try {
        const paths = [
            'branch1',
            'branch2',
            'branch3',
            'target',
            'branch4'
        ];

        await gun.put(paths, {target: 'is 1 back'}); // data on branch4
        const target = gun.back();
        await target.rawPut({target: 'hitszz'});
        const raw = await target.rawGet();
        
        expect(0).toBe(1);
    } catch (e) {
        // console.log(e);
    }
});

test('Event listeners on data change (async)', async () => {
    try {
        await gun.get('iterx');
        let result = 0;
        gun.on((res: any) => {
            result = res.data.num;
        });
        await gun.put('iterx', {num: 2});

        expect(result).toEqual(2);
    } catch (e) {
        // console.log(e);
    }
});

test('Data filter with map', async () => {
    try {
        let user = '';
        const data = {
            user1: 'Max',
            user2: 'Billy',
            user3: 'Mark'
        };

        const filterFunc = (user: any) => user === 'Billy' ? user : undefined;

        const callback = (result: any) => {
            user = result.data;
        };

        await gun.put('users', data);
        gun.mapOn(callback, filterFunc);

        expect(user).toEqual('Billy');
    } catch (e) {
        // console.log(e);
    }
})