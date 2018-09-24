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
        gun.get(TABLES.POST_METAS_BY_USER).get(currentUserAlias).set({postPath: `${path}/${postId}`}, (flags) => {
            if (flags.err) {
                return callback('failed, error => ' + flags.err);
            }

            gun.get(TABLES.POST_META_BY_ID).get(postId).put({postPath: `${path}/${postId}`, privatePost: createPostInput.private, owner: currentUserAlias}, (ack) => {
                if (ack.err) {
                    return callback('failed, error => ' + ack.err);
                }
                return callback(null);
            });
        });
    });
}

export const likePost = (context: IContext, {postId}: any, callback: IGunCallback<null>) => {
    const {account, gun, time} = context;

    if (!account.is) {
        return callback('a user needs to be logged in to proceed');
    }

    gun.get('postsById').get(postId).docLoad((data: {path: string, privatePost: boolean, owner: string}) => {
        if (!data) {
            return callback('no post found by this id');
        }

        gun.get('posts/' + data.path).get('likes').get(account.is.alias).put({timestamp: time().getTime()}, (ack) => {
            if (ack.err) {
                return callback('failed, error => ' + ack.err);
            }

            return callback(null);
        });
    });
}
