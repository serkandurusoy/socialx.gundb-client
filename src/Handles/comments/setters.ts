import * as postHandles from '../posts/handles';
import * as commentHandles from './handles';

export const createComment = (context: IContext, {text, postId}: any, callback: IGunCallback<null>) => {
    const {gun, time, account} = context;

    if (!account.is) {
        return callback('a user has to be logged in to proceed');
    }

    postHandles.postMetaById(context, postId).docLoad((data: {path: string, privatePost: boolean, owner: string}) => {
        if (!data) {
            return callback('no post found by this id');
        }

        const postPath = `${data.path}/${postId}`;
        commentHandles.commentsByPostPath(context, postPath).set({text, timestamp: time().getTime(), owner: account.is.alias}, (flags) => {
            if (flags.err) {
                return callback('failed, error => ' + flags.err);
            }

            const commentId = flags['#'];
            commentHandles.commentMetaById(context, commentId).put({owner: account.is.alias, postPath: data.path, timestamp: time().getTime()}, (ack) => {
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

    commentHandles.commentMetaById(context, commentId).docLoad((data: {owner: string, postPath: string, timestamp: number}) => {
        if (!data) {
            return callback('no comment found by this id');
        }

        const commentPath = `${TABLES.POSTS}/${data.postPath}/${TABLES.COMMENTS}/${commentId}`;
        commentHandles.likesByCommentPath(context, commentPath).set({owner: account.is.alias, timestamp: time().getTime()}, (ack) => {
            if (ack.err) {
                return callback('failed, error => ' + ack.err);
            }

            return callback(null);
        });
    });
}
