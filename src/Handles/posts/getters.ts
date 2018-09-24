import {ICreatePostInput} from './setters';
import * as postHandles from './handles';
import {datePathFromDate, IPostMetasCallback, setToArray} from './helpers';

export const getPostPathsByUser = (context: IContext, {username}: any, callback: IGunCallback<string[]>) => {
    postHandles.postMetasByUsername(context, username).docLoad((data: IPostMetasCallback) => {
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

    gun.get('posts/' + datePath).get('public').docLoad((data: ICreatePostInput) => {
        if (!data) {
            return callback('failed, no posts found by date');
        }

        return callback(null, data);
    })
}

export const getPostComments = (context: IContext, {postId}: any, callback: IGunCallback<{text: string, timestamp: number, owner: string}[]>) => {
    const {gun} = context;

    gun.get('postsById').get(postId).docLoad((data: {path: string}) => {
        if (!data) {
            return callback('no post found with this id');
        }
        gun.get('posts/' + data.path).get('comments').docLoad((data: {text: string, timestamp: number, owner: string}) => {
            if (!data) {
                return callback('no posts found by this path');
            }
            const comments = setToArray(data).map(({text, timestamp, owner}: any) => ({text, timestamp, owner}));

            return callback(null, comments);
        });
    });
}
