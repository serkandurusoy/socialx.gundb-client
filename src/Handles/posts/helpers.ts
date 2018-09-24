export const datePathFromDate = (date: Date) => date.getUTCFullYear() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate();

interface IPostMetasCallback {
    postPath: string;
}

interface ICommentMetasCallback {
    text: string;
    timestamp: number;
    owner: string;
}

export interface ILikesMetasCallback {
    [key: string]: {
        timestamp: number;
    }
}

export interface IMetasCallback {
    [key: string]: IPostMetasCallback | ICommentMetasCallback;
}

export const setToArray = ({_, ...data}: IMetasCallback | ILikesMetasCallback) => {
    return Object.values(data).map(({v, ...rest}: any) => {
        const {_, ...deepRest} = rest;
        return deepRest;
    });
}
