import * as handles from './handles';
import { user } from '../root';

interface IGetPublicKeyInput {
    username: string;
}

export interface IProfile {
    pub: string;
    email: string;
    avatar: string;
}

export const getPublicKey = (context: IContext, {username}: IGetPublicKeyInput, callback: IGunCallback<{pub: string}>) => {
    handles.profileByUsername(context, {username}).docLoad(({pub}: IProfile) => {
        return callback(null, {pub});
    });
}

export const getCurrentProfile = (context: IContext, callback: IGunCallback<IProfile>) => {
    const {account} = context;
    if (!account.is) {
        return callback('a user needs to be logged in to proceed');
    }

    handles.currentUserProfile(context).docLoad((data: IProfile) => {
        if (!data) {
            return callback('no user profile found');
        }

        return callback(null, data);
    });
}

export const getProfileByUsername = (context: IContext, {username}: any, callback: IGunCallback<IProfile>) => {
    handles.profileByUsername(context, {username}).docLoad((data: IProfile) => {
        if (!data) {
            return callback('no user profile found');
        }

        return callback(null, data);
    });
}