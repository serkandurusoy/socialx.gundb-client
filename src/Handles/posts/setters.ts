export interface ICreatePostInput {
    title: string;
    text?: string;
    location?: string;
    image_hash?: string;
    optimized_image_hash?: string;
    private: boolean;
}

export const createPost = ({account, gun, time}: IInjectedDeps, createPostInput: ICreatePostInput, callback: IGunCallback<null>) => {
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

    // .set for public
    // .secret for
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

export const createComment = ({gun, time, account}: IInjectedDeps, {text, postId}: any, callback: IGunCallback<null>) => {
    if (!gun || !time || !account) {
        return callback('failed, injected parameter');
    }
    
    gun.get('postsById').get(postId).docLoad((data: {path: string, priv: boolean, owner: string}) => {
        if (!data) {
            return callback('no post found by this id');
        }
        
        if (!account.is) {
            return callback('a user has to be logged in to proceed');
        }

        gun.get('posts/' + data.path).get('comments').set({text, timestamp: time().getTime(), owner: account.is.alias}, (ack) => {
            if (ack.err) {
                return callback('failed, error => ' + ack.err);
            }

            return callback(null);
        });
    });
}