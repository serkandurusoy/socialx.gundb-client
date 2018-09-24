import * as postHandles from './handles';
import {datePathFromDate} from './helpers';

export interface ICreatePostInput {
    title: string;
    text?: string;
    location?: string;
    image_hash?: string;
    optimized_image_hash?: string;
    private: boolean;
}

export const createPost = (context: IContext, createPostInput: ICreatePostInput, callback: IGunCallback<null>) => {
    const {account, gun, time} = context;
    if (!account.is) {
        return callback('a user needs to be logged in to proceed');
    }

    const currentUserAlias = account.is.alias;

    const currentTime = time();
    const datePath = datePathFromDate(currentTime);

    const publicPath = datePath + '/public/';
    const privatePath = datePath + '/private/' + account.is.alias;

    const path = createPostInput.private ? privatePath : publicPath;

    const method = createPostInput.private ? 'encrypt' : 'set';

    gun.get(TABLES.POSTS).get(path)[method]({...createPostInput, owner: currentUserAlias, timestamp: time().getTime()}, (flags: IGunSetterCallback) => {
        if (flags.err) {
            return callback('failed, error => ' + flags.err);
        }
        const postId = flags['#'];
        postHandles.postMetasByCurrentUser(context).set({postPath: `${path}/${postId}`}, (flags) => {
            if (flags.err) {
                return callback('failed, error => ' + flags.err);
            }

            postHandles.postMetaById(context, postId).put({postPath: `${path}/${postId}`, privatePost: createPostInput.private, owner: currentUserAlias}, (ack) => {
                if (ack.err) {
                    return callback('failed, error => ' + ack.err);
                }
                return callback(null);
            });
        });
    });
}

export const likePost = (context: IContext, {postId}: any, callback: IGunCallback<null>) => {
    const {account, time} = context;
    postHandles.postMetaById(context, postId).docLoad((data: {postPath: string, privatePost: boolean, owner: string}) => {
        if (!data) {
            return callback('no post found by this id');
        }

        postHandles.postLikesByCurrentUser(context, data.postPath).put({timestamp: time().getTime()}, (ack) => {
            if (ack.err) {
                return callback('failed, error => ' + ack.err);
            }

            return callback(null);
        });
    });
}
