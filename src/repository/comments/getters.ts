import * as postHandles from '../posts/handles';
import * as commentHandles from './handles';

import {setToArray} from '../../utils/helpers';

export const getPostComments = (context: IContext, {postId}: {postId: string}, callback: IGunCallback<IMetasCallback[]>) => {
    postHandles.postMetaById(context, postId).docLoad((data: {postPath: string}) => {
        if (!data) {
            return callback('no post found with this id');
        }
        commentHandles.commentsByPostPath(context, data.postPath).docLoad((data: IMetasCallback) => {
            if (!data) {
                return callback('no posts found by this path');
            }
            const comments = setToArray(data).map(({text, timestamp, owner}: IMetasCallback) => ({text, timestamp, owner}));

            return callback(null, comments);
        });
    });
}

export const getPostLikes = (context: IContext, {commentId}: any, callback: IGunCallback<IMetasCallback[]>) => {
    commentHandles.commentMetaById(context, commentId).docLoad((data: ILikesMetasCallback) => {
        if (!data) {
            return callback('no comment by this id was found');
        }

        const commentPath = `${TABLES.POSTS}/${data.postPath}/${TABLES.COMMENTS}/${commentId}`;
        commentHandles.likesByCommentPath(context, commentPath).docLoad((data: ILikesMetasCallback) => {
            if (!data) {
                return callback('no likes found by this comment');
            }

            const likes = setToArray(data).map(({owner, timestamp}) => ({owner, timestamp}));
            return callback(null, likes);
        });
    });
}
