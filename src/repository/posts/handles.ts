export const postMetaById = (context: IContext, postId: string) => {
    const {gun} = context;
    return gun.get(TABLES.POST_META_BY_ID).get(postId);
};

export const postMetasByUsername = (context: IContext, username: string) => {
    const {gun} = context;
    return gun.get(TABLES.POST_METAS_BY_USER).get(username);
};

export const postMetasByCurrentUser = (context: IContext) => {
    const {gun, account} = context;
    return gun.get(TABLES.POST_METAS_BY_USER).get(account.is.alias);
};

export const postByPath = (context: IContext, postPath: string) => {
    const {gun} = context;
    return gun.get(TABLES.POSTS).get(postPath);
};

export const postsByDate = (context: IContext, datePath: string) => {
    const {gun} = context;
    return gun.get(TABLES.POSTS).get(datePath).get(TABLE_ENUMS.PUBLIC);
};

export const likesByPostPath = (context: IContext, postPath: string) => {
    const {gun} = context;
    return gun.get(TABLES.POSTS).get(postPath).get(TABLES.LIKES);
};

export const postLikesByCurrentUser = (context: IContext, postPath: string) => {
    const {gun, account} = context;
    return gun.get(TABLES.POSTS).get(postPath).get(TABLES.LIKES).get(account.is.alias);
};
