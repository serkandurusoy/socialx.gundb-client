interface IGetPublicKeyInput {
    username: string;
}

export interface IProfile {
    pub: string;
    email: string;
    avatar: string;
}

export const getPublicKey = ({gun}: IInjectedDeps, {username}: IGetPublicKeyInput, callback: IGunCallback<{pub: string}>) => {
    if (!gun) {
        return callback('failed, injected parameters');
    }

    gun.get('profiles').get(username).docLoad(({pub}: IProfile) => {
        return callback(null, {pub});
    });
}

export const getCurrentProfile = ({gun, account}: IInjectedDeps, callback: IGunCallback<IProfile>) => {
    if (!account || !gun) {
        return callback('failed, injected parameters');
    }

    if (!account.is) {
        return callback('a user needs to be logged in to proceed');
    }

    gun.get('profiles').get(account.is.alias).docLoad((data: IProfile) => {
        if (!data) {
            return callback('no user profile found');
        }

        return callback(null, data);
    });
}

export const getProfileByUsername = ({gun}: IInjectedDeps, {username}: any, callback: IGunCallback<IProfile>) => {
    if (!gun) {
        return callback('failed, injected parameters');
    }

    gun.get('profiles').get(username).docLoad((data: IProfile) => {
        if (!data) {
            return callback('no user profile found');
        }

        return callback(null, data);
    });
}