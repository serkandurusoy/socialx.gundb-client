import * as postHandles from '../posts/handles';
import * as commentHandles from './handles';

import {setToArray} from '../posts/helpers';

export const getPostComments = (context: IContext, {postId}: any, callback: IGunCallback<{text: string, timestamp: number, owner: string}[]>) => {
    const {gun} = context;

    postHandles.postMetaById(context, postId).docLoad((data: {postPath: string}) => {
        if (!data) {
            return callback('no post found with this id');
        }
        commentHandles.commentsByPostPath(context, data.postPath).docLoad((data: IMetasCallback) => {
            if (!data) {
                return callback('no posts found by this path');
            }
            const comments = setToArray(data).map(({text, timestamp, owner}: any) => ({text, timestamp, owner}));

            return callback(null, comments);
        });
    });
}

export const getPostLikes = (context: IContext, {commentId}: any, callback: IGunCallback<{owner: string, timestamp: number}[]>) => {
    commentHandles.commentMetaById(context, commentId).docLoad((data: {owner: string, postPath: string, timestamp: number}) => {
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