export const currentAccountRecover = (context: IContext) => {
    const {account} = context;
    return account.get('recover');
};

export const accountByPub = (context: IContext, pub: string) => {
    const {gun} = context;
    return gun.user(pub);
};
