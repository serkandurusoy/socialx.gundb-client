import {ICreatePostInput} from './setters';

// TODO PLEASE REVIEW THIS AGAIN!!!!!!!

const setToArray = ({_, ...data}: any) => {
    return Object.values(data).map(({v, ...rest}: any) => {
      const {_, ...deepRest} = rest;
      return deepRest;
    });
}

export const getPostPathsByUser = ({gun}: IInjectedDeps, {username}: any, callback: IGunCallback<string[]>) => {
    if (!gun) {
        return callback('failed, injected parameters');
    }

    gun.get('postsByUser').get(username).docLoad((data: {path: string}) => {
        if (!data) {
            return callback('failed, no posts found');
        }

        const paths = setToArray(data).map(({path}: any) => path);
        
        return callback(null, paths);
    });
}

export const getPostByPath = ({gun}: IInjectedDeps, {path}: any, callback: IGunCallback<ICreatePostInput>) => {
    if (!gun) {
        return callback('fail, injected parameter');
    }

    gun.get('posts/' + path).docLoad((data: ICreatePostInput) => {
        return callback(null, data);
    });
}

export const getPostsByDate = ({gun}: IInjectedDeps, {date}: {date: Date}, callback: IGunCallback<ICreatePostInput>) => {
    if (!gun) {
        return callback('failed, injected parameter');
    }

    const datePath = date.getUTCFullYear() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate();


    gun.get('posts/' + datePath).docLoad((data: ICreatePostInput) => {
        if (!data) {
            return callback('failed, no posts found by date');
        }

        return callback(null, data);
    })
}

export const getPostComments = ({gun}: IInjectedDeps, {postId}: any, callback: IGunCallback<{text: string, timestamp: number, owner: string}[]>) => {
    if (!gun) {
        return callback('failed, injected parameters');
    }

    gun.get('postsById').get(postId).docLoad((data: {path: string}) => {

    });
}