interface ICreateProfileInput {
    username: string;
    email: string;
    avatar: string;
    pub: string;
}

export const createProfile = ({gun}: IContext, createProfileInput: ICreateProfileInput, callback: IGunCallback<null>) => {
    if (!gun) {
        return callback('failed, injected parameter');
    }
    const {username, ...rest} = createProfileInput;
    gun.get('profiles').get(username).put({...rest}, (flags) => {
        if (flags.err) {
            return callback('failed, error => ' + flags.err);
        }

        callback(null);
    });
}