export const currentUserProfile = ({gun, account}: IContext) => gun.get('profiles').get(account.is.alias);

export const profileByUsername = ({gun}: IContext, {username}: any) => gun.get('profiles').get(username);