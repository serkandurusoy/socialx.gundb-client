import {ICreatePostInput} from './setters';
import * as postHandles from './handles';
import * as commentHandles from '../comments/handles';

import {datePathFromDate, IMetasCallback, ILikesMetasCallback, setToArray} from './helpers';

export const getPostPathsByUser = (context: IContext, {username}: any, callback: IGunCallback<string[]>) => {
    postHandles.postMetasByUsername(context, username).docLoad((data: IMetasCallback) => {
        if (!data) {
            return callback('failed, no posts found');
        }

        const paths = setToArray(data).map(({postPath}: any) => postPath);

        return callback(null, paths);
    });
}

export const getPostByPath = (context: IContext, {postPath}: any, callback: IGunCallback<ICreatePostInput>) => {
    postHandles.postByPath(context, postPath).docLoad((data: ICreatePostInput) => {
        return callback(null, data);
    });
}

export const getPublicPostsByDate = (context: IContext, {date}: {date: Date}, callback: IGunCallback<ICreatePostInput>) => {
    const {gun} = context;

    const datePath = datePathFromDate(date);

    postHandles.postsByDate(context, datePath).docLoad((data: ICreatePostInput) => {
        if (!data) {
            return callback('failed, no posts found by date');
        }

        return callback(null, data);
    })
}

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

export const getPostLikes = (context: IContext, {postId}: any, callback: IGunCallback<ILikesMetasCallback>) => {
    postHandles.postMetaById(context, postId).docLoad((data: {postPath: string}) => {
        if (!data) {
            return callback('no post found by this id');
        }
        postHandles.likesByPostPath(context, data.postPath).docLoad((data: ILikesMetasCallback) => {
            if (!data) {
                return callback('no post found by this path');
            }
            return callback(null, data);
        });
    });
}