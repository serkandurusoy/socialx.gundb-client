/**
 * check if there is a account logged in
 * @return a boolean
 */
export const isAccountLoggedIn = (context: IContext, callback: IGunCallback<any>) => {
    const {account} = context;
    return callback(null, {loggedIn: !!account.is});
};
