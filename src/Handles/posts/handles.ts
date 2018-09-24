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
}

export const postByPath = (context: IContext, postPath: string) => {
    const {gun} = context;
    return gun.get(TABLES.POSTS).get(postPath);
};

export const postsByPath = (context: IContext, path: string) => {
    const {gun} = context;
    return gun.get(TABLES.POSTS).get(path);
}

export const postsByDate = (context: IContext, datePath: string) => {
    const {gun} = context;
    return gun.get(TABLES.POSTS).get(datePath).get('public');
}

export const likesByPostPath = (context: IContext, postPath: string) => {
    const {gun} = context;
    return gun.get(TABLES.POSTS).get(postPath).get('likes');
}

export const postLikesByCurrentUser = (context: IContext, postPath: string) => {
    const {gun, account} = context;
    return gun.get(TABLES.POSTS).get(postPath).get('likes').get(account.is.alias);
}
