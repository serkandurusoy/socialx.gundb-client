interface PromiseObj {
    put: any;
    get: string;
    gun: GunObj;
}

interface GunObj {
    // core api
    put: (data: object | string | number | boolean | null, callback?: any) => GunObj;
    get: (path: string) => GunObj;
    opt: (opts: object) => GunObj;
    back: (amount?: number) => GunObj;

    // main api
    on: (callback: any, options?: object) => void;
    once: (callback: any, options?: object) => void;
    set: (data: GunObj | object, callback?: any) => void;
    map: (callback?: any) => GunObj;

    // extended api
    then: () => Promise<PromiseObj>;
    unset: (node: GunObj) => GunObj;
}

declare module 'gun/gun' {
    const Gun: any;
    export = Gun;
}
declare module 'gun' {
    const Gun: any;
    export = Gun;
}