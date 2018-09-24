import {ICreatePostInput} from './setters';
import * as postHandles from './handles';

import {datePathFromDate, setToArray} from '../../utils/helpers';

export const getPostPathsByUser = (context: IContext, {username}: {username: string}, callback: IGunCallback<string[]>) => {
    postHandles.postMetasByUsername(context, username).docLoad((data: IMetasCallback) => {
        if (!data) {
            return callback('failed, no posts found');
        }

        const paths = setToArray(data).map(({postPath}: any) => postPath);

        return callback(null, paths);
    });
};

export const getPostByPath = (context: IContext, {postPath}: {postPath: string}, callback: IGunCallback<ICreatePostInput>) => {
    postHandles.postByPath(context, postPath).docLoad((data: ICreatePostInput) => {
        return callback(null, data);
    });
};

export const getPublicPostsByDate = (context: IContext, {date}: {date: Date}, callback: IGunCallback<ICreatePostInput>) => {
    const datePath = datePathFromDate(date);

    postHandles.postsByDate(context, datePath).docLoad((data: ICreatePostInput) => {
        if (!data) {
            return callback('failed, no posts found by date');
        }

        return callback(null, data);
    })
};

export const getPostLikes = (context: IContext, {postId}: {postId: string}, callback: IGunCallback<ILikesMetasCallback>) => {
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
};
