export const postMetaById = (context: IContext, postId: string) => {
    const {gun} = context;
    return gun.get(TABLES.POST_META_BY_ID).get(postId);
};

export const postMetasByUsername = (context: IContext, username: string) => {
    const {gun} = context;
    return gun.get(TABLES.POST_METAS_BY_USER).get(username);
};

export const postByPath = (context: IContext, postPath: string) => {
    const {gun} = context;
    return gun.get(TABLES.POSTS).get(postPath);
};
