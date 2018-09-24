export const datePathFromDate = (date: Date) => date.getUTCFullYear() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate();

export interface IPostMetasCallback {
    [key: string]: {
        postPath: string;
    }
}

export const setToArray = ({_, ...data}: IPostMetasCallback) => {
    return Object.values(data).map(({v, ...rest}: any) => {
        const {_, ...deepRest} = rest;
        return deepRest;
    });
}
