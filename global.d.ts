type GunDataNode = object | string | boolean | number | null;
interface PromiseObj {
    put: object;
    get: GunDataNode;
    gun: GunInstance;
}

interface GunInstance {
    // core api
    put: (data: GunDataNode, callback?: any) => GunInstance;
    get: (path: string) => GunInstance;
    opt: (opts: object) => GunInstance;
    back: (amount?: number) => GunInstance;

    // main api
    on: (callback: any, options?: object) => void;
    once: (callback: any, options?: object) => void;
    set: (data: GunInstance | object, callback?: any) => void;
    map: (callback?: any) => GunInstance;

    // extended api
    then: () => Promise<PromiseObj>;
    unset: (node: GunInstance) => GunInstance;

    // subInstance api
    user: () => GunUserInstance;
}

interface GunUserInstance extends GunInstance {
    // core api
    create: (username: string, passphrase: string) => GunUserInstance;
    auth: (username: string, passphrase: string, opts?: {newpass?: string, pin?: string}) => GunUserInstance;
    leave: () => GunUserInstance;
    delete: (username: string, passphrase: string) => GunUserInstance;
    recall: (back?: number, opts?: {hook?: (props: object) => any}) => GunUserInstance;
    alive: () => GunUserInstance;
}

declare module 'gun/gun' {
    const Gun: any;
    export = Gun;
}