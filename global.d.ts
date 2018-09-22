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
    on: (callback?: any, options?: object) => GunInstance;
    once: (callback?: any, options?: object) => GunInstance;
    set: (data: GunInstance | object, callback?: any) => void;
    map: (callback?: any) => GunInstance;

    // extended api
    then: () => Promise<PromiseObj>;
    unset: (node: GunInstance) => GunInstance;
    docLoad: (callback?: (data: object, key: string) => void) => GunInstance;

    // subInstance api
    user: () => GunUserInstance;
}

interface GunUserInstance extends GunInstance {
    // core api

    /**
     * creates a user
     * @param username a string containing the username
     * @param passphrase a string containing the password/passphrase
     * @return returns a GunUserInstance
     */
    create: (username: string, passphrase: string, callback?: (user: GunUserInstance, data: {err?: string, ok?: number, pub?: string}) => void) => GunUserInstance;

    /**
     * @param username a string containing the username
     * @param passphrase a string containing the password/passphrase
     * @param callback a function to be invoked after the user creation
     * @param opts an optional object containing optional parameters that extends the functions functionality
     * @return a GunUserInstance
     */
    auth: (username: string, passphrase: string, callback?: (user: GunUserInstance, gun: GunInstance & GunUserInstance & PromiseObj) => void, opts?: {newpass?: string, pin?: string, change?: string}) => GunUserInstance;

    /**
     * @return a promise to be resolved into a GunUserInstance object
     */
    leave: () => Promise<GunUserInstance>;

    /**
     * @param username a string containing the username
     * @param passphrase a string containing the password/passphrase
     * @return a promise to be resolved into a GunUserInstance object
     */
    delete: (username: string, passphrase: string) => Promise<GunUserInstance>;

    /**
     * @param back a number indicates how much to return from the current index (optional)
     * @param opts an object containing properties that extend the functionality of this function
     */
    recall: (back?: number, opts?: {hook?: (props: object) => any}) => Promise<GunUserInstance>;

    /**
     * this function returns back to the user root document (with user.back(-1)) and internally calls reAuth on the current user
     * @return a promise to be resolved into a GunUserInstance object
     */
    alive: () => Promise<GunUserInstance>;

    /**
     * trust another user with a specific current user data
     * example: gun.get('alice').get('age').trust(bob);
     * @param user a user GunInstance object
     * @return this function returns an extended GunInstance with extra properties that are useless
     */
    trust: (user: GunInstance) => Promise<{
        // 'next state' gun user instance
        $: GunUserInstance & GunInstance;
        // trust soul
        '@': string;
        get: string;
        put: string | undefined;
    }>;

    /**
     * this function returns the pair keys (private/public) keys of the current users encryption (rsa)
     * @return an object containing critical cryptographical keys
     */
    pair: () => {
        pub: string;
        priv: string;
        epub: string;
        epriv: string;
    }

    /**
     * an object that contains some sensitive user information that gets filled once the user logged in
     * internally being used by
     * anyUser.on('auth', setIsProperty)
     */
    is: {
        alias: string;
        pub: string;
    }
}

declare module 'gun/gun' {
    const Gun: any;
    export = Gun;
}