export const datePathFromDate = (date: Date) => date.getUTCFullYear() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate();

export const setToArray = ({_, ...data}: IMetasCallback | ILikesMetasCallback) => {
    return Object.values(data).map(({v, ...rest}: any) => {
        const {_, ...deepRest} = rest;
        return deepRest;
    });
}
