interface ICreateProfileInput {
    username: string;
    email: string;
    avatar: string;
    pub: string;
}

export const createProfile = (context: IContext, createProfileInput: ICreateProfileInput, callback: IGunCallback<null>) => {
    const {gun} = context;
    const {username, ...rest} = createProfileInput;
    gun.get('profiles').get(username).put({...rest}, (flags) => {
        if (flags.err) {
            return callback('failed, error => ' + flags.err);
        }

        callback(null);
    });
}
