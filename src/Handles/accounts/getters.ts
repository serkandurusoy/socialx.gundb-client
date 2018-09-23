/**
 * check if there is a account logged in
 * @return a boolean
 */
export const isAccountLoggedIn = ({account}: IInjectedDeps, callback: IGunCallback<any>) => {
    if (!account) {
        return callback('failed, injected parameter');
    }

    return callback(null, {loggedIn: !!account.is});
};
