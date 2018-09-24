export interface ICreatePostInput {
    title: string;
    text?: string;
    location?: string;
    image_hash?: string;
    optimized_image_hash?: string;
    private: boolean;
}

export const createPost = ({account, gun, time}: IContext, createPostInput: ICreatePostInput, callback: IGunCallback<null>) => {
    if (!account || !gun || !time) {
        return callback('failed, injected parameters');
    }
    if (!account.is) {
        return callback('a user needs to be logged in to proceed');
    }

    const currentUserAlias = account.is.alias;

    const currentTime = time();
    const datePath = currentTime.getUTCFullYear() + '/' + (currentTime.getUTCMonth() + 1) + '/' + currentTime.getUTCDate();

    const publicPath = datePath + '/public/';
    const privatePath = datePath + '/private/' + account.is.alias;

    const path = createPostInput.private ? privatePath : publicPath;

    const method = createPostInput.private ? 'encrypt' : 'set';

    gun.get('posts/' + path)[method]({...createPostInput, owner: currentUserAlias, timestamp: time().getTime()}, (flags: IGunSetterCallback) => {
        if (flags.err) {
            return callback('failed, error => ' + flags.err);
        }
        const postId = flags['#'];
        gun.get('postsByUser').get(currentUserAlias).set({path}, (flags) => {
            if (flags.err) {
                return callback('failed, error => ' + flags.err);
            }

            gun.get('postsById').get(postId).put({path, priv: createPostInput.private, owner: currentUserAlias}, (ack) => {
                if (ack.err) {
                    return callback('failed, error => ' + ack.err);
                }
                return callback(null);
            });
        });
    });
}

export const likePost = ({account, gun, time}: IContext, {postId}: any, callback: IGunCallback<null>) => {
    if (!gun || !account || !time) {
        return callback('failed, injected parameters');
    }

    if (!account.is) {
        return callback('a user needs to be logged in to proceed');
    }

    gun.get('postsById').get(postId).docLoad((data: {path: string, priv: boolean, owner: string}) => {
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