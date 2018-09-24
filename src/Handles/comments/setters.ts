export const createComment = (context: IContext, {text, postId}: any, callback: IGunCallback<null>) => {
    const {gun, time, account} = context;

    if (!account.is) {
        return callback('a user has to be logged in to proceed');
    }
    
    gun.get('postsById').get(postId).docLoad((data: {path: string, priv: boolean, owner: string}) => {
        if (!data) {
            return callback('no post found by this id');
        }

        gun.get('posts/' + data.path).get('comments').set({text, timestamp: time().getTime(), owner: account.is.alias}, (flags) => {
            if (flags.err) {
                return callback('failed, error => ' + flags.err);
            }
            
            const commentId = flags['#'];
            gun.get('commentsById').get(commentId).put({owner: account.is.alias, postPath: data.path, timestamp: time().getTime()}, (ack) => {
                if (ack.err) {
                    return callback('failed, error => ' + ack.err);
                }

                return callback(null);
            });
        });
    });
}

export const likeComment = (context: IContext, {commentId}: any, callback: IGunCallback<null>) => {
    const {account, gun, time} = context;

    if (!account.is) {
        return callback('a user needs to be logged in to proceed');
    }

    gun.get('commentsById').get(commentId).docLoad((data: {owner: string, postPath: string, timestamp: number}) => {
        if (!data) {
            return callback('no comment found by this id');
        }

        gun.get('posts/' + data.postPath).get('comments/' + commentId).get('likes').set({owner: account.is.alias, timestamp: time().getTime()}, (ack) => {
            if (ack.err) {
                return callback('failed, error => ' + ack.err);
            }

            return callback(null);
        });
    });
}