import * as postHandles from './handles';
import {datePathFromDate, getContextMeta} from '../../utils/helpers';

export interface ICreatePostInput {
    title: string;
    text?: string;
    location?: string;
    image_hash?: string;
    optimized_image_hash?: string;
    privatePost: boolean;
}

export const createPost = (context: IContext, createPostInput: ICreatePostInput, callback: IGunCallback<null>) => {
    const {account, gun} = context;
    if (!account.is) {
        return callback('a user needs to be logged in to proceed');
    }

    const {owner, timestamp} = getContextMeta(context);

    const datePath = datePathFromDate(new Date(timestamp));

    const publicPath = `${datePath}/${TABLE_ENUMS.PUBLIC}/`;
    const privatePath = `${datePath}/${TABLE_ENUMS.PRIVATE}/${owner}`;

    const {privatePost} = createPostInput;

    const path = privatePost ? privatePath : publicPath;

    const method = privatePost ? 'encrypt' : 'set';

    // TODO: can we extract this as an external handle?
    gun.get(TABLES.POSTS).get(path)[method]({...createPostInput, owner, timestamp}, (flags: IGunSetterCallback) => {
        if (flags.err) {
            return callback('failed, error => ' + flags.err);
        }
        const postId = flags['#'];
        const postPath = `${path}/${postId}`;

        postHandles.postMetasByCurrentUser(context).set({postPath}, (flags) => {
            if (flags.err) {
                return callback('failed, error => ' + flags.err);
            }

            postHandles.postMetaById(context, postId).put({postPath, privatePost, owner}, (ack) => {
                if (ack.err) {
                    return callback('failed, error => ' + ack.err);
                }
                return callback(null);
            });
        });
    });
};

export const likePost = (context: IContext, {postId}: any, callback: IGunCallback<null>) => {
    const {owner, timestamp} = getContextMeta(context);

    postHandles.postMetaById(context, postId).docLoad((data: IPostMetasCallback) => {
        if (!data) {
            return callback('no post found by this id');
        }

        postHandles.postLikesByCurrentUser(context, data.postPath).put({timestamp, owner}, (ack) => {
            if (ack.err) {
                return callback('failed, error => ' + ack.err);
            }

            return callback(null);
        });
    });
};
